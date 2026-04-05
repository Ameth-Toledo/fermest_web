import { useState, useEffect } from 'react'
import type { Simulation } from '../../domain/models/Simulation'
import { ExperimentRepositoryImpl } from '../../data/repositories/ExperimentRepositoryImpl'

const repository = new ExperimentRepositoryImpl()

export const useSimulationViewModel = (individualId: string) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [simulation, setSimulation] = useState<Simulation | null>(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await repository.getSimulation(individualId)
        setSimulation(data)
      } catch {
        setError('Error al cargar la simulación')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [individualId])

  return { loading, error, simulation }
}