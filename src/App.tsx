import AppRouter from './core/navigation/AppRouter'
import { AlertProvider } from './shared/context/AlertContext'

const App = () => {
  return (
    <AlertProvider>
      <AppRouter />
    </AlertProvider>
  )
}

export default App