import type { FermentationFormData } from '../viewmodels/useFermentationViewModel'

export interface ScheduleFormProps {
  onSubmit: (data: FermentationFormData) => void
  onCancel: () => void
  loading: boolean
}
