export interface Individual {
  id: string
  rpm: number
  temperature: number
  flow: number
  fitness: number
  ethanol: number
  biomass: number
  substrate: number
  efficiency: number
  energy: number
}

export interface Generation {
  generation: number
  best_fitness: number
  individuals: Individual[]
}

export interface Experiment {
  id: string
  ph: number
  temperature: number
  sugar: number
}

export interface ExperimentResult {
  experiment: Experiment
  generations: Generation[]
}