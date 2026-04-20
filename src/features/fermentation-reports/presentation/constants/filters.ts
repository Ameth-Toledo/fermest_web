import type { Status } from '../types/Status'

export const FILTERS: { label: string; value: Status | 'all' }[] = [
  { label: 'Todos',         value: 'all'         },
  { label: 'Completadas',   value: 'completed'   },
  { label: 'Interrumpidas', value: 'interrupted' },
  { label: 'En curso',      value: 'running'     },
]
