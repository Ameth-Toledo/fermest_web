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
    return fermentationApi.schedule(data)
  }

  async startFermentation(sessionId: number): Promise<FermentationSession> {
    return fermentationApi.start(sessionId)
  }

  async stopFermentation(
    sessionId: number,
    data: StopFermentationRequest,
  ): Promise<FermentationSession> {
    return fermentationApi.stop(sessionId, data)
  }

  async getReport(sessionId: number): Promise<FermentationReport> {
    return fermentationApi.getReport(sessionId)
  }

  async getReportHistory(): Promise<ReportHistory[]> {
    return fermentationApi.getHistory()
  }

  async getActiveSession(): Promise<FermentationSession | null> {
    return fermentationApi.getActive()
  }
}