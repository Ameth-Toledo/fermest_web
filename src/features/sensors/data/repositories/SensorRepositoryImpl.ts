import { sensorApi } from '../api/sensorApi'
import type { SensorRepository } from '../../domain/repositories/SensorRepository'
import type { SensorReading, SensorHistoryResponse, BackendSensorType } from '../../domain/models/Sensor'

export class SensorRepositoryImpl implements SensorRepository {
  async getHistory(
    circuitId:  number,
    sensorType: BackendSensorType,
    sessionId?: number,
    fromDt?:    string,
    toDt?:      string,
  ): Promise<SensorHistoryResponse> {
    return sensorApi.getHistory(circuitId, sensorType, sessionId, fromDt, toDt)
  }

  async getLatest(
    circuitId:  number,
    sensorType: BackendSensorType,
  ): Promise<SensorReading | null> {
    return sensorApi.getLatest(circuitId, sensorType)
  }

  async toggleSensor(
    circuitId:  number,
    sensorType: BackendSensorType,
    active:     boolean,
  ): Promise<void> {
    return sensorApi.toggleSensor(circuitId, sensorType, active)
  }
}