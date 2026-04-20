import type { ParameterSliderProps } from '../types/ParameterSliderProps'

const ParameterSlider = ({
  name, label, min, max, step, unit, description, icon,
  value, onChange, onStep, onStopStep,
}: ParameterSliderProps) => {
  const percent = ((value - min) / (max - min)) * 100

  return (
    <div className="rounded-2xl p-6" style={{ backgroundColor: '#111113', border: '1px solid #1F1F22' }}>
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#16A34A18', border: '1px solid #16A34A33' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d={icon} />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: '#F4F4F5' }}>{label}</p>
            <p className="text-xs" style={{ color: '#52525B' }}>{description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onMouseDown={() => onStep(name, step, min, max, -1)}
            onMouseUp={onStopStep}
            onMouseLeave={onStopStep}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
            style={{ backgroundColor: '#1F1F22', color: '#71717A' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M5 12h14" />
            </svg>
          </button>
          <input
            type="number"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="text-right text-2xl font-bold outline-none w-20 bg-transparent"
            style={{ color: '#22C55E' }}
          />
          <button
            onMouseDown={() => onStep(name, step, min, max, 1)}
            onMouseUp={onStopStep}
            onMouseLeave={onStopStep}
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
          name={name}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={onChange}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
          style={{ height: '24px', top: '-6px' }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: '#3F3F46' }}>{min}{unit}</span>
          <span className="text-xs" style={{ color: '#3F3F46' }}>{max}{unit}</span>
        </div>
      </div>
    </div>
  )
}

export default ParameterSlider
