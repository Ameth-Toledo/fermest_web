import type { Status } from '../types/Status'

export type Report = {
  id:       number
  circuit:  number
  start:    string
  end:      string
  duration: string
  ph:       number
  temp:     number
  sugar:    number
  etanol:   number
  status:   Status
}

export const MOCK_REPORTS: Report[] = [
  { id: 1, circuit: 3, start: '2026-04-18 08:00', end: '2026-04-19 08:00', duration: '24h', ph: 4.8, temp: 22.5, sugar: 120, etanol: 58.2,  status: 'completed'   },
  { id: 2, circuit: 1, start: '2026-04-16 14:00', end: '2026-04-17 18:00', duration: '28h', ph: 5.1, temp: 24.0, sugar: 100, etanol: 47.3,  status: 'completed'   },
  { id: 3, circuit: 2, start: '2026-04-15 09:00', end: '2026-04-15 21:00', duration: '12h', ph: 4.6, temp: 23.0, sugar: 80,  etanol: 28.1,  status: 'interrupted' },
  { id: 4, circuit: 3, start: '2026-04-13 10:00', end: '2026-04-14 14:00', duration: '28h', ph: 5.0, temp: 25.5, sugar: 110, etanol: 53.8,  status: 'completed'   },
  { id: 5, circuit: 1, start: '2026-04-11 07:00', end: '2026-04-12 07:00', duration: '24h', ph: 4.7, temp: 21.5, sugar: 95,  etanol: 44.9,  status: 'completed'   },
  { id: 6, circuit: 2, start: '2026-04-09 16:00', end: '2026-04-10 04:00', duration: '12h', ph: 5.3, temp: 26.0, sugar: 130, etanol: 31.2,  status: 'interrupted' },
  { id: 7, circuit: 3, start: '2026-04-07 09:00', end: '2026-04-08 21:00', duration: '36h', ph: 4.9, temp: 22.0, sugar: 115, etanol: 56.7,  status: 'completed'   },
  { id: 8, circuit: 1, start: '2026-04-19 12:00', end: '—',               duration: '—',   ph: 4.5, temp: 23.5, sugar: 100, etanol: 0,     status: 'running'     },
]
