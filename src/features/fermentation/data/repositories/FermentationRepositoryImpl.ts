import { fermentationApi } from '../api/fermentationApi'
import type { FermentationRepository } from '../../domain/repositories/FermentationRepository'
import type {
  ScheduleFermentationRequest,
  StopFermentationRequest,
  FermentationSession,
  FermentationReport,
  ReportHistory,
} from '../../domain/models/Fermentation'

export class FermentationRepositoryImpl implements FermentationRepository {

  async scheduleFermentation(data: ScheduleFermentationRequest): Promise<FermentationSession> {
    return fermentationApi.scheduleFermentation({
      circuit_id:      data.circuit_id,
      scheduled_start: data.scheduled_start,
      scheduled_end:   data.scheduled_end,
      initial_sugar:   data.initial_sugar,
    }) as Promise<FermentationSession>
  }

  async startFermentation(sessionId: number): Promise<FermentationSession> {
    return fermentationApi.startFermentation(sessionId) as Promise<FermentationSession>
  }

  async stopFermentation(sessionId: number, data: StopFermentationRequest): Promise<FermentationSession> {
    return fermentationApi.stopFermentation(sessionId, data.interrupted) as Promise<FermentationSession>
  }

  async getReport(sessionId: number): Promise<FermentationReport> {
    return fermentationApi.getReportBySessionId(sessionId) as Promise<FermentationReport>
  }

  async getReportHistory(): Promise<ReportHistory[]> {
    return fermentationApi.getReportHistory() as Promise<ReportHistory[]>
  }

  async getActiveSession(): Promise<FermentationSession | null> {
    return fermentationApi.getActiveSession() as Promise<FermentationSession | null>
  }
}