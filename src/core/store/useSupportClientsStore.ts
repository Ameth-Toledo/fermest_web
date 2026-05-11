import { create } from 'zustand'

export type ClientStatus = 'active' | 'suspended'
export type CodeStatus   = 'used' | 'none'

export interface SupportClient {
  id: string
  name: string
  last_name: string
  email: string
  role: string
  status: ClientStatus
  activationCode: string | null
  codeStatus: CodeStatus
  createdAt: string
}

export interface ActivationCode {
  id: string
  code: string
  assignedTo: string | null
  assignedEmail: string | null
  status: 'available' | 'used'
  createdAt: string
}

const genCode = () => {
  const seg = () => Math.random().toString(36).toUpperCase().slice(2, 6)
  return `NK-${seg()}-${seg()}`
}

const MOCK_CLIENTS: SupportClient[] = [
  {
    id: '1', name: 'Carlos', last_name: 'Méndez', email: 'carlos@cafetero.mx',
    role: 'estudiante', status: 'active',
    activationCode: 'NK-7HJ2-9KM4', codeStatus: 'used',
    createdAt: '2025-03-15T10:00:00.000Z',
  },
  {
    id: '2', name: 'María', last_name: 'López', email: 'maria@finca.com',
    role: 'profesor', status: 'active',
    activationCode: 'NK-2PQ8-5RX1', codeStatus: 'used',
    createdAt: '2025-04-02T14:30:00.000Z',
  },
  {
    id: '3', name: 'Roberto', last_name: 'Jiménez', email: 'roberto@coop.org',
    role: 'estudiante', status: 'suspended',
    activationCode: null, codeStatus: 'none',
    createdAt: '2025-04-20T09:15:00.000Z',
  },
  {
    id: '4', name: 'Ana', last_name: 'García', email: 'ana@cafegourmet.mx',
    role: 'estudiante', status: 'active',
    activationCode: null, codeStatus: 'none',
    createdAt: '2025-05-01T11:45:00.000Z',
  },
]

interface SupportClientsStore {
  clients: SupportClient[]
  codes: ActivationCode[]
  generateCode: (clientId: string) => string
  toggleStatus: (clientId: string) => void
}

export const useSupportClientsStore = create<SupportClientsStore>((set, get) => ({
  clients: MOCK_CLIENTS,
  codes: [],

  generateCode: (clientId) => {
    const existing = get().clients.find(c => c.id === clientId)
    if (existing?.codeStatus === 'used') return existing.activationCode!

    const code = genCode()
    const now  = new Date().toISOString()
    const client = existing

    set(s => ({
      codes: [
        {
          id: crypto.randomUUID(),
          code,
          assignedTo: clientId,
          assignedEmail: client?.email ?? null,
          status: 'used',
          createdAt: now,
        },
        ...s.codes,
      ],
      clients: s.clients.map(c =>
        c.id === clientId
          ? { ...c, activationCode: code, codeStatus: 'used' }
          : c
      ),
    }))

    return code
  },

  toggleStatus: (clientId) => {
    set(s => ({
      clients: s.clients.map(c =>
        c.id === clientId
          ? { ...c, status: c.status === 'active' ? 'suspended' : 'active' }
          : c
      ),
    }))
  },
}))
