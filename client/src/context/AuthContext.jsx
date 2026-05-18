import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { loginUser, registerUser, getMyProfile } from '../api/auth.api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [isLoading, setIsLoading] = useState(!!localStorage.getItem('token'))

  // Token persistence: restore session on refresh
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const profile = await getMyProfile()
          setUser(profile)
          localStorage.setItem('user', JSON.stringify(profile))
        } catch (error) {
          console.error('Session restoration failed:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          setUser(null)
        }
      }
      setIsLoading(false)
    }

    restoreSession()
  }, [])

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    try {
      const data = await loginUser({ email, password })
      setUser(data.user || data) // Backend format varies
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user || data))
      return { success: true, user: data.user || data }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const register = useCallback(async (userData) => {
    setIsLoading(true)
    try {
      const data = await registerUser(userData)
      setUser(data.user || data)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user || data))
      return { success: true, user: data.user || data }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
