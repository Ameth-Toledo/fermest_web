import { useState }      from 'react'
import type { Status }   from '../types/Status'
import { FILTERS }       from '../constants/filters'
import { REPORTS_STYLES } from '../constants/styles'
import StatusPill        from '../components/StatusPill'
import {
  useFermentationReportsViewModel,
} from '../viewmodels/useFermentationReportsViewModel'

const FermentationReportsView = () => {
  const { reports, loading, error, refetch } = useFermentationReportsViewModel()

  const [filter,   setFilter]   = useState<Status | 'all'>('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState<number | null>(null)

  const filtered = reports.filter(r => {
    const matchesFilter = filter === 'all' || r.status === filter
    const matchesSearch =
      search === '' ||
      `#${r.id}`.includes(search) ||
      `${r.circuit}`.includes(search)
    return matchesFilter && matchesSearch
  })

  const completadas   = reports.filter(r => r.status === 'completed').length
  const interrumpidas = reports.filter(r => r.status === 'interrupted').length
  const enCurso       = reports.filter(r => r.status === 'running').length

  const selectedReport = reports.find(r => r.id === selected) ?? null

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '48px', display: 'flex', flexDirection: 'column' }}>
      <style>{REPORTS_STYLES}</style>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Historial
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Reportes de Fermentación
            </h1>
            <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            style={{
              display:         'flex',
              alignItems:      'center',
              gap:             6,
              padding:         '8px 16px',
              borderRadius:    8,
              border:          '1px solid #2A2A2D',
              backgroundColor: 'transparent',
              color:           loading ? '#3F3F46' : '#71717A',
              fontSize:        12,
              cursor:          loading ? 'not-allowed' : 'pointer',
              fontFamily:      'Poppins, sans-serif',
              transition:      'all 0.2s',
            }}
          >
            <svg
              width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }}
            >
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
            </svg>
            {loading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{ marginBottom: 24, padding: '12px 16px', borderRadius: 10, backgroundColor: '#F43F5E10', border: '1px solid #F43F5E30', color: '#F43F5E', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </span>
          <button
            onClick={refetch}
            style={{ background: 'none', border: 'none', color: '#F43F5E', cursor: 'pointer', fontSize: 12, textDecoration: 'underline', fontFamily: 'Poppins, sans-serif' }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {([
          { label: 'Total sesiones', value: reports.length, color: '#F4F4F5' },
          { label: 'Completadas',    value: completadas,    color: '#22C55E' },
          { label: 'Interrumpidas',  value: interrumpidas,  color: '#F59E0B' },
          { label: 'En curso',       value: enCurso,        color: '#3B82F6' },
        ] as const).map(stat => (
          <div key={stat.label} style={{ padding: '18px 22px', borderRadius: 14, backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            {loading
              ? <div style={{ height: 36, width: 48, borderRadius: 6, backgroundColor: '#1A1A1D', marginBottom: 4 }} />
              : <p style={{ color: stat.color, fontSize: 28, fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>{stat.value}</p>
            }
            <p style={{ color: '#52525B', fontSize: 12, margin: 0 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filtros + búsqueda ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTERS.map(f => (
            <button
              key={f.value}
              className="filter-btn"
              onClick={() => setFilter(f.value)}
              style={{
                padding:         '7px 16px',
                borderRadius:    8,
                border:          `1px solid ${filter === f.value ? '#22C55E' : '#2A2A2D'}`,
                backgroundColor: filter === f.value ? '#22C55E15' : 'transparent',
                color:           filter === f.value ? '#22C55E' : '#71717A',
                fontSize:        12,
                fontWeight:      filter === f.value ? 600 : 400,
                fontFamily:      'Poppins, sans-serif',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', position: 'relative' }}>
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="#52525B" strokeWidth="2" strokeLinecap="round"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            placeholder="Buscar por ID o circuito..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              paddingLeft: 36, paddingRight: 16, paddingTop: 8, paddingBottom: 8,
              borderRadius: 8, border: '1px solid #2A2A2D',
              backgroundColor: '#111113', color: '#F4F4F5',
              fontSize: 12, fontFamily: 'Poppins, sans-serif', outline: 'none', width: 220,
            }}
          />
        </div>
      </div>

      {/* ── Tabla + panel lateral ── */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 20 }}>

        {/* Tabla */}
        <div style={{ borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1F1F22' }}>
                {['ID', 'Circuito', 'Inicio', 'Duración', 'pH', 'Temp.', 'Estado', ''].map(h => (
                  <th
                    key={h}
                    style={{ padding: '14px 20px', textAlign: 'left', color: '#3F3F46', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, whiteSpace: 'nowrap' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Skeleton */}
              {loading && Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #17171A' }}>
                  {[40, 80, 100, 50, 40, 50, 72, 14].map((w, j) => (
                    <td key={j} style={{ padding: '14px 20px' }}>
                      <div style={{ height: 12, width: w, borderRadius: 4, backgroundColor: '#1A1A1D' }} />
                    </td>
                  ))}
                </tr>
              ))}

              {/* Filas reales */}
              {!loading && filtered.map((r, i) => (
                <tr
                  key={r.id}
                  className="report-row"
                  onClick={() => setSelected(selected === r.id ? null : r.id)}
                  style={{
                    borderBottom:    i < filtered.length - 1 ? '1px solid #17171A' : 'none',
                    backgroundColor: selected === r.id ? 'rgba(34,197,94,0.04)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#22C55E', fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>#{r.id}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#A1A1AA', fontSize: 12 }}>Circuito #{r.circuit}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#71717A', fontSize: 12 }}>{r.start}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#A1A1AA', fontSize: 12, fontFamily: 'monospace' }}>{r.duration}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#4ADE80', fontSize: 12, fontWeight: 600, fontFamily: 'monospace' }}>{r.ph}</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ color: '#A1A1AA', fontSize: 12, fontFamily: 'monospace' }}>{r.temp}°C</span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <StatusPill status={r.status} />
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3F3F46" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#3F3F46', fontSize: 13 }}>
                    No hay reportes que coincidan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel lateral */}
        {selected && selectedReport && (
          <div style={{ padding: 24, borderRadius: 16, backgroundColor: '#111113', border: '1px solid #1F1F22', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ color: '#F4F4F5', fontSize: 14, fontWeight: 600, margin: 0 }}>
                Sesión #{selectedReport.id}
              </p>
              <button
                onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#52525B', padding: 4 }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <StatusPill status={selectedReport.status} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([
                { label: 'Circuito',        value: `#${selectedReport.circuit}` },
                { label: 'Inicio',          value: selectedReport.start },
                { label: 'Fin',             value: selectedReport.end },
                { label: 'Duración',        value: selectedReport.duration },
                { label: 'pH registrado',   value: selectedReport.ph > 0 ? `${selectedReport.ph}` : '—' },
                { label: 'Temperatura',     value: selectedReport.temp > 0 ? `${selectedReport.temp} °C` : '—' },
                { label: 'Azúcar inicial',  value: selectedReport.sugar > 0 ? `${selectedReport.sugar} g/L` : '—' },
                { label: 'Etanol obtenido', value: selectedReport.etanol > 0 ? `${selectedReport.etanol} g/L` : '—' },
              ] as const).map(item => (
                <div
                  key={item.label}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, borderBottom: '1px solid #17171A' }}
                >
                  <span style={{ color: '#52525B', fontSize: 12 }}>{item.label}</span>
                  <span style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, fontFamily: 'monospace' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Eficiencia — viene calculada del backend con el factor real */}
            {selectedReport.efficiency !== null && selectedReport.efficiency !== undefined && (
              <div style={{ padding: '14px 16px', borderRadius: 10, backgroundColor: '#0D0D0F', border: '1px solid #1F1F22' }}>
                <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>
                  Eficiencia estimada
                </p>
                <p style={{ color: '#22C55E', fontSize: 24, fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
                  {selectedReport.efficiency.toFixed(1)}%
                </p>
                <div style={{ height: 6, borderRadius: 999, backgroundColor: '#1A1A1D', overflow: 'hidden' }}>
                  <div style={{
                    height:          '100%',
                    width:           `${Math.min(100, selectedReport.efficiency)}%`,
                    borderRadius:    999,
                    backgroundColor: '#22C55E',
                    boxShadow:       '0 0 8px rgba(34,197,94,0.5)',
                  }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default FermentationReportsView