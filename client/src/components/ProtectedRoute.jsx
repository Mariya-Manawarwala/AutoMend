import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-deep-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) return null 

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  // Block access to dashboard if mechanic is not approved
  if (user.role === 'mechanic' && user.status !== 'approved') {
    return <Navigate to="/" replace />
  }

  return children
}
