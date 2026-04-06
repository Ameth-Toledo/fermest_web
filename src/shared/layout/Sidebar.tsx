import { useNavigate, useLocation } from 'react-router-dom'
import { useExperimentStore } from '../../core/store/useExperimentStore'
import { nav } from '../../core/navigation/navItems'

const Sidebar = () => {
  const { experimentId, individualId } = useExperimentStore()
  const navigate = useNavigate()
  const location = useLocation()

  const resolveePath = (path: string) => {
    if (path.includes('/simulation/:id')) {
      return individualId ? `/simulation/${individualId}` : null
    }
    if (path.includes(':id')) {
      return experimentId ? path.replace(':id', experimentId) : null
    }
    return path
  }

  return (
    <aside
      className="fixed left-0 top-0 h-full w-60 flex flex-col py-8 px-4"
      style={{ backgroundColor: '#111215', borderRight: '1px solid #1A1A1D' }}
    >
      <div className="mb-10 px-2 flex items-center gap-3">
        <img
          src="/assets/fermest.png"
          alt="FermEST"
          className="h-10 object-contain"
        />
        <span className="text-base font-semibold" style={{ color: '#F4F4F5' }}>
          FermEST
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((item) => {
          const resolvedPath = resolveePath(item.path)
          const isDisabled = !resolvedPath
          const isActive = resolvedPath && location.pathname === resolvedPath

          return (
            <button
              key={item.label}
              onClick={() => resolvedPath && navigate(resolvedPath)}
              disabled={isDisabled}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all w-full"
              style={{
                backgroundColor: isActive ? '#16A34A22' : 'transparent',
                borderLeft: isActive ? '2px solid #22C55E' : '2px solid transparent',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: isDisabled ? 0.3 : 1,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? '#22C55E' : '#71717A'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              <div>
                <p className="text-xs font-medium" style={{ color: isActive ? '#22C55E' : '#A1A1AA' }}>
                  {item.label}
                </p>
                <p className="text-xs" style={{ color: '#52525B', fontSize: '10px' }}>
                  {item.description}
                </p>
              </div>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-2">
        <div className="h-px w-full mb-4" style={{ backgroundColor: '#1A1A1D' }} />
        <p className="text-xs" style={{ color: '#3F3F46' }}>FermEST v1.0</p>
      </div>
    </aside>
  )
}

export default Sidebar