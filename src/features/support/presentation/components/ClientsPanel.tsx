import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSupportClientsStore, type SupportClient } from '../../../../core/store/useSupportClientsStore'
import { useSupportStore } from '../../../../core/store/useSupportStore'
import { cn } from '../../../../lib/utils'

const roleLabel: Record<string, string> = {
  admin: 'Admin', profesor: 'Profesor', estudiante: 'Estudiante', soporte: 'Soporte',
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

const ClientsPanel = () => {
  const { clients, generateCode, toggleStatus } = useSupportClientsStore()
  const tickets = useSupportStore(s => s.tickets)
  const [selected, setSelected] = useState<SupportClient | null>(null)
  const [search, setSearch]     = useState('')
  const [copied, setCopied]     = useState(false)

  const filtered = clients.filter(c =>
    `${c.name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const clientTickets    = selected ? tickets.filter(t => t.email === selected.email) : []
  const pendingTickets   = clientTickets.filter(t => t.status === 'pending').length
  const activeClients    = clients.filter(c => c.status === 'active').length

  const openClient = (c: SupportClient) => { setSelected(c); setCopied(false) }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerate = () => {
    if (!selected) return
    generateCode(selected.id)
    setSelected(s => s ? { ...s, codeStatus: 'used' } : null)
  }

  const handleToggle = () => {
    if (!selected) return
    toggleStatus(selected.id)
    setSelected(s => s ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : null)
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 border-b border-neutral-900 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Usuarios registrados</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{activeClients} activos
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />{clients.length - activeClients} suspendidos
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar usuario..."
            className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" />
        </div>
      </div>

      {/* ── Table: header sticky + rows in same scroll container ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0A0A0B] px-8 py-2.5 border-b border-neutral-900 grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_auto] gap-4 items-center">
          {['Usuario', 'Correo', 'Rol', 'Estado', 'Código', ''].map(h => (
            <span key={h} className="text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <p className="text-neutral-600 text-sm">Sin resultados</p>
          </div>
        ) : (
          filtered.map(client => (
            <div key={client.id}
              className="px-8 py-4 border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors grid grid-cols-[2fr_2fr_1fr_1fr_1.5fr_auto] gap-4 items-center group">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-neutral-400">
                  {client.name[0]}{client.last_name[0]}
                </div>
                <span className="text-sm text-white font-medium truncate">{client.name} {client.last_name}</span>
              </div>
              <span className="text-sm text-neutral-400 truncate">{client.email}</span>
              <span className="text-sm text-neutral-500">{roleLabel[client.role] ?? client.role}</span>
              <span className={cn('flex items-center gap-1.5 text-xs',
                client.status === 'active' ? 'text-green-400' : 'text-red-400')}>
                <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0',
                  client.status === 'active' ? 'bg-green-400' : 'bg-red-400')} />
                {client.status === 'active' ? 'Activo' : 'Suspendido'}
              </span>
              <span className={cn('text-xs font-mono',
                client.activationCode ? 'text-green-400 font-bold tracking-wider' : 'text-neutral-700')}>
                {client.activationCode ?? '—'}
              </span>
              <button onClick={() => openClient(client)}
                className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                Ver detalle
              </button>
            </div>
          ))
        )}
      </div>

      {/* ── Drawer overlay ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[460px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl overflow-y-auto"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}>

              {/* Drawer header */}
              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-300">
                  {selected.name[0]}{selected.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{selected.name} {selected.last_name}</p>
                  <p className="text-neutral-500 text-xs">{selected.email}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-5 px-5 py-5">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-neutral-500 bg-neutral-900 border border-neutral-800 px-2.5 py-1 rounded-full">
                    {roleLabel[selected.role] ?? selected.role}
                  </span>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border',
                    selected.status === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20')}>
                    {selected.status === 'active' ? 'Activo' : 'Suspendido'}
                  </span>
                  <button onClick={handleToggle}
                    className={cn('ml-auto text-xs px-2.5 py-1 rounded-full border transition-colors',
                      selected.status === 'active'
                        ? 'text-red-400 border-red-400/20 hover:bg-red-400/10'
                        : 'text-green-400 border-green-400/20 hover:bg-green-400/10')}>
                    {selected.status === 'active' ? 'Suspender' : 'Reactivar'}
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Registro', value: formatDate(selected.createdAt) },
                    { label: 'Chats', value: clientTickets.length.toString() },
                    { label: 'Pendientes', value: pendingTickets.toString() },
                  ].map(s => (
                    <div key={s.label} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-white font-bold text-base leading-none">{s.value}</p>
                      <p className="text-neutral-600 text-[10px] mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Activation code */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white text-sm font-semibold">Código de activación</p>
                    {selected.codeStatus === 'none' && (
                      <button onClick={handleGenerate}
                        className="text-xs px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white border-transparent border transition-colors">
                        Generar
                      </button>
                    )}
                  </div>
                  {selected.activationCode ? (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-sm font-bold text-green-400 tracking-widest bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">
                        {selected.activationCode}
                      </code>
                      <button onClick={() => handleCopy(selected.activationCode!)}
                        className="text-xs px-2.5 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
                        {copied ? '✓' : 'Copiar'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-neutral-600 text-sm">Sin código asignado.</p>
                  )}
                </div>

                {/* Info */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Información personal</p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Nombre', value: `${selected.name} ${selected.last_name}` },
                      { label: 'Correo', value: selected.email },
                      { label: 'Rol', value: roleLabel[selected.role] ?? selected.role },
                      { label: 'Registro', value: formatDate(selected.createdAt) },
                    ].map(f => (
                      <div key={f.label} className="flex items-center justify-between py-1.5 border-b border-neutral-800 last:border-0">
                        <span className="text-neutral-500 text-xs">{f.label}</span>
                        <span className="text-white text-xs font-medium">{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ClientsPanel
