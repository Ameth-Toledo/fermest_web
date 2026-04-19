import type { FermentationFormData } from './FermentationFormData'

export interface ScheduleFormProps {
  onSubmit: (data: FermentationFormData) => void
  onCancel: () => void
  loading: boolean
}
