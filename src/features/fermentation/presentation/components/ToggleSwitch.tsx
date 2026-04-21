import type { ToggleSwitchProps } from '../types/ToggleSwitchProps'

const ToggleSwitch = ({ checked, onChange, disabled = false }: ToggleSwitchProps) => (
  <button
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={onChange}
    style={{
      position:        'relative',
      width:           52,
      height:          28,
      borderRadius:    999,
      border:          'none',
      cursor:          disabled ? 'not-allowed' : 'pointer',
      padding:         0,
      backgroundColor: checked ? '#22C55E' : '#27272A',
      transition:      'background-color 0.25s ease',
      opacity:         disabled ? 0.4 : 1,
      flexShrink:      0,
      outline:         'none',
      boxShadow:       checked
        ? '0 0 0 1px #22C55E55, inset 0 1px 2px rgba(0,0,0,0.3)'
        : 'inset 0 1px 3px rgba(0,0,0,0.6)',
    }}
  >
    <span
      style={{
        position:        'absolute',
        top:             4,
        left:            checked ? 28 : 4,
        width:           20,
        height:          20,
        borderRadius:    '50%',
        backgroundColor: '#fff',
        transition:      'left 0.25s ease',
        boxShadow:       '0 1px 4px rgba(0,0,0,0.5)',
      }}
    />
  </button>
)

export default ToggleSwitch