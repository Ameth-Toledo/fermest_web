// ── Lecturas ──────────────────────────────────────────────────────────────────
export interface SensorReading {
  id: number
  circuit_id: number
  sensor_type: BackendSensorType
  value: number
  session_id: number | null
  timestamp: string
}

export interface SensorHistoryResponse {
  circuit_id: number
  sensor_type: BackendSensorType
  readings: SensorReading[]
}

// ── WebSocket messages ────────────────────────────────────────────────────────
export interface WSSensorDataMessage {
  type: 'sensor_data'
  circuit_id: number
  sensor_type: BackendSensorType
  value: number
  session_id: number | null
  timestamp: string
}

export interface WSSensorDeactivatedMessage {
  type: 'sensor_deactivated'
  circuit_id: number
  sensor_type: BackendSensorType
  session_id: number
  deactivated_at: string
}

export type WSMessage = WSSensorDataMessage | WSSensorDeactivatedMessage

// ── Tipos de sensores ─────────────────────────────────────────────────────────
export type BackendSensorType =
  | 'alcohol'
  | 'conductivity'
  | 'ph'
  | 'temperature'
  | 'turbidity'
  | 'rpm'

export type SensorKey = BackendSensorType | 'pump'

export interface SensorMeta {
  key: BackendSensorType
  label: string
  unit: string
  color: string
  description: string
}

export const SENSOR_META: SensorMeta[] = [
  { key: 'temperature',  label: 'Temperatura',  unit: '°C',    color: '#F59E0B', description: 'Sensor térmico'          },
  { key: 'alcohol',      label: 'Alcohol',      unit: '%v/v',  color: '#22C55E', description: 'Concentración etanol'    },
  { key: 'conductivity', label: 'Conductividad',unit: 'mS/cm', color: '#3B82F6', description: 'Conductividad iónica'    },
  { key: 'turbidity',    label: 'Turbidez',     unit: 'NTU',   color: '#A78BFA', description: 'Densidad óptica'         },
  //{ key: 'ph',           label: 'pH',           unit: 'pH',    color: '#F43F5E', description: 'Potencial de hidrógeno'  },
  { key: 'rpm',          label: 'Motor RPM',    unit: 'rpm',   color: '#06B6D4', description: 'Velocidad de agitación'  },
]

// Hardware controls (not real sensor readings — shown in FermentationView toggles)
export const HARDWARE_CONTROLS = [
  { key: 'rpm'  as SensorKey, label: 'Motor (RPM)', color: '#06B6D4', isHardware: true },
  { key: 'pump' as SensorKey, label: 'Bomba',        color: '#FB923C', isHardware: true },
]

// Combined list used by FermentationView
export interface SensorControl {
  key: SensorKey
  label: string
  description: string
  unit: string
  color: string
  isHardware?: boolean
}

export const SENSOR_CONTROLS: SensorControl[] = [
  ...SENSOR_META.filter(s => s.key !== 'rpm').map(s => ({ ...s, isHardware: false })),
  { key: 'rpm',  label: 'Motor (RPM)', description: 'Velocidad de agitación', unit: 'rpm',    color: '#06B6D4', isHardware: true },
  { key: 'pump', label: 'Bomba',       description: 'Control de flujo',       unit: 'ON/OFF', color: '#FB923C', isHardware: true },
]

export type SensorToggleState = Record<SensorKey, boolean>

export const ALL_SENSORS_OFF: SensorToggleState = {
  temperature: false, alcohol: false, conductivity: false,
  ph: false, turbidity: false, rpm: false, pump: false,
}

export const ALL_SENSORS_ON: SensorToggleState = {
  temperature: true, alcohol: true, conductivity: true,
  ph: true, turbidity: true, rpm: true, pump: true,
}

// Chart data point (derived from SensorReading)
export interface ChartPoint {
  time: string   // formatted timestamp for X axis
  value: number
}

export type SensorChartData = Record<BackendSensorType, ChartPoint[]>