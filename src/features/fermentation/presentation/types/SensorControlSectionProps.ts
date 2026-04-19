import type { SensorKey } from '../../domain/models/Fermentation'

export type SensorControlSectionProps = {
  sensorStates: Record<SensorKey, boolean>
  loading: boolean
  onToggle: (key: SensorKey) => void
}
