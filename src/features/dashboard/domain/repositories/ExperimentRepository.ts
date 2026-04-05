import type { RunExperimentRequest, RunExperimentResponse } from '../models/RunExperiment'
import type { ExperimentResult } from '../models/Experiment'
import type { Simulation } from '../models/Simulation'
import type { BestPerGenerationResult } from '../models/BestPerGeneration'

export interface ExperimentRepository {
  runExperiment(data: RunExperimentRequest): Promise<RunExperimentResponse>
  getExperiment(experimentId: string): Promise<ExperimentResult>
  getSimulation(individualId: string): Promise<Simulation>
  getBestPerGeneration(experimentId: string): Promise<BestPerGenerationResult>
}