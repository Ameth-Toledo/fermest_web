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
  ethanol: number
  biomass: number
  efficiency: number
  energy: number
}

export interface RunExperimentResponse {
  experiment_id: string
  best_individual: BestIndividual
  history: number[]
  history_worst: number[]
  history_avg: number[]
}