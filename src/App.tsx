import { Toaster } from 'sileo'
import AppRouter from './core/navigation/AppRouter'

const App = () => {
  return (
    <>
      <Toaster position="top-center" />
      <AppRouter />
    </>
  )
}

export default App