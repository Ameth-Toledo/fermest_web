import type { MainControlSectionProps as Props } from '../types/MainControlSectionProps'
import StatusPill from './StatusPill'
import ToggleSwitch from './ToggleSwitch'
import ScheduleForm from './ScheduleForm'

const MainControlSection = ({
  isRunning,
  loading,
  showForm,
  session,
  onMainToggle,
  onSubmit,
  onCancelForm,
}: Props) => (
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

      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {session && <StatusPill status={session.status} />}
        <ToggleSwitch
          checked={isRunning}
          onChange={onMainToggle}
          disabled={loading || (!isRunning && showForm)}
        />
      </div>
    </div>

    {session && (
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap:                 16,
          marginTop:           24,
          paddingTop:          20,
          borderTop:           '1px solid #1F1F22',
        }}
      >
        {[
          { label: 'Sesión ID',      value: `#${session.id}` },
          { label: 'Circuit ID',     value: `#${session.circuit_id}` },
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

    {showForm && !isRunning && (
      <ScheduleForm
        onSubmit={onSubmit}
        onCancel={onCancelForm}
        loading={loading}
      />
    )}
  </section>
)

export default MainControlSection
