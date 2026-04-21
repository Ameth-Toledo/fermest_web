import { useSensorsViewModel } from '../viewmodels/useSensorsViewModel'
import { useFermentation } from '../../../fermentation/presentation/context/FermentationContext'
import { SENSOR_META } from '../../domain/models/Sensor'
import WsIndicator from '../components/WsIndicator'
import SensorCard from '../components/SensorCard'
import CircuitInput from '../components/CircuitInput'

const SensorsView = () => {
  const { session, circuitId: ferCircuitId } = useFermentation()

  const {
    circuitId,
    wsStatus,
    chartData,
    latestValues,
    loading,
    error,
    setCircuitId,
    applyCircuit,
    disconnectWs,
  } = useSensorsViewModel({
    autoCircuitId: ferCircuitId ?? undefined,
    autoSessionId: session?.id,
  })

  const isConnected = wsStatus === 'connected'

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
      <div style={{ marginBottom: 40 }}>
        <p style={{ color: '#22C55E', fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>
          Monitoreo
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ color: '#F4F4F5', fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
              Sensores en Tiempo Real
            </h1>
            <div style={{ marginTop: 12, height: 1, width: 96, backgroundColor: '#22C55E', opacity: 0.4 }} />
          </div>
          <WsIndicator status={wsStatus} />
        </div>
      </div>

      <div
        style={{
          display:         'flex',
          alignItems:      'flex-end',
          justifyContent:  'space-between',
          marginBottom:    32,
          padding:         '20px 24px',
          borderRadius:    12,
          backgroundColor: '#111113',
          border:          '1px solid #1F1F22',
        }}
      >
        <CircuitInput
          value={circuitId}
          onChange={setCircuitId}
          onApply={() => applyCircuit(circuitId, session?.id)}
          loading={loading}
        />

        {isConnected && (
          <button
            onClick={disconnectWs}
            style={{
              padding:         '9px 18px',
              borderRadius:    8,
              border:          '1px solid #3F3F46',
              backgroundColor: 'transparent',
              color:           '#71717A',
              fontSize:        12,
              cursor:          'pointer',
              fontFamily:      'Poppins, sans-serif',
            }}
          >
            Desconectar
          </button>
        )}
      </div>

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
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      <div
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap:                 20,
        }}
      >
        {SENSOR_META.map(sensor => (
          <SensorCard
            key={sensor.key}
            label={sensor.label}
            unit={sensor.unit}
            color={sensor.color}
            description={sensor.description}
            data={chartData[sensor.key]}
            latestValue={latestValues[sensor.key]}
          />
        ))}
      </div>
    </div>
  )
}

export default SensorsView