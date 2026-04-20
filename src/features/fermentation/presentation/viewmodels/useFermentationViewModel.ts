import { useState, useCallback } from 'react'
import { FermentationRepositoryImpl } from '../../data/repositories/FermentationRepositoryImpl'
import { sensorApi } from '../../../sensors/data/api/sensorApi'
import { userAuth } from '../../../../core/hooks/userAuth'
import type { FermentationSession, FermentationReport } from '../../domain/models/Fermentation'
import type { SensorKey, BackendSensorType, SensorToggleState } from '../../../sensors/domain/models/Sensor'
import { ALL_SENSORS_OFF, ALL_SENSORS_ON } from '../../../sensors/domain/models/Sensor'
import type { FermentationFormData } from '../types/FermentationFormData'

const repository = new FermentationRepositoryImpl()

export const useFermentationViewModel = () => {
  const { user } = userAuth()

  const [loading, setLoading]               = useState(false)
  const [error, setError]                   = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [session, setSession]               = useState<FermentationSession | null>(null)
  const [report, setReport]                 = useState<FermentationReport | null>(null)
  const [sensorStates, setSensorStates]     = useState<SensorToggleState>(ALL_SENSORS_OFF)
  const [showForm, setShowForm]             = useState(false)

  const isRunning  = session?.status === 'running'
  const circuitId  = user?.circuit_id ?? null

  const clearMessages = () => {
    setError(null)
    setSuccessMessage(null)
  }

  // ── Schedule → Start ────────────────────────────────────────────────────────
  const startFermentation = useCallback(async (formData: FermentationFormData) => {
    if (!circuitId) {
      setError('No hay un circuito asociado a tu cuenta')
      return
    }

    setLoading(true)
    clearMessages()
    try {
      const scheduled = await repository.scheduleFermentation({
        circuit_id:      circuitId,           // ← viene del usuario, no del form
        scheduled_start: formData.scheduled_start,
        scheduled_end:   formData.scheduled_end,
        initial_sugar:   formData.initial_sugar,
      })
      const started = await repository.startFermentation(scheduled.id)
      setSession(started)
      setSensorStates(ALL_SENSORS_ON)
      setSuccessMessage('Fermentación iniciada correctamente')
      setShowForm(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar la fermentación')
    } finally {
      setLoading(false)
    }
  }, [circuitId])

  // ── Stop ────────────────────────────────────────────────────────────────────
  const stopFermentation = useCallback(async (interrupted = true) => {
    if (!session) return
    setLoading(true)
    clearMessages()
    try {
      const stopped = await repository.stopFermentation(session.id, { interrupted })
      setSession(stopped)
      setSensorStates(ALL_SENSORS_OFF)
      setSuccessMessage('Fermentación detenida')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al detener la fermentación')
    } finally {
      setLoading(false)
    }
  }, [session])

  // ── Toggle individual sensor ────────────────────────────────────────────────
  const toggleSensor = useCallback(async (key: SensorKey) => {
    if (!session) {
      setSensorStates(prev => ({ ...prev, [key]: !prev[key] }))
      return
    }

    const nextValue = !sensorStates[key]
    setSensorStates(prev => ({ ...prev, [key]: nextValue }))

    if (key === 'pump') return  // hardware sin endpoint backend

    try {
      await sensorApi.toggleSensor(session.circuit_id, key as BackendSensorType, nextValue)
    } catch (err) {
      setSensorStates(prev => ({ ...prev, [key]: !nextValue }))  // revertir
      setError(err instanceof Error ? err.message : `Error al controlar sensor ${key}`)
    }
  }, [session, sensorStates])

  // ── Cargar reporte ──────────────────────────────────────────────────────────
  const loadReport = useCallback(async () => {
    if (!session) return
    setLoading(true)
    clearMessages()
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
    loading,
    error,
    successMessage,
    session,
    report,
    sensorStates,
    showForm,
    isRunning,
    circuitId,
    setShowForm,
    startFermentation,
    stopFermentation,
    toggleSensor,
    loadReport,
  }
}