import type { Status } from '../types/Status'
import { STATUS_CONFIG } from '../constants/statusConfig'

type Props = { status: Status }

const StatusPill = ({ status }: Props) => {
  const { label, color } = STATUS_CONFIG[status]
  return (
    <span style={{
      display:         'inline-flex',
      alignItems:      'center',
      gap:             5,
      padding:         '3px 10px',
      borderRadius:    999,
      fontSize:        11,
      fontWeight:      500,
      color,
      backgroundColor: `${color}15`,
      border:          `1px solid ${color}30`,
    }}>
      {status === 'running' && (
        <span style={{
          width:           5,
          height:          5,
          borderRadius:    '50%',
          backgroundColor: color,
          display:         'inline-block',
          animation:       'pulse 1.5s infinite',
        }} />
      )}
      {label}
    </span>
  )
}

export default StatusPill
