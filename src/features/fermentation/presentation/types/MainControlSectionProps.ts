import type { FermentationSession } from '../../domain/models/Fermentation'
import type { FermentationFormData } from './FermentationFormData'

export type MainControlSectionProps = {
  isRunning:   boolean
  loading:     boolean
  showForm:    boolean
  session:     FermentationSession | null
  circuitId:   number | null          // viene del usuario autenticado
  onMainToggle: () => void
  onSubmit:    (data: FermentationFormData) => void
  onCancelForm: () => void
}