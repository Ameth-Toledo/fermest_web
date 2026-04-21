import { useState, useCallback, useEffect, useRef } from 'react'
import { FermentationRepositoryImpl } from '../../data/repositories/FermentationRepositoryImpl'
import { userAuth } from '../../../../core/hooks/userAuth'
import { useCommandsWebSocket } from '../../../sensors/presentation/hooks/useCommandsWebSocket'
import { SENSOR_KEY_TO_COMMAND, type DeviceState } from '../../../sensors/data/api/commandsWebSocket'
import type { FermentationSession, FermentationReport } from '../../domain/models/Fermentation'
import type { SensorKey, SensorToggleState } from '../../../sensors/domain/models/Sensor'
import { ALL_SENSORS_OFF, ALL_SENSORS_ON } from '../../../sensors/domain/models/Sensor'
import type { FermentationFormData } from '../types/FermentationFormData'

const repository = new FermentationRepositoryImpl()

// ── Persistencia local del estado de toggles por sesión ───────────────────────
const LS_PREFIX = 'fermentation_sensor_states_'
const lsKey = (sessionId: number) => `${LS_PREFIX}${sessionId}`

const loadSensorStates = (sessionId: number): SensorToggleState | null => {
  try {
    const raw = localStorage.getItem(lsKey(sessionId))
    if (!raw) return null
    const parsed = JSON.parse(raw) as SensorToggleState
    return { ...ALL_SENSORS_OFF, ...parsed }
  } catch {
    return null
  }
}

const saveSensorStates = (sessionId: number, states: SensorToggleState) => {
  try {
    localStorage.setItem(lsKey(sessionId), JSON.stringify(states))
  } catch {
    /* ignore */
  }
}

const clearSensorStates = (sessionId: number) => {
  try {
    localStorage.removeItem(lsKey(sessionId))
  } catch {
    /* ignore */
  }
}

// Convierte el SensorToggleState del front en el DeviceState que espera el WS
const toDeviceState = (states: SensorToggleState): Partial<DeviceState> => {
  const result: Partial<DeviceState> = {}
  ;(Object.keys(states) as SensorKey[]).forEach(key => {
    const cmdKey = SENSOR_KEY_TO_COMMAND[key]
    if (cmdKey) {
      result[cmdKey] = states[key] ? 'encendido' : 'apagado'
    }
  })
  return result
}

export const useFermentationViewModel = () => {
  const { user } = userAuth()
  const commands = useCommandsWebSocket()

  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [session, setSession]               = useState<FermentationSession | null>(null)
  const [report, setReport]                 = useState<FermentationReport | null>(null)
  const [sensorStates, setSensorStates]     = useState<SensorToggleState>(ALL_SENSORS_OFF)
  const [showForm, setShowForm]             = useState(false)

  // Ref auxiliar para saber si estamos hidratando desde backend/localStorage
  // (evita persistir mientras rellenamos el estado inicial).
  const hydratedRef = useRef(false)

  const isRunning = session?.status === 'running'
  const circuitId = user?.circuit_id ?? null

  const clearMessages = () => { setError(null); setSuccessMessage(null) }

  // ── Persistir sensorStates por sesión activa ───────────────────────────────
  useEffect(() => {
    if (!hydratedRef.current) return
    if (session && session.status === 'running') {
      saveSensorStates(session.id, sensorStates)
    }
  }, [sensorStates, session])

  // ── Restaurar sesión activa al montar ──────────────────────────────────────
  useEffect(() => {
    if (!circuitId) return

    let cancelled = false

    const init = async () => {
      try {
        const active = await repository.getActiveSession()
        if (cancelled) return

        if (active) {
          const stored = loadSensorStates(active.id)
          const restoredStates = stored ?? ALL_SENSORS_ON

          setSession(active)
          setSensorStates(restoredStates)
          hydratedRef.current = true

          // Alinear el stateRef interno del WS con el estado restaurado
          // para que el primer toggle no apague los demás dispositivos.
          commands.connect(circuitId, {
            initialState: toDeviceState(restoredStates),
          })
        } else {
          hydratedRef.current = true
        }
      } catch {
        // Sin sesión activa, estado inicial vacío está bien
        hydratedRef.current = true
      }
    }

    init()

    // Desconectar WS al desmontar la vista. NO tocamos el estado persistido
    // en localStorage aquí: queremos poder restaurar al volver a entrar.
    return () => {
      cancelled = true
      commands.disconnect()
    }
  }, [circuitId])

  // ── Start ──────────────────────────────────────────────────────────────────
  const startFermentation = useCallback(async (formData: FermentationFormData) => {
    if (!circuitId) { setError('No hay un circuito asociado a tu cuenta'); return }
    setLoading(true); clearMessages()
    try {
      const scheduled = await repository.scheduleFermentation({
        circuit_id:      circuitId,
        scheduled_start: formData.scheduled_start,
        scheduled_end:   formData.scheduled_end,
        initial_sugar:   formData.initial_sugar,
      })
      const started = await repository.startFermentation(scheduled.id)
      setSession(started)
      setSensorStates(ALL_SENSORS_ON)
      hydratedRef.current = true
      saveSensorStates(started.id, ALL_SENSORS_ON)
      commands.connect(circuitId, {
        initialState: toDeviceState(ALL_SENSORS_ON),
        onConnected:  () => commands.sendAllOn(),
      })
      setSuccessMessage('Fermentación iniciada correctamente')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar la fermentación')
    } finally {
      setLoading(false)
    }
  }, [circuitId, commands])

  // ── Stop ───────────────────────────────────────────────────────────────────
  const stopFermentation = useCallback(async (interrupted = true) => {
    if (!session) return
    setLoading(true); clearMessages()
    try {
      commands.sendAllOff()
      setTimeout(() => commands.disconnect(), 500)
      const stopped = await repository.stopFermentation(session.id, { interrupted })
      setSession(stopped)
      setSensorStates(ALL_SENSORS_OFF)
      clearSensorStates(session.id)
      setSuccessMessage('Fermentación detenida')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al detener la fermentación')
    } finally {
      setLoading(false)
    }
  }, [session, commands])

  // ── Toggle individual ──────────────────────────────────────────────────────
  const toggleSensor = useCallback(async (key: SensorKey) => {
    const nextValue = !sensorStates[key]
    setSensorStates(prev => {
      const next = { ...prev, [key]: nextValue }
      if (session && session.status === 'running') {
        saveSensorStates(session.id, next)
      }
      return next
    })
    commands.toggleDevice(key, nextValue)
  }, [sensorStates, commands, session])

  // ── Reporte ────────────────────────────────────────────────────────────────
  const loadReport = useCallback(async () => {
    if (!session) return
    setLoading(true); clearMessages()
    try {
      const r = await repository.getReport(session.id)
      setReport(r)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el reporte')
    } finally {
      setLoading(false)
    }
  }, [session])

  return {
    loading, error, successMessage,
    session, report, sensorStates,
    showForm, isRunning, circuitId,
    setShowForm,
    startFermentation, stopFermentation,
    toggleSensor, loadReport,
  }
}
