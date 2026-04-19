import { useState } from 'react'
import { useFermentationViewModel } from '../viewmodels/useFermentationViewModel'
import { SENSOR_CONTROLS } from '../../domain/models/Fermentation'
import type { SensorKey, FermentationStatus } from '../../domain/models/Fermentation'
import type { FermentationFormData } from '../viewmodels/useFermentationViewModel'

// ── Toggle Switch ─────────────────────────────────────────────────────────────
interface ToggleSwitchProps {
  checked: boolean
  onChange: () => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

const ToggleSwitch = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  color = '#22C55E',
}: ToggleSwitchProps) => {
  const cfg = {
    sm: { w: 36,  h: 20, thumb: 14, offset: 3,  travel: 16 },
    md: { w: 48,  h: 26, thumb: 18, offset: 4,  travel: 22 },
    lg: { w: 64,  h: 34, thumb: 24, offset: 5,  travel: 30 },
  }[size]

  return (
    <button
      onClick={onChange}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
      style={{
        position:        'relative',
        display:         'inline-flex',
        alignItems:      'center',
        width:           cfg.w,
        height:          cfg.h,
        borderRadius:    cfg.h,
        cursor:          disabled ? 'not-allowed' : 'pointer',
        opacity:         disabled ? 0.4 : 1,
        flexShrink:      0,
        border:          'none',
        padding:         0,
        background:      'none',
      }}
    >
      {/* Track */}
      <span
        style={{
          position:        'absolute',
          inset:           0,
          borderRadius:    cfg.h,
          backgroundColor: checked ? color : '#27272A',
          border:          `1px solid ${checked ? color : '#3F3F46'}`,
          boxShadow:       checked ? `0 0 14px ${color}50` : 'none',
          transition:      'all 0.25s ease',
        }}
      />
      {/* Thumb */}
      <span
        style={{
          position:        'relative',
          width:           cfg.thumb,
          height:          cfg.thumb,
          borderRadius:    '50%',
          backgroundColor: '#FFFFFF',
          marginLeft:      cfg.offset,
          transform:       checked ? `translateX(${cfg.travel}px)` : 'translateX(0)',
          transition:      'transform 0.25s ease',
          boxShadow:       '0 1px 4px rgba(0,0,0,0.4)',
          flexShrink:      0,
        }}
      />
    </button>
  )
}

// ── Status Pill ───────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<FermentationStatus, { label: string; color: string }> = {
  running:     { label: 'En curso',     color: '#22C55E' },
  scheduled:   { label: 'Programada',  color: '#3B82F6' },
  completed:   { label: 'Completada',  color: '#A78BFA' },
  interrupted: { label: 'Interrumpida',color: '#F59E0B' },
}

const StatusPill = ({ status }: { status: FermentationStatus }) => {
  const { label, color } = STATUS_CONFIG[status] ?? { label: status, color: '#71717A' }
  return (
    <span
      style={{
        display:         'inline-flex',
        alignItems:      'center',
        gap:             6,
        padding:         '4px 12px',
        borderRadius:    999,
        fontSize:        11,
        fontWeight:      500,
        color,
        backgroundColor: `${color}15`,
        border:          `1px solid ${color}30`,
      }}
    >
      {status === 'running' && (
        <span
          style={{
            width:           6,
            height:          6,
            borderRadius:    '50%',
            backgroundColor: color,
            display:         'inline-block',
            animation:       'pulse 1.5s infinite',
          }}
        />
      )}
      {label}
    </span>
  )
}

