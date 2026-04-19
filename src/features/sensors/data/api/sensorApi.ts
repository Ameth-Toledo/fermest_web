import type { SensorReading, SensorHistoryResponse, BackendSensorType } from '../../domain/models/Sensor'

const BASE_URL = import.meta.env.VITE_API_URL
const WS_URL   = import.meta.env.VITE_WS_URL ?? BASE_URL?.replace(/^http/, 'ws')

const HEADERS = {
  'Content-Type':             'application/json',
  'ngrok-skip-browser-warning': 'true',
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => `HTTP ${res.status}`)
    throw new Error(msg)
  }
  return res.json()
}

// ── REST ──────────────────────────────────────────────────────────────────────
export const sensorApi = {
  getHistory: (
    circuitId:  number,
    sensorType: BackendSensorType,
    sessionId?: number,
    fromDt?:    string,
    toDt?:      string,
  ): Promise<SensorHistoryResponse> => {
    const params = new URLSearchParams()
    if (sessionId) params.set('session_id', String(sessionId))
    if (fromDt)    params.set('from_dt', fromDt)
    if (toDt)      params.set('to_dt', toDt)
    const query = params.toString() ? `?${params}` : ''
    return fetch(`${BASE_URL}/sensors/${circuitId}/${sensorType}/history${query}`, {
      headers: HEADERS,
    }).then(handleResponse<SensorHistoryResponse>)
  },

  getLatest: (
    circuitId:  number,
    sensorType: BackendSensorType,
  ): Promise<SensorReading | null> =>
    fetch(`${BASE_URL}/sensors/${circuitId}/${sensorType}/latest`, {
      headers: HEADERS,
    }).then(handleResponse<SensorReading | null>),

  // ── Sensor command (toggle on/off) ─────────────────────────────────────────
  // TODO: reemplazar con el endpoint real del circuito cuando esté disponible
  // Ejemplo esperado: POST /circuits/{circuitId}/sensors/{sensorType}/toggle
  //   body: { active: boolean }
  toggleSensor: async (
    circuitId:  number,
    sensorType: BackendSensorType,
    active:     boolean,
  ): Promise<void> => {
    await fetch(`${BASE_URL}/circuits/${circuitId}/sensors/${sensorType}/toggle`, {
      method:  'POST',
      headers: HEADERS,
      body:    JSON.stringify({ active }),
    }).then(res => {
      if (!res.ok) throw new Error(`Error al ${active ? 'activar' : 'desactivar'} ${sensorType}`)
    })
  },
}

// ── WebSocket factory ─────────────────────────────────────────────────────────
export const createSensorWebSocket = (circuitId: number): WebSocket =>
  new WebSocket(`${WS_URL}/ws/sensors/${circuitId}`)