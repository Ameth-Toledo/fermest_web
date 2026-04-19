import { useState } from 'react'
import type { ScheduleFormProps } from '../types/ScheduleFormProps'

const ScheduleForm = ({ onSubmit, onCancel, loading }: ScheduleFormProps) => {
  const now   = new Date()
  const later = new Date(now.getTime() + 2 * 60 * 60 * 1000)
  const toLocal = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)

  const [form, setForm] = useState({
    circuit_id:      1,
    scheduled_start: toLocal(now),
    scheduled_end:   toLocal(later),
    initial_sugar:   '' as unknown as number,
  })

  const set = (key: keyof typeof form, value: string | number) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = () => {
    onSubmit({
      circuit_id:      Number(form.circuit_id),
      scheduled_start: new Date(form.scheduled_start).toISOString(),
      scheduled_end:   new Date(form.scheduled_end).toISOString(),
      initial_sugar:   Number(form.initial_sugar),
    })
  }

  const isValid = Number(form.initial_sugar) > 0

  const inputBase: React.CSSProperties = {
    width:        '100%',
    backgroundColor: '#0A0A0B',
    border:       '1px solid #2A2A2D',
    borderRadius: 8,
    color:        '#F4F4F5',
    fontSize:     13,
    padding:      '10px 12px',
    outline:      'none',
    fontFamily:   'Poppins, sans-serif',
    colorScheme:  'dark',
    boxSizing:    'border-box',
  }

  const labelBase: React.CSSProperties = {
    display:       'block',
    color:         '#71717A',
    fontSize:      10,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    marginBottom:  6,
  }

  return (
    <div
      style={{
        marginTop:       16,
        padding:         24,
        borderRadius:    12,
        backgroundColor: '#0A0A0B',
        border:          '1px solid #2A2A2D',
      }}
    >
      <p style={{ color: '#A1A1AA', fontSize: 12, fontWeight: 500, marginBottom: 20, marginTop: 0 }}>
        Configurar sesión de fermentación
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={labelBase}>Circuit ID</label>
          <input type="number" value={form.circuit_id} min={1}
            onChange={e => set('circuit_id', e.target.value)} style={inputBase} />
        </div>
        <div>
          <label style={labelBase}>Azúcar inicial (g/L)</label>
          <input type="number" value={form.initial_sugar} min={0} step={0.1}
            placeholder="Ej: 120"
            onChange={e => set('initial_sugar', e.target.value)} style={inputBase} />
        </div>
        <div>
          <label style={labelBase}>Inicio programado</label>
          <input type="datetime-local" value={form.scheduled_start}
            onChange={e => set('scheduled_start', e.target.value)} style={inputBase} />
        </div>
        <div>
          <label style={labelBase}>Fin programado</label>
          <input type="datetime-local" value={form.scheduled_end}
            onChange={e => set('scheduled_end', e.target.value)} style={inputBase} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          style={{
            flex:            1,
            padding:         '10px 0',
            borderRadius:    8,
            border:          'none',
            backgroundColor: !isValid || loading ? '#16A34A55' : '#22C55E',
            color:           '#0A0A0B',
            fontSize:        13,
            fontWeight:      600,
            cursor:          !isValid || loading ? 'not-allowed' : 'pointer',
            fontFamily:      'Poppins, sans-serif',
            transition:      'background-color 0.2s',
          }}
        >
          {loading ? 'Iniciando...' : 'Confirmar e iniciar'}
        </button>
        <button
          onClick={onCancel}
          disabled={loading}
          style={{
            padding:         '10px 20px',
            borderRadius:    8,
            border:          '1px solid #3F3F46',
            backgroundColor: 'transparent',
            color:           '#71717A',
            fontSize:        13,
            cursor:          'pointer',
            fontFamily:      'Poppins, sans-serif',
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

export default ScheduleForm
