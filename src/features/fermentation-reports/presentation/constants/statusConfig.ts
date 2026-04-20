import type { Status } from '../types/Status'

export const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  completed:   { label: 'Completada',   color: '#22C55E' },
  interrupted: { label: 'Interrumpida', color: '#F59E0B' },
  running:     { label: 'En curso',     color: '#3B82F6' },
  scheduled:   { label: 'Programada',   color: '#A78BFA' },
}
