import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../../shared/layout/Layout'
import DashboardView from '../../features/dashboard/presentation/view/DashboardView'
import ExperimentView from '../../features/dashboard/presentation/view/ExperimentView'
import BestPerGenerationView from '../../features/dashboard/presentation/view/BestPerGenerationView'
import SimulationView from '../../features/dashboard/presentation/view/SimulationView'
import ChartsView from '../../features/dashboard/presentation/view/ChartsView'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardView />} />
          <Route path="/experiment/:id" element={<ExperimentView />} />
          <Route path="/experiment/:id/best-per-generation" element={<BestPerGenerationView />} />
          <Route path="/simulation/:id" element={<SimulationView />} />
          <Route path="/experiment/:id/charts" element={<ChartsView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter