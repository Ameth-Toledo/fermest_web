// src/features/fermentation/data/api/fermentationApi.ts
const BASE_URL = import.meta.env.VITE_API_URL

const getHeaders = () => ({
  'Content-Type':               'application/json',
  'ngrok-skip-browser-warning': 'true',
  'Authorization':              `Bearer ${localStorage.getItem('access_token') ?? ''}`,
})

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const msg = await res.text().catch(() => `HTTP ${res.status}`)
    throw new Error(msg)
  }
  return res.json()
}

// ── Tipos ─────────────────────────────────────────────────────────────────────

export type FermentationSessionResponse = {
  id:              number
  circuit_id:      number
  user_id:         number
  formula_id:      number
  scheduled_start: string
  scheduled_end:   string
  actual_start:    string | null
  actual_end:      string | null
  status:          string
  interrupted_by:  number | null
  created_at:      string | null
}

export type FermentationReportData = {
  id:                          number
  session_id:                  number
  initial_sugar:               number
  final_sugar:                 number | null
  ethanol_detected:            number | null
  theoretical_ethanol:         number | null
  efficiency:                  number | null
  alcohol_initial:             number | null
  alcohol_final:               number | null
  alcohol_last_reading:        number | null
  density_initial:             number | null
  density_final:               number | null
  density_last_reading:        number | null
  conductivity_initial:        number | null
  conductivity_final:          number | null
  conductivity_last_reading:   number | null
  ph_initial:                  number | null
  ph_final:                    number | null
  ph_last_reading:             number | null
  temperature_initial:         number | null
  temperature_final:           number | null
  temperature_last_reading:    number | null
  turbidity_initial:           number | null
  turbidity_final:             number | null
  turbidity_last_reading:      number | null
  rpm_initial:                 number | null
  rpm_final:                   number | null
  rpm_last_reading:            number | null
  notes:                       string | null
  generated_at:                string | null
}

export type ReportHistoryItem = {
  id:          number
  report_id:   number
  user_id:     number
  action:      string
  occurred_at: string | null
}

// ── API ───────────────────────────────────────────────────────────────────────

export const fermentationApi = {
  scheduleFermentation: (body: {
    circuit_id:      number
    scheduled_start: string
    scheduled_end:   string
    initial_sugar:   number
  }): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/schedule`, {
      method:  'POST',
      headers: getHeaders(),
      body:    JSON.stringify(body),
    }).then(handleResponse<FermentationSessionResponse>),

  startFermentation: (sessionId: number): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/start`, {
      method:  'POST',
      headers: getHeaders(),
    }).then(handleResponse<FermentationSessionResponse>),

  stopFermentation: (
    sessionId:   number,
    interrupted: boolean,
  ): Promise<FermentationSessionResponse> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/stop`, {
      method:  'POST',
      headers: getHeaders(),
      body:    JSON.stringify({ interrupted }),
    }).then(handleResponse<FermentationSessionResponse>),

  getActiveSession: (): Promise<FermentationSessionResponse | null> =>
    fetch(`${BASE_URL}/fermentation/active`, {
      headers: getHeaders(),
    }).then(handleResponse<FermentationSessionResponse | null>),

  getSessionsHistory: (): Promise<FermentationSessionResponse[]> =>
    fetch(`${BASE_URL}/fermentation/sessions`, {
      headers: getHeaders(),
    }).then(handleResponse<FermentationSessionResponse[]>),

  getReportBySessionId: (sessionId: number): Promise<FermentationReportData> =>
    fetch(`${BASE_URL}/fermentation/${sessionId}/report`, {
      headers: getHeaders(),
    }).then(handleResponse<FermentationReportData>),

  getReportHistory: (): Promise<ReportHistoryItem[]> =>
    fetch(`${BASE_URL}/fermentation/history`, {
      headers: getHeaders(),
    }).then(handleResponse<ReportHistoryItem[]>),
}