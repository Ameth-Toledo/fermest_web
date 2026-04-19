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

  SENSOR_META.forEach(s => {
    data[s.key] = []
  })

  return data as SensorChartData
}

const formatTime = (iso: string): string => {
  const d = new Date(iso)
  return d.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export type WsStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export const useSensorsViewModel = () => {
  const [circuitId, setCircuitId]       = useState<number>(1)
  const [wsStatus, setWsStatus]         = useState<WsStatus>('disconnected')
  const [chartData, setChartData]       = useState<SensorChartData>(emptyChartData())
  const [latestValues, setLatestValues] = useState<Partial<Record<BackendSensorType, number>>>({})
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)

  // ── Append a point to a sensor's chart (capped at MAX_CHART_POINTS) ─────────
  const appendPoint = useCallback((sensorType: BackendSensorType, value: number, timestamp: string) => {
    const point: ChartPoint = { time: formatTime(timestamp), value }
    setChartData(prev => ({
      ...prev,
      [sensorType]: [...prev[sensorType].slice(-(MAX_CHART_POINTS - 1)), point],
    }))
    setLatestValues(prev => ({ ...prev, [sensorType]: value }))
  }, [])

  // ── Load history for all sensors ─────────────────────────────────────────────
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
            time:  formatTime(r.timestamp),
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

  // ── WebSocket connect / disconnect ────────────────────────────────────────────
  const connectWs = useCallback((id: number) => {
    if (wsRef.current) {
      wsRef.current.close()
    }
    setWsStatus('connecting')

    const ws = createSensorWebSocket(id)
    wsRef.current = ws

    ws.onopen = () => setWsStatus('connected')

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: WSMessage = JSON.parse(event.data)
        if (msg.type === 'sensor_data') {
          appendPoint(msg.sensor_type, msg.value, msg.timestamp)
        }
        // sensor_deactivated → no chart action needed, fermentation handles that
      } catch {
        // malformed message — ignore
      }
    }

    ws.onerror = () => setWsStatus('error')

    ws.onclose = () => {
      setWsStatus('disconnected')
      wsRef.current = null
    }
  }, [appendPoint])

  const disconnectWs = useCallback(() => {
    wsRef.current?.close()
    wsRef.current = null
    setWsStatus('disconnected')
  }, [])

  // ── Cleanup on unmount ────────────────────────────────────────────────────────
  useEffect(() => {
    return () => { wsRef.current?.close() }
  }, [])

  // ── Apply circuit change ──────────────────────────────────────────────────────
  const applyCircuit = useCallback((id: number) => {
    setCircuitId(id)
    setChartData(emptyChartData())
    setLatestValues({})
    loadHistory(id)
    connectWs(id)
  }, [loadHistory, connectWs])

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