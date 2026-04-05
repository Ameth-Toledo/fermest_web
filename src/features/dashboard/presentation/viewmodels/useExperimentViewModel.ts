import { useState, useEffect } from 'react'
import type { ExperimentResult } from '../../domain/models/Experiment'
import type { BestPerGenerationResult } from '../../domain/models/BestPerGeneration'
import { ExperimentRepositoryImpl } from '../../data/repositories/ExperimentRepositoryImpl'

const repository = new ExperimentRepositoryImpl()

export const useExperimentViewModel = (experimentId: string) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [experiment, setExperiment] = useState<ExperimentResult | null>(null)
  const [bestPerGeneration, setBestPerGeneration] = useState<BestPerGenerationResult | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [exp, best] = await Promise.all([
          repository.getExperiment(experimentId),
          repository.getBestPerGeneration(experimentId),
        ])
        setExperiment(exp)
        setBestPerGeneration(best)
      } catch {
        setError('Error al cargar el experimento')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [experimentId])

  return { loading, error, experiment, bestPerGeneration }
}