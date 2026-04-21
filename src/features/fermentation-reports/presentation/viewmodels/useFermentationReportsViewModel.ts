import { useState, useEffect, useCallback } from 'react'
import {
  fermentationApi,
  type FermentationSessionResponse,
  type FermentationReportData,
} from '../../../fermentation/data/api/fermentationApi'
import type { Status } from '../types/Status'
import type { Report } from '../constants/mockReports'

export type ReportWithEfficiency = Report & { efficiency: number | null }

// ── Helpers ───────────────────────────────────────────────────────────────────

const mapStatus = (s: string): Status =>
  (['running', 'completed', 'interrupted', 'scheduled'].includes(s)
    ? s
    : 'completed') as Status

const formatDt = (iso: string): string =>
  new Date(iso)
    .toLocaleString('es-MX', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
    .replace(',', '')

const calcDuration = (start: string, end: string): string => {
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms <= 0) return '—'
  const h = Math.floor(ms / 3_600_000)
  const m = Math.floor((ms % 3_600_000) / 60_000)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

// ── Adaptador ─────────────────────────────────────────────────────────────────

const merge = (
  session: FermentationSessionResponse,
  report:  FermentationReportData | null,
): ReportWithEfficiency => {
  // Para cada sensor usamos: final → last_reading → initial → 0
  const ph   = report?.ph_final          ?? report?.ph_last_reading          ?? report?.ph_initial          ?? 0
  const temp = report?.temperature_final ?? report?.temperature_last_reading ?? report?.temperature_initial ?? 0

  // Etanol: el back ya lo calcula en ethanol_detected al hacer stop
  const etanol = report?.ethanol_detected ?? report?.alcohol_final ?? report?.alcohol_last_reading ?? 0

  return {
    id:         session.id,
    circuit:    session.circuit_id,
    start:      session.actual_start
                  ? formatDt(session.actual_start)
                  : formatDt(session.scheduled_start),
    end:        session.actual_end ? formatDt(session.actual_end) : '—',
    duration:   session.actual_start && session.actual_end
                  ? calcDuration(session.actual_start, session.actual_end)
                  : '—',
    ph:         Math.round(ph   * 100) / 100,
    temp:       Math.round(temp * 10)  / 10,
    sugar:      report?.initial_sugar ?? 0,
    etanol:     Math.round(etanol * 100) / 100,
    status:     mapStatus(session.status),
    efficiency: report?.efficiency ?? null,
  }
}

// ── ViewModel ─────────────────────────────────────────────────────────────────

export const useFermentationReportsViewModel = () => {
  const [reports, setReports] = useState<ReportWithEfficiency[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Todas las sesiones del usuario (contiene status, circuit_id, fechas)
      const sessions = await fermentationApi.getSessionsHistory()

      // 2. Reporte de cada sesión en paralelo
      //    Las sesiones 'scheduled' no tienen reporte aún → catch devuelve null
      const reportResults = await Promise.allSettled(
        sessions.map(s =>
          fermentationApi.getReportBySessionId(s.id).catch(() => null)
        )
      )

      // 3. Merge y ordenar (más recientes primero, ya viene así del back)
      const merged: ReportWithEfficiency[] = sessions.map((session, i) => {
        const result = reportResults[i]
        const report = result.status === 'fulfilled' ? result.value : null
        return merge(session, report)
      })

      setReports(merged)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los reportes')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  return { reports, loading, error, refetch: fetchReports }
}