import type { FermentationSession } from '../../domain/models/Fermentation'
import type { FermentationFormData } from '../viewmodels/useFermentationViewModel'

export type MainControlSectionProps = {
  isRunning: boolean
  loading: boolean
  showForm: boolean
  session: FermentationSession | null
  onMainToggle: () => void
  onSubmit: (data: FermentationFormData) => void
  onCancelForm: () => void
}
