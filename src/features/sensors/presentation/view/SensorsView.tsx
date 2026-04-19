import { useState } from 'react'
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useSensorsViewModel } from '../viewmodels/useSensorsViewModel'
import { SENSOR_META } from '../../domain/models/Sensor'
import type { WsStatus } from '../viewmodels/useSensorsViewModel'

// ── WS Status indicator ───────────────────────────────────────────────────────
const WS_CONFIG: Record<WsStatus, { label: string; color: string }> = {
  connected:    { label: 'En vivo',      color: '#22C55E' },
  connecting:   { label: 'Conectando…',  color: '#F59E0B' },
  disconnected: { label: 'Desconectado', color: '#52525B' },
  error:        { label: 'Error WS',     color: '#F43F5E' },
}

const WsIndicator = ({ status }: { status: WsStatus }) => {
  const { label, color } = WS_CONFIG[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width:           7,
          height:          7,
          borderRadius:    '50%',
          backgroundColor: color,
          display:         'inline-block',
          boxShadow:       status === 'connected' ? `0 0 8px ${color}` : 'none',
          animation:       status === 'connecting' ? 'pulse 1.2s infinite' : 'none',
        }}
      />
      <span style={{ color, fontSize: 11, fontWeight: 500, letterSpacing: '0.05em' }}>
        {label}
      </span>
    </div>
  )
}

// ── Latest value badge ────────────────────────────────────────────────────────
const LatestBadge = ({
  value,
  unit,
  color,
}: {
  value: number | undefined
  unit: string
  color: string
}) => (
  <div>
    <span style={{ color, fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>
      {value !== undefined ? value.toFixed(2) : '—'}
    </span>
    <span style={{ color: '#52525B', fontSize: 12, marginLeft: 4 }}>{unit}</span>
  </div>
)

// ── Custom tooltip ────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, unit }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        backgroundColor: '#111113',
        border:          '1px solid #1F1F22',
        borderRadius:    8,
        padding:         '8px 12px',
        fontSize:        12,
        fontFamily:      'Poppins, sans-serif',
      }}
    >
      <p style={{ color: '#52525B', margin: '0 0 4px 0' }}>{label}</p>
      <p style={{ color: '#F4F4F5', margin: 0, fontWeight: 600 }}>
        {payload[0].value.toFixed(3)} {unit}
      </p>
    </div>
  )
}

// ── Sensor Chart Card ─────────────────────────────────────────────────────────
const SensorCard = ({
  label,
  unit,
  color,
  description,
  data,
  latestValue,
}: {
  label: string
  unit: string
  color: string
  description: string
  data: { time: string; value: number }[]
  latestValue: number | undefined
}) => {
  const hasData = data.length > 0

  return (
    <div
      style={{
        padding:         24,
        borderRadius:    16,
        backgroundColor: '#111113',
        border:          '1px solid #1F1F22',
        display:         'flex',
        flexDirection:   'column',
        gap:             16,
      }}
    >
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <div
              style={{
                width:           8,
                height:          8,
                borderRadius:    '50%',
                backgroundColor: hasData ? color : '#3F3F46',
                boxShadow:       hasData ? `0 0 8px ${color}` : 'none',
                flexShrink:      0,
              }}
            />
            <p style={{ color: '#F4F4F5', fontSize: 13, fontWeight: 600, margin: 0 }}>
              {label}
            </p>
          </div>
          <p style={{ color: '#3F3F46', fontSize: 11, margin: 0 }}>{description}</p>
        </div>
        <LatestBadge value={latestValue} unit={unit} color={color} />
      </div>

      {/* Chart */}
      <div style={{ height: 140 }}>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={color} stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: '#3F3F46', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: '#3F3F46', fontSize: 9 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<ChartTooltip unit={unit} />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${label})`}
                dot={false}
                activeDot={{ r: 4, fill: color }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height:         '100%',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ color: '#3F3F46', fontSize: 12 }}>Sin datos aún</p>
          </div>
        )}
      </div>

      {/* Reading count */}
      <p style={{ color: '#3F3F46', fontSize: 10, margin: 0, letterSpacing: '0.05em' }}>
        {data.length} lectura{data.length !== 1 ? 's' : ''}
      </p>
    </div>
  )
}

// ── Circuit input ─────────────────────────────────────────────────────────────
const CircuitInput = ({
  value,
  onChange,
  onApply,
  loading,
}: {
  value: number
  onChange: (v: number) => void
  onApply: () => void
  loading: boolean
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div>
      <label
        style={{
          display:       'block',
          color:         '#52525B',
          fontSize:      10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom:  4,
        }}
      >
        Circuit ID
      </label>
      <input
        type="number"
        value={value}
        min={1}
        onChange={e => onChange(Number(e.target.value))}
        onKeyDown={e => e.key === 'Enter' && onApply()}
        style={{
          width:           80,
          backgroundColor: '#111113',
          border:          '1px solid #2A2A2D',
          borderRadius:    8,
          color:           '#F4F4F5',
          fontSize:        13,
          padding:         '8px 10px',
          outline:         'none',
          fontFamily:      'Poppins, sans-serif',
        }}
      />
    </div>
    <button
      onClick={onApply}
      disabled={loading}
      style={{
        marginTop:       20,
        padding:         '9px 18px',
        borderRadius:    8,
        border:          'none',
        backgroundColor: loading ? '#16A34A55' : '#22C55E',
        color:           '#0A0A0B',
        fontSize:        12,
        fontWeight:      600,
        cursor:          loading ? 'not-allowed' : 'pointer',
        fontFamily:      'Poppins, sans-serif',
      }}
    >
      {loading ? 'Cargando…' : 'Conectar'}
    </button>
  </div>
)

// ── Main View ─────────────────────────────────────────────────────────────────
const SensorsView = () => {
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
  } = useSensorsViewModel()

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
      {/* ── Header ── */}
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

      {/* ── Controls bar ── */}
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
          onApply={() => applyCircuit(circuitId)}
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

      {/* ── Error ── */}
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

      {/* ── Charts grid ── */}
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