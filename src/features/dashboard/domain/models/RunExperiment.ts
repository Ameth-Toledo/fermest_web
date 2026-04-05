export interface RunExperimentRequest {
  ph: number
  temperature: number
  sugar: number
  microorganism: string
  micro_amount: number
}

export interface BestIndividual {
  rpm: number
  temperature: number
  flow: number
  fitness: number
}

export interface RunExperimentResponse {
  experiment_id: string
  best_individual: BestIndividual
  history: number[]
}