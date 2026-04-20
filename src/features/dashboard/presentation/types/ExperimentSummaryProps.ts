import type { RunExperimentRequest } from '../../domain/models/RunExperiment'

export type ExperimentSummaryProps = {
  form: RunExperimentRequest
  error: string | null
  onSubmit: () => void
}
