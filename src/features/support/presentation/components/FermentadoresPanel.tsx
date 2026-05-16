import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../../../../lib/utils'

type CodigoStatus = 'activo-asignado' | 'activo-libre' | 'inactivo'
type Responsable  = 'Ameth Toledo' | 'Fabricio Pérez' | 'Melissa Corral' | 'Fernando Mijanos'

interface Fermentador {
  id: string
  serial: string
  codigoStatus: CodigoStatus
  codigo: string
  vendido: boolean
  clienteNombre: string | null
  creadoEn: string
  altaPor: Responsable
}

const MOCK: Fermentador[] = [
  { id: '1', serial: 'FRM-00001', codigoStatus: 'activo-asignado', codigo: 'ACT-4F2A', vendido: true,  clienteNombre: 'Carlos Méndez',  creadoEn: '2024-01-10T09:15:00Z', altaPor: 'Ameth Toledo'     },
  { id: '2', serial: 'FRM-00002', codigoStatus: 'activo-asignado', codigo: 'ACT-9C3B', vendido: true,  clienteNombre: 'Ana Torres',      creadoEn: '2024-01-12T14:30:00Z', altaPor: 'Fabricio Pérez'   },
  { id: '3', serial: 'FRM-00003', codigoStatus: 'activo-libre',    codigo: 'ACT-7E1D', vendido: false, clienteNombre: null,              creadoEn: '2024-01-14T11:00:00Z', altaPor: 'Melissa Corral'   },
  { id: '4', serial: 'FRM-00004', codigoStatus: 'inactivo',        codigo: '—',        vendido: false, clienteNombre: null,              creadoEn: '2024-01-15T08:45:00Z', altaPor: 'Fernando Mijanos' },
  { id: '5', serial: 'FRM-00005', codigoStatus: 'activo-asignado', codigo: 'ACT-2B8F', vendido: true,  clienteNombre: 'Coop. Yucatán',  creadoEn: '2024-01-16T10:20:00Z', altaPor: 'Ameth Toledo'     },
  { id: '6', serial: 'FRM-00006', codigoStatus: 'activo-libre',    codigo: 'ACT-5A9C', vendido: false, clienteNombre: null,              creadoEn: '2024-01-17T13:10:00Z', altaPor: 'Fabricio Pérez'   },
  { id: '7', serial: 'FRM-00007', codigoStatus: 'activo-asignado', codigo: 'ACT-3D6E', vendido: true,  clienteNombre: 'Finca El Roble', creadoEn: '2024-01-18T09:00:00Z', altaPor: 'Melissa Corral'   },
  { id: '8', serial: 'FRM-00008', codigoStatus: 'inactivo',        codigo: '—',        vendido: false, clienteNombre: null,              creadoEn: '2024-01-19T16:55:00Z', altaPor: 'Fernando Mijanos' },
]

const STATUS_STYLE: Record<CodigoStatus, { label: string; dot: string; text: string }> = {
  'activo-asignado': { label: 'Asignado',   dot: 'bg-green-400',   text: 'text-green-400'  },
  'activo-libre':    { label: 'Disponible', dot: 'bg-blue-400',    text: 'text-blue-400'   },
  'inactivo':        { label: 'Inactivo',   dot: 'bg-neutral-600', text: 'text-neutral-500' },
}

const INITIALS: Record<Responsable, string> = {
  'Ameth Toledo':     'AT',
  'Fabricio Pérez':   'FP',
  'Melissa Corral':   'MC',
  'Fernando Mijanos': 'FM',
}

const formatFecha = (iso: string) =>
  new Date(iso).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })

