import { Navigate, Outlet } from 'react-router-dom'
import { userAuth } from '../hooks/userAuth'

interface PrivateRouteProps {
  allowedRoles?: string[]
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const { user } = userAuth()

  if (!user) return <Navigate to="/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/overview" replace />
  }

  return <Outlet />
}

export default PrivateRoute
