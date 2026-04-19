import type { SensorReading, SensorHistoryResponse, BackendSensorType } from '../models/Sensor'

export interface SensorRepository {
  getHistory(
    circuitId: number,
    sensorType: BackendSensorType,
    sessionId?: number,
    fromDt?: string,
    toDt?: string,
  ): Promise<SensorHistoryResponse>

  getLatest(
    circuitId: number,
    sensorType: BackendSensorType,
  ): Promise<SensorReading | null>

  toggleSensor(
    circuitId: number,
    sensorType: BackendSensorType,
    active: boolean,
  ): Promise<void>
}