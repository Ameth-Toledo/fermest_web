import { microorganisms } from '../constants/microorganisms'
import type { MicroorganismSelectorProps as Props } from '../types/MicroorganismSelectorProps'

const MicroorganismSelector = ({ selected, onSelect }: Props) => (
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
          onClick={() => onSelect(m.value)}
          className="w-full text-left px-4 py-3 rounded-xl transition-all"
          style={{
            backgroundColor: selected === m.value ? '#16A34A18' : '#18181B',
            border:          `1px solid ${selected === m.value ? '#22C55E' : '#27272A'}`,
          }}
        >
          <p className="text-xs font-medium mb-0.5" style={{ color: selected === m.value ? '#22C55E' : '#A1A1AA' }}>
            {m.label}
          </p>
          <p className="text-xs" style={{ color: '#52525B' }}>{m.description}</p>
        </button>
      ))}
    </div>
  </div>
)

export default MicroorganismSelector
