import { useNavigate, useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useExperimentStore } from '../../../../core/store/useExperimentStore'

const ResultsView = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { lastResult } = useExperimentStore()
  const result = lastResult

  if (!result) return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0B' }}>
      <p className="text-sm text-red-400">No hay resultados disponibles.</p>
    </div>
  )

  const historyData = result.history.map((fitness, i) => ({
    generacion: i,
    fitness: parseFloat(fitness.toFixed(4)),
  }))

  const tooltipStyle = {
    backgroundColor: '#111113',
    border: '1px solid #1F1F22',
    borderRadius: '8px',
    color: '#F4F4F5',
    fontSize: '12px',
    fontFamily: 'Poppins, sans-serif',
  }

  const metrics = [
    { label: 'RPM', value: result.best_individual.rpm.toFixed(1), unit: '', description: 'Velocidad de agitación óptima' },
    { label: 'Temperatura', value: result.best_individual.temperature.toFixed(1), unit: '°C', description: 'Temperatura del biorreactor' },
    { label: 'Flujo', value: result.best_individual.flow.toFixed(2), unit: 'L/h', description: 'Tasa de flujo volumétrico' },
    { label: 'Fitness', value: result.best_individual.fitness.toFixed(4), unit: '', description: 'Puntuación de aptitud global' },
  ]

  const totalGenerations = result.history.length
  const improvement = (((result.history[totalGenerations - 1] - result.history[0]) / result.history[0]) * 100).toFixed(1)
  const bestGeneration = result.history.indexOf(Math.max(...result.history))

  return (
    <div className="min-h-screen flex flex-col px-12 py-12" style={{ backgroundColor: '#0A0A0B' }}>

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>
          Optimización completada
        </p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#F4F4F5' }}>
          Resultados
        </h1>
        <div className="mt-3 h-px w-24" style={{ backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl px-6 py-4" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#52525B' }}>Generaciones</p>
          <p className="text-2xl font-bold" style={{ color: '#F4F4F5' }}>{totalGenerations}</p>
          <p className="text-xs mt-1" style={{ color: '#52525B' }}>iteraciones del algoritmo</p>
        </div>
        <div className="rounded-xl px-6 py-4" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#52525B' }}>Mejora total</p>
          <p className="text-2xl font-bold" style={{ color: '#22C55E' }}>+{improvement}%</p>
          <p className="text-xs mt-1" style={{ color: '#52525B' }}>respecto a la generación inicial</p>
        </div>
        <div className="rounded-xl px-6 py-4" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#52525B' }}>Mejor generación</p>
          <p className="text-2xl font-bold" style={{ color: '#F4F4F5' }}>{bestGeneration}</p>
          <p className="text-xs mt-1" style={{ color: '#52525B' }}>donde se alcanzó el máximo</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 rounded-2xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #22C55E33' }}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#22C55E' }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: '#22C55E' }}>Mejor individuo</p>
          </div>
          <div className="space-y-5">
            {metrics.map(item => (
              <div key={item.label}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs" style={{ color: '#52525B' }}>{item.label}</span>
                  <span className="text-lg font-bold" style={{ color: '#F4F4F5' }}>
                    {item.value}
                    <span className="text-sm font-normal ml-1" style={{ color: '#52525B' }}>{item.unit}</span>
                  </span>
                </div>
                <p className="text-xs" style={{ color: '#3F3F46' }}>{item.description}</p>
                <div className="mt-2 h-px" style={{ backgroundColor: '#1F1F22' }} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 rounded-2xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
          <p className="text-xs tracking-widest uppercase mb-1" style={{ color: '#71717A' }}>Evolución del fitness</p>
          <p className="text-sm mb-6" style={{ color: '#52525B' }}>Cómo mejoró el algoritmo a lo largo de las generaciones</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F1F22" />
              <XAxis
                dataKey="generacion"
                tick={{ fill: '#52525B', fontSize: 11 }}
                axisLine={{ stroke: '#1F1F22' }}
                tickLine={false}
                label={{ value: 'Generación', position: 'insideBottom', offset: -2, fill: '#52525B', fontSize: 10 }}
              />
              <YAxis
                tick={{ fill: '#52525B', fontSize: 11 }}
                axisLine={{ stroke: '#1F1F22' }}
                tickLine={false}
                width={55}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="fitness"
                stroke="#22C55E"
                strokeWidth={2}
                dot={{ fill: '#22C55E', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate(`/experiment/${id}`)}
          className="py-4 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-3"
          style={{ backgroundColor: '#111113', color: '#A1A1AA', border: '1px solid #1F1F22', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7h18M3 12h18M3 17h18" />
          </svg>
          Ver todas las generaciones
        </button>
        <button
          onClick={() => navigate(`/experiment/${id}/charts`)}
          className="py-4 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-3"
          style={{ backgroundColor: '#22C55E', color: '#0A0A0B', cursor: 'pointer' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18M7 16l4-4 4 4 4-8" />
          </svg>
          Ver gráficas completas
        </button>
      </div>
    </div>
  )
}

export default ResultsView