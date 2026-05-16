import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSupportStore, type SupportTicket } from '../../../../core/store/useSupportStore'
import { cn } from '../../../../lib/utils'

const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60)    return 'ahora'
  if (diff < 3600)  return `hace ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} hr`
  return `hace ${Math.floor(diff / 86400)} d`
}

const TicketsPanel = () => {
  const { tickets, addReply } = useSupportStore()
  const [selected, setSelected] = useState<SupportTicket | null>(null)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<'all' | 'pending' | 'answered'>('all')
  const [reply, setReply]       = useState('')

  const pending  = tickets.filter(t => t.status === 'pending').length
  const answered = tickets.filter(t => t.status === 'answered').length

  const filtered = tickets.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.message.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.status === filter
    return matchSearch && matchFilter
  })

  const handleReply = () => {
    if (!reply.trim() || !selected) return
    addReply(selected.id, reply.trim())
    setReply('')
    setSelected(s => s ? { ...s, status: 'answered' } : null)
  }

  const openTicket = (t: SupportTicket) => { setSelected(t); setReply('') }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 border-b border-neutral-900 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Chats de soporte</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <button onClick={() => setFilter('all')}
              className={cn('text-xs transition-colors', filter === 'all' ? 'text-white font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              Todos ({tickets.length})
            </button>
            <button onClick={() => setFilter('pending')}
              className={cn('flex items-center gap-1.5 text-xs transition-colors', filter === 'pending' ? 'text-amber-400 font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Pendientes ({pending})
            </button>
            <button onClick={() => setFilter('answered')}
              className={cn('flex items-center gap-1.5 text-xs transition-colors', filter === 'answered' ? 'text-green-400 font-medium' : 'text-neutral-600 hover:text-neutral-400')}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Respondidos ({answered})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar chat..."
            className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0 z-10 bg-[#0A0A0B] border-b border-neutral-900">
              {['Usuario', 'Correo', 'Mensaje', 'Estado', 'Recibido', ''].map(h => (
                <th key={h} className="px-8 py-2.5 text-left text-[11px] font-semibold text-neutral-600 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                    <svg className="w-10 h-10 text-neutral-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                    </svg>
                    <p className="text-neutral-600 text-sm">{tickets.length === 0 ? 'Sin chats aún' : 'Sin resultados'}</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(ticket => (
              <tr key={ticket.id} className="border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors group">
                <td className="px-8 py-4">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-xs font-semibold text-neutral-400">
                      {ticket.name[0]}
                    </div>
                    <span className="text-sm text-white font-medium truncate">{ticket.name}</span>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-sm text-neutral-400 truncate block">{ticket.email}</span>
                </td>
                <td className="px-8 py-4 max-w-[260px]">
                  <span className="text-sm text-neutral-500 truncate block">{ticket.message}</span>
                </td>
                <td className="px-8 py-4">
                  <span className={cn('text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap',
                    ticket.status === 'pending'
                      ? 'text-amber-400 bg-neutral-950 border-amber-500/60'
                      : 'text-green-400 bg-neutral-950 border-green-500/60')}>
                    {ticket.status === 'pending' ? 'Pendiente' : 'Respondido'}
                  </span>
                </td>
                <td className="px-8 py-4">
                  <span className="text-xs text-neutral-600 whitespace-nowrap">{timeAgo(ticket.createdAt)}</span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button onClick={() => openTicket(ticket)}
                    className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                    {ticket.status === 'pending' ? 'Responder' : 'Ver'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Drawer overlay ── */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div className="absolute inset-0 bg-black/40 z-10"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)} />

            <motion.div
              className="absolute right-0 top-0 bottom-0 w-[480px] z-20 bg-[#0f0f10] border-l border-neutral-800 flex flex-col shadow-2xl"
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 35 }}>

              {/* Drawer header */}
              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{selected.name}</p>
                  <p className="text-neutral-500 text-xs mt-0.5">{selected.email}</p>
                </div>
                <span className={cn('text-[11px] px-2.5 py-1 rounded-full border',
                  selected.status === 'pending' ? 'text-amber-400 bg-neutral-950 border-amber-500/60' : 'text-green-400 bg-neutral-950 border-green-500/60')}>
                  {selected.status === 'pending' ? 'Pendiente' : 'Respondido'}
                </span>
                <button onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                {selected.messages.map((msg, i) => (
                  <div key={i} className={cn('flex gap-2', msg.from !== 'bot' ? 'justify-end' : 'justify-start')}>
                    {msg.from === 'bot' && <img src="/assets/logo.svg" alt="" className="w-5 h-5 object-contain flex-shrink-0 mt-0.5" />}
                    <div className={cn('max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
                      msg.from === 'bot'   && 'bg-neutral-800 text-neutral-200 rounded-tl-sm',
                      msg.from === 'user'  && 'bg-green-500/10 border border-green-500/20 text-white rounded-tr-sm',
                      msg.from === 'agent' && 'bg-blue-500/10 border border-blue-500/20 text-blue-200 rounded-tr-sm',
                    )}>
                      {msg.from === 'agent' && <p className="text-[10px] text-blue-400/70 mb-1 font-medium">Agente de soporte</p>}
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply input */}
              <div className="flex-shrink-0 px-5 pb-5 pt-3 border-t border-neutral-800">
                <div className="flex gap-2 items-end rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2.5 focus-within:border-blue-500/40 transition-all">
                  <textarea value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply() } }}
                    placeholder="Escribe tu respuesta..." rows={1}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-600 outline-none resize-none leading-relaxed"
                    style={{ minHeight: '22px', maxHeight: '100px' }} />
                  <button onClick={handleReply} disabled={!reply.trim()}
                    className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TicketsPanel
