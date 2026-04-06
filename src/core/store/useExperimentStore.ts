import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ExperimentStore {
  experimentId: string | null
  individualId: string | null
  setExperimentId: (id: string) => void
  setIndividualId: (id: string) => void
}

export const useExperimentStore = create<ExperimentStore>()(
  persist(
    (set) => ({
      experimentId: null,
      individualId: null,
      setExperimentId: (id) => set({ experimentId: id }),
      setIndividualId: (id) => set({ individualId: id }),
    }),
    {
      name: 'fermest-store',
    }
  )
)