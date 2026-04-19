export interface ScheduleFermentationRequest {
  circuit_id: number
  scheduled_start: string
  scheduled_end: string
  initial_sugar: number
}

export interface StopFermentationRequest {
  interrupted: boolean
}

export type FermentationStatus = 'scheduled' | 'running' | 'completed' | 'interrupted'

export interface FermentationSession {
  id: number
  circuit_id: number
  user_id: number
  formula_id: number
  scheduled_start: string
  scheduled_end: string
  actual_start: string | null
  actual_end: string | null
  status: FermentationStatus
  interrupted_by: number | null
  created_at: string | null
}

export interface FermentationReport {
  id: number
  session_id: number
  initial_sugar: number
  final_sugar: number | null
  ethanol_detected: number | null
  theoretical_ethanol: number | null
  efficiency: number | null
  alcohol_initial: number | null
  alcohol_final: number | null
  alcohol_deactivated_at: string | null
  alcohol_last_reading: number | null
  density_initial: number | null
  density_final: number | null
  density_deactivated_at: string | null
  density_last_reading: number | null
  conductivity_initial: number | null
  conductivity_final: number | null
  conductivity_deactivated_at: string | null
  conductivity_last_reading: number | null
  ph_initial: number | null
  ph_final: number | null
  ph_deactivated_at: string | null
  ph_last_reading: number | null
  temperature_initial: number | null
  temperature_final: number | null
  temperature_deactivated_at: string | null
  temperature_last_reading: number | null
  turbidity_initial: number | null
  turbidity_final: number | null
  turbidity_deactivated_at: string | null
  turbidity_last_reading: number | null
  rpm_initial: number | null
  rpm_final: number | null
  rpm_deactivated_at: string | null
  rpm_last_reading: number | null
  notes: string | null
  generated_at: string | null
}

export interface ReportHistory {
  id: number
  report_id: number
  user_id: number
  action: string
  occurred_at: string | null
}

export type BackendSensorType =
  | 'alcohol'
  | 'conductivity'
  | 'ph'
  | 'temperature'
  | 'turbidity'
  | 'rpm'

export type SensorKey = BackendSensorType | 'pump'

export interface SensorControl {
  key: SensorKey
  label: string
  description: string
  unit: string
  color: string
  isHardware?: boolean
}

export const SENSOR_CONTROLS: SensorControl[] = [
  { key: 'temperature',  label: 'Temperatura',   description: 'Sensor térmico',         unit: '°C',    color: '#F59E0B' },
  { key: 'alcohol',      label: 'Alcohol',        description: 'Concentración etanol',   unit: '%v/v',  color: '#22C55E' },
  { key: 'conductivity', label: 'Conductividad',  description: 'Conductividad iónica',   unit: 'mS/cm', color: '#3B82F6' },
  { key: 'turbidity',    label: 'Turbidez',       description: 'Densidad óptica',        unit: 'NTU',   color: '#A78BFA' },
  { key: 'ph',           label: 'pH',             description: 'Potencial de hidrógeno', unit: 'pH',    color: '#F43F5E' },
  { key: 'rpm',          label: 'Motor (RPM)',    description: 'Velocidad de agitación', unit: 'rpm',   color: '#06B6D4', isHardware: true },
  { key: 'pump',         label: 'Bomba',          description: 'Control de flujo',       unit: 'ON/OFF',color: '#FB923C', isHardware: true },
]