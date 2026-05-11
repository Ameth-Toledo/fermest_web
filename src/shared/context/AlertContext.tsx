import { createContext, useCallback, useContext, useState, type ReactNode, type ReactElement } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from '../../components/ui/dialog'
import { cn } from '../../lib/utils'

type AlertVariant = 'error' | 'success' | 'warning' | 'info'

interface AlertConfig {
  title: string
  description: string
  variant?: AlertVariant
  confirmLabel?: string
}

interface AlertContextValue {
  showAlert: (config: AlertConfig) => void
}

const AlertContext = createContext<AlertContextValue | null>(null)

const variantStyles: Record<AlertVariant, { icon: ReactElement; iconBg: string; titleColor: string; border: string }> = {
  error: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    iconBg: 'bg-red-500/10 text-red-400',
    titleColor: 'text-red-300',
    border: 'border-red-500/20',
  },
  success: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
    ),
    iconBg: 'bg-green-500/10 text-green-400',
    titleColor: 'text-green-300',
    border: 'border-green-500/20',
  },
  warning: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    iconBg: 'bg-yellow-500/10 text-yellow-400',
    titleColor: 'text-yellow-300',
    border: 'border-yellow-500/20',
  },
  info: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    iconBg: 'bg-blue-500/10 text-blue-400',
    titleColor: 'text-blue-300',
    border: 'border-blue-500/20',
  },
}

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<AlertConfig | null>(null)
  const [open, setOpen] = useState(false)

  const showAlert = useCallback((cfg: AlertConfig) => {
    setConfig(cfg)
    setOpen(true)
  }, [])

  const styles = variantStyles[config?.variant ?? 'error']

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        {open && config && (
          <DialogContent
            from="top"
            showCloseButton={false}
            className={cn('border', styles.border)}
          >
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span className={cn('flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0', styles.iconBg)}>
                  {styles.icon}
                </span>
                <DialogTitle className={styles.titleColor}>{config.title}</DialogTitle>
              </div>
              <DialogDescription className="pl-12">{config.description}</DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <button
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-neutral-800 text-white hover:bg-neutral-700 transition-colors"
                >
                  {config.confirmLabel ?? 'Entendido'}
                </button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </AlertContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAlert = () => {
  const ctx = useContext(AlertContext)
  if (!ctx) throw new Error('useAlert must be used within AlertProvider')
  return ctx
}
