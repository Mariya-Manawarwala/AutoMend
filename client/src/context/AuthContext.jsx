import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email, password) => {
    setIsLoading(true)
    // Mock login logic
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { email, role: 'customer', name: 'John Doe' }
        setUser(mockUser)
        setIsLoading(false)
        resolve({ success: true, user: mockUser })
      }, 1000)
    })
  }, [])

  const register = useCallback(async (userData) => {
    setIsLoading(true)
    // Mock register logic
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser = { ...userData, role: userData.role || 'customer' }
        setUser(mockUser)
        setIsLoading(false)
        resolve({ success: true, user: mockUser })
      }, 1000)
    })
  }, [])

  const logout = useCallback(async () => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
