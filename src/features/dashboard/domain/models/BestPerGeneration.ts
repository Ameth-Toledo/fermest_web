import type { Individual } from './Experiment'

export interface BestGeneration {
  generation: number
  best_fitness: number
  worst_fitness: number
  avg_fitness: number
  best_individual: Individual
}

export interface BestPerGenerationResult {
  experiment_id: string
  generations: BestGeneration[]
}