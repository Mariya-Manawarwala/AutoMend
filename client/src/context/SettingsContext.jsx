import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const SettingsContext = createContext(null)

const DEFAULT_SETTINGS = {
  garageName: 'AutoMend Premium Auto Care',
  email: 'admin@automend.com',
  phone: '+1 800-123-4567',
  address: '123 Luxury Drive, Automotive District, Metro City',
  operatingHours: '08:00 AM - 08:00 PM',
  taxRate: '18',
  currency: 'INR (₹)'
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      const base = '/api'
      const { data } = await axios.get(`${base}/admin/dashboard/settings/public`)
      if (data) {
        setSettings({
          garageName: data.garageName || DEFAULT_SETTINGS.garageName,
          email: data.email || DEFAULT_SETTINGS.email,
          phone: data.phone || DEFAULT_SETTINGS.phone,
          address: data.address || DEFAULT_SETTINGS.address,
          operatingHours: data.operatingHours || DEFAULT_SETTINGS.operatingHours,
          taxRate: data.taxRate || DEFAULT_SETTINGS.taxRate,
          currency: data.currency || DEFAULT_SETTINGS.currency
        })
      }
    } catch (err) {
      console.warn('Failed to fetch global settings, using fallback default settings:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return ctx
}
