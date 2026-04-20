import { useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useExperimentStore } from '../../core/store/useExperimentStore'
import { nav } from '../../core/navigation/navItems'

const Sidebar = () => {
  const { experimentId, individualId } = useExperimentStore()
  const navigate  = useNavigate()
  const location  = useLocation()
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ Experimento: true })
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null)

  const resolveePath = (path: string) => {
    if (path.includes('/simulation/:id')) {
      return individualId ? `/simulation/${individualId}` : null
    }
    if (path.includes(':id')) {
      return experimentId ? path.replace(':id', experimentId) : null
    }
    return path
  }

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const soloItems = nav.filter(item => !item.group)

  const groups = nav
    .filter(item => item.group)
    .reduce<string[]>((acc, item) => {
      if (!acc.includes(item.group!)) acc.push(item.group!)
      return acc
    }, [])

  const renderNavButton = (item: typeof nav[0], indented = false) => {
    const resolvedPath = resolveePath(item.path)
    const isDisabled   = !resolvedPath
    const isActive     = !!(resolvedPath && location.pathname === resolvedPath)
    const isHovered    = hoveredLabel === item.label

    return (
      <button
        key={item.label}
        onClick={() => resolvedPath && navigate(resolvedPath)}
        disabled={isDisabled}
        onMouseEnter={() => !isDisabled && setHoveredLabel(item.label)}
        onMouseLeave={() => setHoveredLabel(null)}
        className="flex items-center gap-3 py-2.5 rounded-lg text-left transition-all w-full"
        style={{
          marginLeft:      indented ? '12px' : '0px',
          width:           indented ? 'calc(100% - 12px)' : '100%',
          paddingLeft:     indented ? '10px' : '0.75rem',
          paddingRight:    '0.75rem',
          backgroundColor: isActive
            ? '#16A34A22'
            : isHovered
              ? '#1C1C20'
              : 'transparent',
          borderLeft: isActive
            ? '2px solid #22C55E'
            : isHovered
              ? '2px solid #2A2A2E'
              : '2px solid transparent',
          cursor:  isDisabled ? 'not-allowed' : 'pointer',
          opacity: isDisabled ? 0.3 : 1,
          transform: isHovered && !isActive ? 'translateX(2px)' : 'translateX(0)',
          transition: 'background-color 0.15s, border-color 0.15s, transform 0.15s, opacity 0.15s',
        }}
      >
        <svg
          width={indented ? 13 : 18}
          height={indented ? 13 : 18}
          viewBox="0 0 24 24"
          fill="none"
          stroke={isActive ? '#22C55E' : isHovered ? '#A1A1AA' : '#52525B'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ flexShrink: 0, transition: 'stroke 0.15s' }}
        >
          <path d={item.icon} />
        </svg>
        <div>
          <p
            className="text-xs font-medium"
            style={{
              color:      isActive ? '#22C55E' : isHovered ? '#D4D4D8' : '#A1A1AA',
              fontSize:   indented ? '11px' : '12px',
              transition: 'color 0.15s',
            }}
          >
            {item.label}
          </p>
          <p style={{ color: isHovered ? '#52525B' : '#3F3F46', fontSize: '10px', transition: 'color 0.15s' }}>
            {item.description}
          </p>
        </div>
      </button>
    )
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col py-8 px-4"
      style={{ backgroundColor: '#111215', borderRight: '1px solid #1A1A1D' }}
    >
      <div className="mb-10 px-2 flex items-center gap-3">
        <img src="/assets/logo.svg" alt="FermEST" className="h-10 object-contain" />
        <span className="text-base font-semibold" style={{ color: '#F4F4F5' }}>FermEST</span>
      </div>

      <nav className="flex flex-col gap-1">
        {soloItems.map(item => renderNavButton(item, false))}
        {groups.map(group => {
          const groupItems  = nav.filter(item => item.group === group)
          const firstItem   = groupItems[0]
          const isOpen      = openGroups[group] ?? false
          const isAnyActive = groupItems.some(item => {
            const resolved = resolveePath(item.path)
            return resolved && location.pathname === resolved
          })
          const isGroupHovered = hoveredLabel === `group:${group}`

          return (
            <div key={group}>
              <button
                onClick={() => toggleGroup(group)}
                onMouseEnter={() => setHoveredLabel(`group:${group}`)}
                onMouseLeave={() => setHoveredLabel(null)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all w-full"
                style={{
                  backgroundColor: isAnyActive
                    ? '#16A34A22'
                    : isGroupHovered
                      ? '#1C1C20'
                      : 'transparent',
                  borderLeft: isAnyActive
                    ? '2px solid #22C55E'
                    : isGroupHovered
                      ? '2px solid #2A2A2E'
                      : '2px solid transparent',
                  cursor:     'pointer',
                  transition: 'background-color 0.15s, border-color 0.15s',
                }}
              >
                <svg
                  width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke={isAnyActive ? '#22C55E' : isGroupHovered ? '#A1A1AA' : '#52525B'}
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transition: 'stroke 0.15s' }}
                >
                  <path d={firstItem.groupIcon ?? firstItem.icon} />
                </svg>
                <div className="flex-1">
                  <p
                    className="text-xs font-medium"
                    style={{
                      color:      isAnyActive ? '#22C55E' : isGroupHovered ? '#D4D4D8' : '#A1A1AA',
                      transition: 'color 0.15s',
                    }}
                  >
                    {group}
                  </p>
                  <p style={{ color: isGroupHovered ? '#52525B' : '#3F3F46', fontSize: '10px', transition: 'color 0.15s' }}>
                    {firstItem.groupDescription ?? ''}
                  </p>
                </div>
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="#52525B" strokeWidth="2" strokeLinecap="round"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              <div
                style={{
                  maxHeight:  isOpen ? `${groupItems.length * 52}px` : '0px',
                  overflow:   'hidden',
                  transition: 'max-height 0.25s ease',
                  borderLeft:  '1px solid #1F1F22',
                  marginLeft:  '20px',
                  paddingLeft: '0px',
                  marginTop:   isOpen ? '2px' : '0px',
                  marginBottom: isOpen ? '2px' : '0px',
                }}
              >
                {groupItems.map(item => renderNavButton(item, true))}
              </div>
            </div>
          )
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="h-px w-full mb-3" style={{ backgroundColor: '#1A1A1D' }} />
        <button
          onClick={() => { localStorage.removeItem('access_token'); navigate('/login') }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200 hover:bg-red-500/10 group"
        >
          <svg
            width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="group-hover:stroke-red-400 transition-colors"
          >
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-xs font-medium text-neutral-500 group-hover:text-red-400 transition-colors">
            Cerrar sesión
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar