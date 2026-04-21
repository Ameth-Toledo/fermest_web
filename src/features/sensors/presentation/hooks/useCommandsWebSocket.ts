import { useRef, useCallback } from 'react'
import {
  createCommandsWebSocket,
  DEFAULT_STATE,
  SENSOR_KEY_TO_COMMAND,
  type DeviceState,
} from '../../data/api/commandsWebSocket'

interface ConnectOptions {
  /** Estado inicial con el que se pre-carga el stateRef (no se envía al abrir). */
  initialState?: Partial<DeviceState>
  /** Callback invocado en onopen, después de aplicar el initialState. */
  onConnected?: () => void
}

export const useCommandsWebSocket = () => {
  const wsRef        = useRef<WebSocket | null>(null)
  const stateRef     = useRef<DeviceState>({ ...DEFAULT_STATE })
  const pendingRef   = useRef<Partial<DeviceState> | null>(null)

  /**
   * Actualiza el estado interno sin transmitir nada por el WS.
   * Se usa al restaurar una sesión activa para que el primer toggle
   * después de reconectar no apague todos los otros dispositivos.
   */
  const syncState = useCallback((changes: Partial<DeviceState>) => {
    stateRef.current = { ...stateRef.current, ...changes }
  }, [])

  const connect = useCallback((circuitId: number, options?: ConnectOptions | (() => void)) => {
    // Soporte para firma antigua: connect(circuitId, onConnected)
    const opts: ConnectOptions =
      typeof options === 'function' ? { onConnected: options } : (options ?? {})

    if (wsRef.current) wsRef.current.close()
    stateRef.current  = { ...DEFAULT_STATE, ...(opts.initialState ?? {}) }
    pendingRef.current = null

    const ws = createCommandsWebSocket(circuitId)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('[WS:Commands] Conectado')
      // Si había un mensaje pendiente, enviarlo ahora
      if (pendingRef.current) {
        stateRef.current = { ...stateRef.current, ...pendingRef.current }
        ws.send(JSON.stringify(stateRef.current))
        pendingRef.current = null
      }
      opts.onConnected?.()
    }

    ws.onerror = (e) => console.error('[WS:Commands] Error', e)
    ws.onclose = () => console.log('[WS:Commands] Desconectado')
  }, [])

  const disconnect = useCallback(() => {
    wsRef.current?.close()
    wsRef.current  = null
    stateRef.current  = { ...DEFAULT_STATE }
    pendingRef.current = null
  }, [])

  const sendCommand = useCallback((changes: Partial<DeviceState>) => {
    stateRef.current = { ...stateRef.current, ...changes }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      // Guardar como pendiente — se enviará en onopen
      pendingRef.current = { ...(pendingRef.current ?? {}), ...changes }
      console.warn('[WS:Commands] WS no listo, guardando como pendiente')
      return
    }

    wsRef.current.send(JSON.stringify(stateRef.current))
  }, [])

  const toggleDevice = useCallback((key: string, active: boolean) => {
    const cmdKey = SENSOR_KEY_TO_COMMAND[key]
    if (!cmdKey) return
    sendCommand({ [cmdKey]: active ? 'encendido' : 'apagado' } as Partial<DeviceState>)
  }, [sendCommand])

  const sendAllOn = useCallback(() => {
    sendCommand({
      motor:                'encendido',
      bomba:                'encendido',
      sensor_temperatura:   'encendido',
      sensor_ph:            'encendido',
      sensor_alcohol:       'encendido',
      sensor_conductividad: 'encendido',
      sensor_turbidez:      'encendido',
    })
  }, [sendCommand])

  const sendAllOff = useCallback(() => {
    sendCommand({ ...DEFAULT_STATE })
  }, [sendCommand])

  return { connect, disconnect, toggleDevice, sendAllOn, sendAllOff, syncState }
}
