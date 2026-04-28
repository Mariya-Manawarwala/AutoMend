import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-deep-black text-gold font-bold">Loading...</div>

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-deep-black text-gold font-bold">Loading...</div>

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