const FermentadoresPanel = () => {
  const [selected, setSelected] = useState<Fermentador | null>(null)
  const [search, setSearch]     = useState('')
  const [copied, setCopied]     = useState(false)

  const vendidos  = MOCK.filter(f => f.vendido).length
  const asignados = MOCK.filter(f => f.codigoStatus === 'activo-asignado').length

  const filtered = MOCK.filter(f =>
    `${f.serial} ${f.clienteNombre ?? ''} ${f.altaPor} ${f.codigo}`.toLowerCase().includes(search.toLowerCase())
  )

  const openFermentador = (f: Fermentador) => { setSelected(f); setCopied(false) }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative h-full flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-8 pt-6 pb-4 border-b border-neutral-900 flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base">Fermentadores</h2>
          <div className="flex items-center gap-4 mt-1.5">
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />{vendidos} vendidos
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />{asignados} asignados
            </span>
            <span className="flex items-center gap-1.5 text-xs text-neutral-600">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-600" />{MOCK.length - vendidos} en inventario
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 focus-within:border-green-500/40 transition-colors">
          <svg className="w-3.5 h-3.5 text-neutral-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar fermentador..."
            className="bg-transparent text-xs text-white placeholder:text-neutral-600 outline-none w-44" />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="sticky top-0 z-10 bg-[#0A0A0B] border-b border-neutral-900">
              {['Fermentador', 'Código', 'Vendido', 'Estado', 'Alta por', ''].map(h => (
                <th key={h} className="px-8 py-2.5 text-left text-[11px] font-semibold text-neutral-600 uppercase tracking-wider first:pl-8 last:pr-8">
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
                      <path d="M9 3h6M9 3v6l-4 10h14l-4-10V3"/>
                    </svg>
                    <p className="text-neutral-600 text-sm">Sin resultados</p>
                  </div>
                </td>
              </tr>
            ) : filtered.map(f => {
              const st = STATUS_STYLE[f.codigoStatus]
              return (
                <tr key={f.id} className="border-b border-neutral-900 hover:bg-neutral-900/50 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-neutral-400">
                        {f.serial.slice(-2)}
                      </div>
                      <span className="text-sm text-white font-medium font-mono truncate">{f.serial}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn('text-xs font-mono', f.codigo !== '—' ? 'text-green-400 font-bold tracking-wider' : 'text-neutral-700')}>
                      {f.codigo}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn('flex items-center gap-1.5 text-xs', f.vendido ? 'text-green-400' : 'text-neutral-500')}>
                      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', f.vendido ? 'bg-green-400' : 'bg-neutral-600')} />
                      {f.vendido ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <span className={cn('text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap', st.text,
                      f.codigoStatus === 'activo-asignado' ? 'bg-neutral-950 border-green-500/60'
                      : f.codigoStatus === 'activo-libre'  ? 'bg-neutral-950 border-blue-500/60'
                      : 'bg-neutral-950 border-neutral-700')}>
                      {st.label}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center flex-shrink-0 text-[10px] font-semibold text-neutral-400">
                        {INITIALS[f.altaPor]}
                      </div>
                      <span className="text-sm text-neutral-400 truncate">{f.altaPor}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button onClick={() => openFermentador(f)}
                      className="text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Drawer ── */}
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

              <div className="flex-shrink-0 px-5 py-4 border-b border-neutral-800 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center font-bold text-neutral-300 text-sm font-mono">
                  {selected.serial.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm font-mono">{selected.serial}</p>
                  <p className="text-neutral-500 text-xs">
                    {selected.clienteNombre ? `Asignado a ${selected.clienteNombre}` : 'Sin cliente asignado'}
                  </p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-white hover:bg-neutral-800 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="flex flex-col gap-5 px-5 py-5">

                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border', STATUS_STYLE[selected.codigoStatus].text,
                    selected.codigoStatus === 'activo-asignado' ? 'bg-neutral-950 border-green-500/60'
                    : selected.codigoStatus === 'activo-libre' ? 'bg-neutral-950 border-blue-500/60'
                    : 'bg-neutral-950 border-neutral-700')}>
                    {STATUS_STYLE[selected.codigoStatus].label}
                  </span>
                  <span className={cn('text-xs px-2.5 py-1 rounded-full border',
                    selected.vendido ? 'text-green-400 bg-neutral-950 border-green-500/60' : 'text-neutral-500 bg-neutral-950 border-neutral-700')}>
                    {selected.vendido ? 'Vendido' : 'En inventario'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Registro',  value: formatFecha(selected.creadoEn) },
                    { label: 'Vendido',   value: selected.vendido ? 'Sí' : 'No' },
                    { label: 'Alta por',  value: INITIALS[selected.altaPor] },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-center">
                      <p className="text-white font-bold text-base leading-none truncate">{value}</p>
                      <p className="text-neutral-600 text-[10px] mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-white text-sm font-semibold">Código de activación</p>
                    <span className={cn('flex items-center gap-1.5 text-xs', STATUS_STYLE[selected.codigoStatus].text)}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', STATUS_STYLE[selected.codigoStatus].dot)} />
                      {STATUS_STYLE[selected.codigoStatus].label}
                    </span>
                  </div>
                  {selected.codigo !== '—' ? (
                    <div className="flex items-center gap-2">
                      <code className="flex-1 font-mono text-sm font-bold text-green-400 tracking-widest bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2">
                        {selected.codigo}
                      </code>
                      <button onClick={() => handleCopy(selected.codigo)}
                        className="text-xs px-2.5 py-2 rounded-lg border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors">
                        {copied ? '✓' : 'Copiar'}
                      </button>
                    </div>
                  ) : (
                    <p className="text-neutral-600 text-sm">Sin código generado.</p>
                  )}
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                  <p className="text-white text-sm font-semibold mb-3">Información del equipo</p>
                  <div className="flex flex-col gap-2.5">
                    {[
                      { label: 'Serial',           value: selected.serial },
                      { label: 'Cliente asignado', value: selected.clienteNombre ?? '—' },
                      { label: 'Fecha de registro', value: formatFecha(selected.creadoEn) },
                      { label: 'Dado de alta por', value: selected.altaPor },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-1.5 border-b border-neutral-800 last:border-0">
                        <span className="text-neutral-500 text-xs">{label}</span>
                        <span className="text-white text-xs font-medium text-right max-w-[55%] truncate">{value}</span>
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

export default FermentadoresPanel
