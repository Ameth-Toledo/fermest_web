import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardView from '../../features/dashboard/presentation/view/DashboardView'
import ExperimentView from '../../features/dashboard/presentation/view/ExperimentView'
import SimulationView from '../../features/dashboard/presentation/view/SimulationView'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/experiment/:id" element={<ExperimentView />} />
        <Route path="/simulation/:id" element={<SimulationView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter