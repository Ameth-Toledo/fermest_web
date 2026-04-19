import type {
  ScheduleFermentationRequest,
  StopFermentationRequest,
  FermentationSession,
  FermentationReport,
  ReportHistory,
} from '../models/Fermentation'

export interface FermentationRepository {
  scheduleFermentation(data: ScheduleFermentationRequest): Promise<FermentationSession>
  startFermentation(sessionId: number): Promise<FermentationSession>
  stopFermentation(sessionId: number, data: StopFermentationRequest): Promise<FermentationSession>
  getReport(sessionId: number): Promise<FermentationReport>
  getReportHistory(): Promise<ReportHistory[]>
}