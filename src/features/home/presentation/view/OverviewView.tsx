import { useNavigate }    from 'react-router-dom'
import { userAuth }        from '../../../../core/hooks/userAuth'
import { STATS }          from '../constants/stats'
import { QUICK_ACTIONS }  from '../constants/quickActions'
import { OVERVIEW_STYLES } from '../constants/styles'

const OverviewView = () => {
  const navigate = useNavigate()
  const { user } = userAuth()

  const now  = new Date()
  const date = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0A0B', padding: '48px' }}>
      <style>{OVERVIEW_STYLES}</style>

      <div style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Panel principal
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Bienvenido{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
            </h1>
            <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
          </div>
          <p style={{ color: '#3F3F46', fontSize: 12, textTransform: 'capitalize' }}>{date}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {STATS.map(stat => (
          <div
            key={stat.label}
            className="overview-stat-card"
            style={{
              padding:         '20px 24px',
              borderRadius:    14,
              backgroundColor: '#111113',
              border:          '1px solid #1F1F22',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div
                style={{
                  width:           36,
                  height:          36,
                  borderRadius:    10,
                  backgroundColor: `${stat.color}12`,
                  border:          `1px solid ${stat.color}25`,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon} />
                </svg>
              </div>
            </div>
            <p style={{ color: '#F4F4F5', fontSize: 28, fontWeight: 700, margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
              {stat.value}
            </p>
            <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 500, margin: '0 0 2px 0' }}>
              {stat.label}
            </p>
            <p style={{ color: '#3F3F46', fontSize: 11, margin: 0 }}>
              {stat.description}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 28 }}>
        <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>
          Acceso rápido
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {QUICK_ACTIONS.map(action => (
            <div
              key={action.label}
              className="overview-action-card"
              onClick={() => navigate(action.path)}
              style={{
                padding:         '24px 20px',
                borderRadius:    14,
                backgroundColor: '#111113',
                border:          '1px solid #1F1F22',
              }}
            >
              <div
                style={{
                  width:           44,
                  height:          44,
                  borderRadius:    12,
                  backgroundColor: `${action.color}12`,
                  border:          `1px solid ${action.color}25`,
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  marginBottom:    16,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={action.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={action.icon} />
                </svg>
              </div>
              <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 600, margin: '0 0 6px 0' }}>
                {action.label}
              </p>
              <p style={{ color: '#52525B', fontSize: 11, margin: 0, lineHeight: 1.5 }}>
                {action.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default OverviewView
