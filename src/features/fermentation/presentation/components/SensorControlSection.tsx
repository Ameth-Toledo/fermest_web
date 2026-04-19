import { SENSOR_CONTROLS } from '../../domain/models/Fermentation'
import type { SensorKey } from '../../domain/models/Fermentation'
import type { SensorControlSectionProps as Props } from '../types/SensorControlSectionProps'
import ToggleSwitch from './ToggleSwitch'

const CARD_STYLES = `
  .sensor-card {
    transition: transform 0.2s ease, box-shadow 0.25s ease, border-color 0.25s ease, background-color 0.25s ease;
  }
  .sensor-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.35);
  }
  .sensor-card.active {
    animation: sensor-card-glow 3s ease-in-out infinite;
  }
  @keyframes sensor-card-glow {
    0%, 100% { box-shadow: 0 0 0px transparent; }
    50%       { box-shadow: 0 0 16px var(--glow); }
  }
  .sensor-dot {
    transition: background-color 0.25s, box-shadow 0.25s;
  }
  .sensor-dot.active {
    animation: sensor-dot-pulse 1.8s ease-in-out infinite;
  }
  @keyframes sensor-dot-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.55; transform: scale(1.45); }
  }
  .sensor-status.active {
    animation: sensor-status-blink 2.2s ease-in-out infinite;
  }
  @keyframes sensor-status-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.45; }
  }
`

const SensorControlSection = ({ sensorStates, loading, onToggle }: Props) => {
  const activeSensorsCount = Object.values(sensorStates).filter(Boolean).length

  return (
    <section
      style={{
        padding:         28,
        borderRadius:    16,
        backgroundColor: '#111113',
        border:          '1px solid #1F1F22',
      }}
    >
      <style>{CARD_STYLES}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <p style={{ color: '#52525B', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 4px 0' }}>
            Control de Sensores
          </p>
          <p style={{ color: '#F4F4F5', fontSize: 15, fontWeight: 600, margin: 0 }}>
            Dispositivos conectados
          </p>
        </div>
        <div
          style={{
            padding:         '5px 14px',
            borderRadius:    999,
            backgroundColor: activeSensorsCount > 0 ? '#22C55E12' : '#1A1A1D',
            border:          `1px solid ${activeSensorsCount > 0 ? '#22C55E30' : '#2A2A2D'}`,
          }}
        >
          <span style={{ color: activeSensorsCount > 0 ? '#22C55E' : '#3F3F46', fontSize: 12, fontWeight: 500 }}>
            {activeSensorsCount} / {Object.keys(sensorStates).length} activos
          </span>
        </div>
      </div>

      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap:                 16,
        }}
      >
        {SENSOR_CONTROLS.map(sensor => {
          const isOn = sensorStates[sensor.key as SensorKey]
          return (
            <div
              key={sensor.key}
              className={`sensor-card${isOn ? ' active' : ''}`}
              style={{
                '--glow':        `${sensor.color}44`,
                padding:         '20px',
                borderRadius:    14,
                backgroundColor: isOn ? `${sensor.color}08` : '#0D0D0F',
                border:          `1px solid ${isOn ? `${sensor.color}30` : '#1F1F22'}`,
                display:         'flex',
                flexDirection:   'column',
                gap:             14,
              } as React.CSSProperties}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width:           40,
                      height:          40,
                      borderRadius:    10,
                      backgroundColor: isOn ? `${sensor.color}15` : '#1A1A1D',
                      border:          `1px solid ${isOn ? `${sensor.color}25` : '#2A2A2D'}`,
                      display:         'flex',
                      alignItems:      'center',
                      justifyContent:  'center',
                      flexShrink:      0,
                      transition:      'all 0.25s ease',
                    }}
                  >
                    <div
                      className={`sensor-dot${isOn ? ' active' : ''}`}
                      style={{
                        width:           10,
                        height:          10,
                        borderRadius:    '50%',
                        backgroundColor: isOn ? sensor.color : '#3F3F46',
                        boxShadow:       isOn ? `0 0 8px ${sensor.color}` : 'none',
                      }}
                    />
                  </div>

                  <div>
                    <p style={{ color: isOn ? '#F4F4F5' : '#A1A1AA', fontSize: 13, fontWeight: 600, margin: 0, transition: 'color 0.25s' }}>
                      {sensor.label}
                    </p>
                    <p style={{ color: '#52525B', fontSize: 11, margin: '2px 0 0 0' }}>
                      {sensor.unit}
                    </p>
                  </div>
                </div>

                <ToggleSwitch
                  checked={isOn}
                  onChange={() => onToggle(sensor.key as SensorKey)}
                  disabled={loading}
                />
              </div>

              <p style={{ color: '#52525B', fontSize: 12, margin: 0, lineHeight: 1.6 }}>
                {sensor.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  className={`sensor-status${isOn ? ' active' : ''}`}
                  style={{
                    color:         isOn ? sensor.color : '#3F3F46',
                    fontSize:      11,
                    fontWeight:    600,
                    letterSpacing: '0.06em',
                  }}
                >
                  {isOn ? '● Activo' : '○ Inactivo'}
                </span>

                {sensor.isHardware && (
                  <span
                    style={{
                      padding:         '2px 7px',
                      borderRadius:    5,
                      backgroundColor: '#1F1F22',
                      color:           '#52525B',
                      fontSize:        9,
                      letterSpacing:   '0.08em',
                      textTransform:   'uppercase',
                      fontWeight:      600,
                    }}
                  >
                    HW
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ color: '#3F3F46', fontSize: 11, marginTop: 20, marginBottom: 0 }}>
        * Los toggles de <span style={{ color: '#52525B' }}>Motor</span> y{' '}
        <span style={{ color: '#52525B' }}>Bomba</span> son temporales para pruebas.
      </p>
    </section>
  )
}

export default SensorControlSection
