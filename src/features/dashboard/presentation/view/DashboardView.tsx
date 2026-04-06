import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDashboardViewModel } from '../viewmodels/useDashboardViewModel'
import type { RunExperimentRequest } from '../../domain/models/RunExperiment'
import { useExperimentStore } from '../../../../core/store/useExperimentStore'

const AGD_MESSAGES = [
  'Inicializando población genética...',
  'Evaluando aptitud de individuos...',
  'Seleccionando mejores candidatos...',
  'Aplicando cruzamiento genético...',
  'Introduciendo mutaciones...',
  'Evolucionando siguiente generación...',
  'Simulando proceso de fermentación...',
  'Calculando producción de etanol...',
  'Optimizando parámetros de RPM...',
  'Analizando biomasa generada...',
  'Convergiendo hacia solución óptima...',
  'Calculando eficiencia energética...',
]

const LoadingScreen = ({ elapsed }: { elapsed: number }) => {
  const [msgIndex, setMsgIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setMsgIndex(prev => (prev + 1) % AGD_MESSAGES.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ backgroundColor: '#0A0A0B' }}>
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 12 + 4}px`,
              height: `${Math.random() * 12 + 4}px`,
              left: `${Math.random() * 100}%`,
              bottom: `-20px`,
              backgroundColor: i % 3 === 0 ? '#22C55E' : i % 3 === 1 ? '#16A34A' : '#15803D',
              opacity: Math.random() * 0.4 + 0.1,
              animation: `bubble ${Math.random() * 6 + 5}s ease-in ${Math.random() * 5}s infinite`,
            }}
          />
        ))}
      </div>
      <div className="absolute rounded-full blur-3xl" style={{ width: '400px', height: '400px', backgroundColor: '#22C55E', opacity: 0.04, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 text-center">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2" style={{ borderColor: '#1F1F22' }} />
          <div className="absolute inset-0 rounded-full border-2 border-transparent" style={{ borderTopColor: '#22C55E', animation: 'spin 1s linear infinite' }} />
          <div className="absolute inset-3 rounded-full border-2 border-transparent" style={{ borderTopColor: '#16A34A', animation: 'spin 1.5s linear infinite reverse' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>Algoritmo Genético en ejecución</p>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#F4F4F5' }}>Optimizando fermentación</h2>
          <p className="text-sm" style={{ color: '#52525B' }}>Tiempo transcurrido: <span style={{ color: '#71717A' }}>{elapsed}s</span></p>
        </div>
        <div className="px-6 py-3 rounded-xl" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22', transition: 'opacity 0.3s ease', opacity: visible ? 1 : 0, minWidth: '320px' }}>
          <p className="text-sm" style={{ color: '#A1A1AA' }}>{AGD_MESSAGES[msgIndex]}</p>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 20 }).map((_, i) => {
            const filled = Math.floor(elapsed / 1.5)
            return (
              <div key={i} className="rounded-full transition-all duration-500" style={{ width: '6px', height: '6px', backgroundColor: i < filled ? '#22C55E' : '#1F1F22', transform: i < filled ? 'scale(1.2)' : 'scale(1)' }} />
            )
          })}
        </div>
        <p className="text-xs" style={{ color: '#3F3F46' }}>Este proceso puede tomar entre 20 y 60 segundos</p>
      </div>
      <style>{`
        @keyframes bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { transform: translateY(-100vh) scale(0.5); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

const fields = [
  {
    name: 'ph',
    label: 'pH',
    type: 'slider',
    min: 4,
    max: 10,
    step: 0.1,
    unit: '',
    description: 'Nivel de acidez del medio',
    icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    name: 'temperature',
    label: 'Temperatura',
    type: 'slider',
    min: 15,
    max: 45,
    step: 0.5,
    unit: '°C',
    description: 'Temperatura del biorreactor',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    name: 'sugar',
    label: 'Azúcar',
    type: 'slider',
    min: 1,
    max: 50,
    step: 0.5,
    unit: 'g/L',
    description: 'Concentración de sustrato',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    name: 'micro_amount',
    label: 'Cantidad microorganismo',
    type: 'slider',
    min: 0.1,
    max: 5,
    step: 0.1,
    unit: 'g/L',
    description: 'Inóculo inicial',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  },
]

const microorganisms = [
  { value: 'saccharomyces', label: 'Saccharomyces cerevisiae', description: 'Levadura clásica para etanol' },
  { value: 'kluyveromyces', label: 'Kluyveromyces marxianus', description: 'Alta tolerancia a temperatura' },
  { value: 'zymomonas', label: 'Zymomonas mobilis', description: 'Alta eficiencia de conversión' },
]

const DashboardView = () => {
  const navigate = useNavigate()
  const { setExperimentId, setLastResult } = useExperimentStore()
  const { loading, error, runExperiment } = useDashboardViewModel()
  const [elapsed, setElapsed] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [form, setForm] = useState<RunExperimentRequest>({
    ph: 7.0,
    temperature: 25,
    sugar: 10,
    microorganism: 'saccharomyces',
    micro_amount: 1.5,
  })

  useEffect(() => {
    if (!loading) { setElapsed(0); return }
    const interval = setInterval(() => setElapsed(prev => prev + 1), 1000)
    return () => clearInterval(interval)
  }, [loading])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'microorganism' ? value : Number(value) }))
  }

  const handleSubmit = async () => {
    const result = await runExperiment(form)
    if (result?.experiment_id) {
      setExperimentId(result.experiment_id)
      setLastResult(result)
      navigate(`/results/${result.experiment_id}`)
    }
  }

  const startStep = (fieldName: string, step: number, min: number, max: number, direction: number) => {
    setForm(prev => {
      const current = prev[fieldName as keyof RunExperimentRequest] as number
      const newValue = Math.min(max, Math.max(min, Number((current + direction * step).toFixed(2))))
      return { ...prev, [fieldName]: newValue }
    })
    intervalRef.current = setInterval(() => {
      setForm(prev => {
        const current = prev[fieldName as keyof RunExperimentRequest] as number
        const newValue = Math.min(max, Math.max(min, Number((current + direction * step).toFixed(2))))
        return { ...prev, [fieldName]: newValue }
      })
    }, 150)
  }

  const stopStep = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  if (loading) return <LoadingScreen elapsed={elapsed} />

  return (
    <div className="min-h-screen flex flex-col px-12 py-12" style={{ backgroundColor: '#0A0A0B' }}>

      <div className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#22C55E' }}>
          Algoritmo Genético
        </p>
        <h1 className="text-4xl font-bold tracking-tight" style={{ color: '#F4F4F5' }}>
          Nuevo Experimento
        </h1>
        <div className="mt-3 h-px w-24" style={{ backgroundColor: '#22C55E', opacity: 0.4 }} />
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6">

        <div className="col-span-2 flex flex-col gap-4">
          {fields.map(field => {
            const value = form[field.name as keyof RunExperimentRequest] as number
            const percent = ((value - field.min) / (field.max - field.min)) * 100
            return (
              <div
                key={field.name}
                className="rounded-2xl p-6"
                style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#16A34A18', border: '1px solid #16A34A33' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={field.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#F4F4F5' }}>{field.label}</p>
                      <p className="text-xs" style={{ color: '#52525B' }}>{field.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onMouseDown={() => startStep(field.name, field.step, field.min, field.max, -1)}
                      onMouseUp={stopStep}
                      onMouseLeave={stopStep}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ backgroundColor: '#1F1F22', color: '#71717A' }}
                    >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M5 12h14" />
                    </svg>
                  </button>
                    <input
                      type="number"
                      name={field.name}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={value}
                      onChange={handleChange}
                      className="text-right text-2xl font-bold outline-none w-20 bg-transparent"
                      style={{ color: '#22C55E' }}
                    />
                    <button
                      onMouseDown={() => startStep(field.name, field.step, field.min, field.max, 1)}
                      onMouseUp={stopStep}
                      onMouseLeave={stopStep}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ backgroundColor: '#1F1F22', color: '#71717A' }}
                    >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="w-full h-1.5 rounded-full mb-1" style={{ backgroundColor: '#1F1F22' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, backgroundColor: '#22C55E' }} />
                  </div>
                  <input
                    type="range"
                    name={field.name}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={value}
                    onChange={handleChange}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer"
                    style={{ height: '24px', top: '-6px' }}
                  />
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: '#3F3F46' }}>{field.min}{field.unit}</span>
                    <span className="text-xs" style={{ color: '#3F3F46' }}>{field.max}{field.unit}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl p-6 flex-1" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#16A34A18', border: '1px solid #16A34A33' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: '#F4F4F5' }}>Microorganismo</p>
                <p className="text-xs" style={{ color: '#52525B' }}>Cepa fermentadora</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {microorganisms.map(m => (
                <button
                  key={m.value}
                  onClick={() => setForm(prev => ({ ...prev, microorganism: m.value }))}
                  className="w-full text-left px-4 py-3 rounded-xl transition-all"
                  style={{
                    backgroundColor: form.microorganism === m.value ? '#16A34A18' : '#18181B',
                    border: `1px solid ${form.microorganism === m.value ? '#22C55E' : '#27272A'}`,
                  }}
                >
                  <p className="text-xs font-medium mb-0.5" style={{ color: form.microorganism === m.value ? '#22C55E' : '#A1A1AA' }}>
                    {m.label}
                  </p>
                  <p className="text-xs" style={{ color: '#52525B' }}>{m.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#52525B' }}>Resumen</p>
            <div className="space-y-2">
              {[
                { label: 'pH', value: `${form.ph}` },
                { label: 'Temperatura', value: `${form.temperature} °C` },
                { label: 'Azúcar', value: `${form.sugar} g/L` },
                { label: 'Inóculo', value: `${form.micro_amount} g/L` },
              ].map(item => (
                <div key={item.label} className="flex justify-between">
                  <span className="text-xs" style={{ color: '#52525B' }}>{item.label}</span>
                  <span className="text-xs font-medium" style={{ color: '#A1A1AA' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-3"
            style={{ backgroundColor: '#22C55E', color: '#0A0A0B', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3l14 9-14 9V3z" />
            </svg>
            Ejecutar experimento
          </button>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #22C55E;
          cursor: pointer;
          border: 2px solid #0A0A0B;
          box-shadow: 0 0 0 2px #22C55E;
        }
      `}</style>
    </div>
  )
}

export default DashboardView