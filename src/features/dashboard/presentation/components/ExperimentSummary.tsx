import type { ExperimentSummaryProps as Props } from '../types/ExperimentSummaryProps'

const ExperimentSummary = ({ form, error, onSubmit }: Props) => (
  <>
    <div className="rounded-2xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
      <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#52525B' }}>Resumen</p>
      <div className="space-y-2">
        {[
          { label: 'pH',          value: `${form.ph}` },
          { label: 'Temperatura', value: `${form.temperature} °C` },
          { label: 'Azúcar',      value: `${form.sugar} g/L` },
          { label: 'Inóculo',     value: `${form.micro_amount} g/L` },
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
      onClick={onSubmit}
      className="w-full py-4 rounded-xl text-sm font-semibold tracking-widest uppercase transition-all flex items-center justify-center gap-3"
      style={{ backgroundColor: '#22C55E', color: '#0A0A0B', cursor: 'pointer' }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A0A0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 3l14 9-14 9V3z" />
      </svg>
      Ejecutar experimento
    </button>
  </>
)

export default ExperimentSummary
