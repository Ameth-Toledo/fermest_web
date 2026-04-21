import { useState, useEffect, useRef, useCallback } from 'react'
import { SensorRepositoryImpl } from '../../data/repositories/SensorRepositoryImpl'
import { createSensorWebSocket } from '../../data/api/sensorApi'
import type {
  BackendSensorType,
  ChartPoint,
  SensorChartData,
  WSMessage,
} from '../../domain/models/Sensor'
import { SENSOR_META } from '../../domain/models/Sensor'

const repository = new SensorRepositoryImpl()
const MAX_CHART_POINTS = 50

const emptyChartData = (): SensorChartData => {
  const data = {} as Record<BackendSensorType, ChartPoint[]>
  SENSOR_META.forEach(s => { data[s.key] = [] })
  return data as SensorChartData
}

const formatTime = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export type WsStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface SensorsViewModelOptions {
  /** Si se pasa, el hook se auto-conecta al montar y cuando cambie */
  autoCircuitId?: number
  /** Si se pasa, el historial inicial se filtra por esta sesión */
  autoSessionId?: number
}

export const useSensorsViewModel = (options?: SensorsViewModelOptions) => {
  const [circuitId, setCircuitId] = useState<number>(options?.autoCircuitId ?? 1)
  const [wsStatus, setWsStatus] = useState<WsStatus>('disconnected')
  const [chartData, setChartData] = useState<SensorChartData>(emptyChartData())
  const [latestValues, setLatestValues] = useState<Partial<Record<BackendSensorType, number>>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)

  const appendPoint = useCallback((sensorType: BackendSensorType, value: number, timestamp: string) => {
    const point: ChartPoint = { time: formatTime(timestamp), value }
    setChartData(prev => ({
      ...prev,
      [sensorType]: [...prev[sensorType].slice(-(MAX_CHART_POINTS - 1)), point],
    }))
    setLatestValues(prev => ({ ...prev, [sensorType]: value }))
  }, [])

  const loadHistory = useCallback(async (id: number, sessionId?: number) => {
    setLoading(true)
    setError(null)
    try {
      const results = await Promise.allSettled(
        SENSOR_META.map(s => repository.getHistory(id, s.key, sessionId))
      )
      const next = emptyChartData()
      results.forEach((result, i) => {
        if (result.status === 'fulfilled') {
          const sensorType = SENSOR_META[i].key
          next[sensorType] = result.value.readings.map(r => ({
            time: formatTime(r.timestamp),
            value: r.value,
          }))
          const last = result.value.readings.at(-1)
          if (last) setLatestValues(prev => ({ ...prev, [sensorType]: last.value }))
        }
      })
      setChartData(next)
    } catch {
      setError('Error al cargar el historial de sensores')
    } finally {
      setLoading(false)
    }
  }, [])

  const connectWs = useCallback((id: number) => {
    if (wsRef.current) wsRef.current.close()
    setWsStatus('connecting')

    const ws = createSensorWebSocket(id)
    wsRef.current = ws

    ws.onopen = () => setWsStatus('connected')
    ws.onerror = () => setWsStatus('error')
    ws.onclose = () => { setWsStatus('disconnected'); wsRef.current = null }
    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: WSMessage = JSON.parse(event.data)
        if (msg.type === 'sensor_data') {
          appendPoint(msg.sensor_type, msg.value, msg.timestamp)
        }
      } catch {
        // mensaje malformado — ignorar
      }
    }
  }, [appendPoint])

  const disconnectWs = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setWsStatus('disconnected')
  }, [])

  const applyCircuit = useCallback((id: number, sessionId?: number) => {
    setCircuitId(id)
    setChartData(emptyChartData())
    setLatestValues({})
    loadHistory(id, sessionId)
    connectWs(id)
  }, [loadHistory, connectWs])

  // ── Auto-conectar cuando llega un circuitId desde el contexto de fermentación
  useEffect(() => {
    const id = options?.autoCircuitId
    const sessionId = options?.autoSessionId
    if (!id) return
    applyCircuit(id, sessionId)
    return () => { wsRef.current?.close() }
  }, [options?.autoCircuitId, options?.autoSessionId])

  // ── Cleanup al desmontar (uso manual sin autoCircuitId)
  useEffect(() => {
    return () => { wsRef.current?.close() }
  }, [])

  return {
    circuitId,
    wsStatus,
    chartData,
    latestValues,
    loading,
    error,
    setCircuitId,
    applyCircuit,
    connectWs,
    disconnectWs,
    loadHistory,
  }
}