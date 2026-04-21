import type {
  ScheduleFermentationRequest,
  StopFermentationRequest,
  FermentationSession,
  FermentationReport,
  ReportHistory,
} from '../../domain/models/Fermentation'

const BASE_URL = import.meta.env.VITE_API_URL

const HEADERS = () => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  ...(localStorage.getItem('access_token')
    ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` }
    : {}),
})

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const message = await res.text().catch(() => `HTTP ${res.status}`)
    throw new Error(message)
  }
  return res.json()
}

export const fermentationApi = {
  schedule: (data: ScheduleFermentationRequest): Promise<FermentationSession> =>
    fetch(`${BASE_URL}/fermentation/schedule`, {
      method: 'POST',
      headers: HEADERS(),
      body: JSON.stringify(data),
    }).then(handleResponse<FermentationSession>),

  start: (sessionId: number): Promise<FermentationSession> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/start`, {
      method: 'POST',
      headers: HEADERS(),
    }).then(handleResponse<FermentationSession>),

  stop: (sessionId: number, data: StopFermentationRequest): Promise<FermentationSession> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/stop`, {
      method: 'POST',
      headers: HEADERS(),
      body: JSON.stringify(data),
    }).then(handleResponse<FermentationSession>),

  getReport: (sessionId: number): Promise<FermentationReport> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/report`, {
      headers: HEADERS(),
    }).then(handleResponse<FermentationReport>),

  getHistory: (): Promise<ReportHistory[]> =>
    fetch(`${BASE_URL}/fermentation/history`, {
      headers: HEADERS(),
    }).then(handleResponse<ReportHistory[]>),

  getActive: async (): Promise<FermentationSession | null> => {
    const res = await fetch(`${BASE_URL}/fermentation/active`, {
      headers: HEADERS(),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => '')
      console.warn('[fermentationApi.getActive] HTTP', res.status, body)
      return null
    }
    const data = await res.json()
    console.log('[fermentationApi.getActive] response:', data)
    // El backend puede devolver `null` literal cuando no hay sesión activa
    return data ?? null
  },
}