// ── Schedule Form ─────────────────────────────────────────────────────────────
const ScheduleForm = ({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: FermentationFormData) => void
  onCancel: () => void
  loading: boolean
}) => {
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
    width:           '100%',
    backgroundColor: '#0A0A0B',
    border:          '1px solid #2A2A2D',
    borderRadius:    8,
    color:           '#F4F4F5',
    fontSize:        13,
    padding:         '10px 12px',
    outline:         'none',
    fontFamily:      'Poppins, sans-serif',
    colorScheme:     'dark',
    boxSizing:       'border-box',
  }

  const labelBase: React.CSSProperties = {
    display:        'block',
    color:          '#71717A',
    fontSize:       10,
    letterSpacing:  '0.1em',
    textTransform:  'uppercase',
    marginBottom:   6,
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
          <input
            type="number"
            value={form.circuit_id}
            onChange={e => set('circuit_id', e.target.value)}
            style={inputBase}
            min={1}
          />
        </div>
        <div>
          <label style={labelBase}>Azúcar inicial (g/L)</label>
          <input
            type="number"
            value={form.initial_sugar}
            onChange={e => set('initial_sugar', e.target.value)}
            placeholder="Ej: 120"
            style={inputBase}
            min={0}
            step={0.1}
          />
        </div>
        <div>
          <label style={labelBase}>Inicio programado</label>
          <input
            type="datetime-local"
            value={form.scheduled_start}
            onChange={e => set('scheduled_start', e.target.value)}
            style={inputBase}
          />
        </div>
        <div>
          <label style={labelBase}>Fin programado</label>
          <input
            type="datetime-local"
            value={form.scheduled_end}
            onChange={e => set('scheduled_end', e.target.value)}
            style={inputBase}
          />
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

// ── Main View ─────────────────────────────────────────────────────────────────
const FermentationView = () => {
  const {
    loading,
    error,
    successMessage,
    session,
    sensorStates,
    showForm,
    isRunning,
    setShowForm,
    startFermentation,
    stopFermentation,
    toggleSensor,
  } = useFermentationViewModel()

  const handleMainToggle = () => {
    if (isRunning) {
      stopFermentation(true)
    } else {
      setShowForm(true)
    }
  }

  const activeSensorsCount = Object.values(sensorStates).filter(Boolean).length

  return (
    <div
      style={{
        minHeight:       '100vh',
        backgroundColor: '#0A0A0B',
        padding:         '48px',
        display:         'flex',
        flexDirection:   'column',
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
          Control
        </p>
        <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          Iniciar Fermentación
        </h1>
        <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      {/* ── Alerts ── */}
      {error && (
        <div
          style={{
            marginBottom:    24,
            padding:         '12px 16px',
            borderRadius:    10,
            backgroundColor: '#F43F5E10',
            border:          '1px solid #F43F5E30',
            color:           '#F43F5E',
            fontSize:        13,
            display:         'flex',
            alignItems:      'center',
            gap:             8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {successMessage && (
        <div
          style={{
            marginBottom:    24,
            padding:         '12px 16px',
            borderRadius:    10,
            backgroundColor: '#22C55E10',
            border:          '1px solid #22C55E30',
            color:           '#22C55E',
            fontSize:        13,
            display:         'flex',
            alignItems:      'center',
            gap:             8,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {successMessage}
        </div>
      )}

      {/* ── Section 1: Control Principal ── */}
      <section
        style={{
          marginBottom:    24,
          padding:         24,
          borderRadius:    16,
          backgroundColor: '#111113',
          border:          '1px solid #1F1F22',
        }}
      >
        <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 24, marginTop: 0 }}>
          Control Principal
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Left: icon + info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width:           48,
                height:          48,
                borderRadius:    12,
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                backgroundColor: isRunning ? '#22C55E15' : '#1A1A1D',
                border:          `1px solid ${isRunning ? '#22C55E40' : '#2A2A2D'}`,
                transition:      'all 0.3s',
                flexShrink:      0,
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke={isRunning ? '#22C55E' : '#52525B'} strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ transition: 'stroke 0.3s' }}
              >
                <path d="M12 2a10 10 0 1 0 10 10" />
                <path d="M12 6v6l4 2" />
                <path d="M18 2v4h4" />
              </svg>
            </div>

            <div>
              <p style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0 }}>
                Fermentación
              </p>
              <p style={{ color: '#52525B', fontSize: 12, margin: '3px 0 0 0' }}>
                {isRunning
                  ? `Sesión #${session?.id} en curso — todos los sensores activos`
                  : 'Activa todos los sensores, bomba y motor'}
              </p>
            </div>
          </div>

          {/* Right: status + toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {session && <StatusPill status={session.status} />}
            <ToggleSwitch
              checked={isRunning}
              onChange={handleMainToggle}
              disabled={loading || (!isRunning && showForm)}
              size="lg"
              color="#22C55E"
            />
          </div>
        </div>

        {/* Session meta (visible cuando hay sesión activa) */}
        {session && (
          <div
            style={{
              display:       'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap:           16,
              marginTop:     24,
              paddingTop:    20,
              borderTop:     '1px solid #1F1F22',
            }}
          >
            {[
              { label: 'Sesión ID',    value: `#${session.id}` },
              { label: 'Circuit ID',   value: `#${session.circuit_id}` },
              {
                label: 'Inicio real',
                value: session.actual_start
                  ? new Date(session.actual_start).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                  : '—',
              },
              {
                label: 'Fin programado',
                value: new Date(session.scheduled_end).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' }),
              },
            ].map(item => (
              <div key={item.label}>
                <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
                  {item.label}
                </p>
                <p style={{ color: '#A1A1AA', fontSize: 13, fontWeight: 500, margin: 0 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Form de configuración */}
        {showForm && !isRunning && (
          <ScheduleForm
            onSubmit={startFermentation}
            onCancel={() => setShowForm(false)}
            loading={loading}
          />
        )}
      </section>

      {/* ── Section 2: Sensores individuales ── */}
      <section
        style={{
          padding:         24,
          borderRadius:    16,
          backgroundColor: '#111113',
          border:          '1px solid #1F1F22',
        }}
      >
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>
            Control de Sensores
          </p>
          <span style={{ color: '#3F3F46', fontSize: 11 }}>
            {activeSensorsCount} / {Object.keys(sensorStates).length} activos
          </span>
        </div>

        {/* Sensor rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SENSOR_CONTROLS.map(sensor => {
            const isOn = sensorStates[sensor.key as SensorKey]

            return (
              <div
                key={sensor.key}
                style={{
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'space-between',
                  padding:         '14px 20px',
                  borderRadius:    12,
                  backgroundColor: isOn ? `${sensor.color}08` : '#0D0D0F',
                  border:          `1px solid ${isOn ? `${sensor.color}30` : '#1F1F22'}`,
                  transition:      'all 0.25s ease',
                }}
              >
                {/* Left: indicator + info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div
                    style={{
                      width:           8,
                      height:          8,
                      borderRadius:    '50%',
                      flexShrink:      0,
                      backgroundColor: isOn ? sensor.color : '#3F3F46',
                      boxShadow:       isOn ? `0 0 8px ${sensor.color}` : 'none',
                      transition:      'all 0.25s ease',
                    }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <p style={{ color: isOn ? '#F4F4F5' : '#71717A', fontSize: 13, fontWeight: 500, margin: 0, transition: 'color 0.25s' }}>
                        {sensor.label}
                      </p>
                      {sensor.isHardware && (
                        <span
                          style={{
                            padding:         '1px 6px',
                            borderRadius:    4,
                            backgroundColor: '#1F1F22',
                            color:           '#52525B',
                            fontSize:        9,
                            letterSpacing:   '0.06em',
                            textTransform:   'uppercase',
                          }}
                        >
                          HW
                        </span>
                      )}
                    </div>
                    <p style={{ color: '#3F3F46', fontSize: 11, margin: '2px 0 0 0' }}>
                      {sensor.description} · {sensor.unit}
                    </p>
                  </div>
                </div>

                {/* Right: active label + toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {isOn && (
                    <span style={{ color: sensor.color, fontSize: 10, letterSpacing: '0.08em', fontWeight: 500 }}>
                      ACTIVO
                    </span>
                  )}
                  <ToggleSwitch
                    checked={isOn}
                    onChange={() => toggleSensor(sensor.key as SensorKey)}
                    disabled={loading}
                    size="sm"
                    color={sensor.color}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {/* Nota al pie */}
        <p style={{ color: '#3F3F46', fontSize: 11, marginTop: 16, marginBottom: 0 }}>
          * Los toggles de <span style={{ color: '#52525B' }}>Motor</span> y{' '}
          <span style={{ color: '#52525B' }}>Bomba</span> son temporales para pruebas y se eliminarán en producción.
        </p>
      </section>
    </div>
  )
}

export default FermentationView