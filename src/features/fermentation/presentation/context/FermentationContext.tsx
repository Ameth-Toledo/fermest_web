import { createContext, useContext, type ReactNode } from 'react'
import { useFermentationViewModel } from '../viewmodels/useFermentationViewModel'

type FermentationContextValue = ReturnType<typeof useFermentationViewModel>

const FermentationContext = createContext<FermentationContextValue | null>(null)

export const FermentationProvider = ({ children }: { children: ReactNode }) => {
  const value = useFermentationViewModel()
  return (
    <FermentationContext.Provider value={value}>
      {children}
    </FermentationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useFermentation = (): FermentationContextValue => {
  const ctx = useContext(FermentationContext)
  if (!ctx) throw new Error('useFermentation debe usarse dentro de <FermentationProvider>')
  return ctx
}