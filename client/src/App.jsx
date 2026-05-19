import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingActionButton from './components/FloatingActionButton'
import LoadingScreen from './components/LoadingScreen'
import { ProtectedRoute, RoleBasedRoute } from './components/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Mechanics = lazy(() => import('./pages/Mechanics'))
const AboutContact = lazy(() => import('./pages/AboutContact'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'))
const MechanicDashboard = lazy(() => import('./pages/GarageDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const BookingFlow = lazy(() => import('./pages/BookingFlow'))
const AIChatAssistant = lazy(() => import('./pages/AIChatAssistant'))
const MechanicProfile = lazy(() => import('./pages/MechanicProfile'))

const PAGE_VARIANTS = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

function PageWrapper({ children }) {
  return (
    <motion.div variants={PAGE_VARIANTS} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function PageLoader() {
  return (
    <div className="min-h-screen bg-deep-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-text-muted text-sm font-body">Loading...</p>
      </div>
    </div>
  )
}

const HIDE_LAYOUT = ['/login', '/register', '/dashboard', '/ai-assistant']

const DashboardRedirect = () => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return <Navigate to={`/dashboard/${user.role}`} replace />
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const hideLayout = HIDE_LAYOUT.some(path => location.pathname.startsWith(path))

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-deep-black text-white font-body">
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <>
          {!hideLayout && <Navbar />}

          <ErrorBoundary>
            <Suspense fallback={<PageLoader />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                  <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
                  <Route path="/mechanics" element={<PageWrapper><Mechanics /></PageWrapper>} />
                  <Route path="/about" element={<PageWrapper><AboutContact /></PageWrapper>} />
                  <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                  <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                  
                  <Route path="/dashboard" element={<DashboardRedirect />} />
                  <Route 
                    path="/dashboard/customer/*" 
                    element={
                      <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={['customer']}>
                          <PageWrapper><CustomerDashboard /></PageWrapper>
                        </RoleBasedRoute>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/dashboard/mechanic/*" 
                    element={
                      <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={['mechanic']}>
                          <PageWrapper><MechanicDashboard /></PageWrapper>
                        </RoleBasedRoute>
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/dashboard/admin/*" 
                    element={
                      <ProtectedRoute>
                        <RoleBasedRoute allowedRoles={['admin']}>
                          <PageWrapper><AdminDashboard /></PageWrapper>
                        </RoleBasedRoute>
                      </ProtectedRoute>
                    } 
                  />

                  <Route path="/booking" element={<ProtectedRoute><PageWrapper><BookingFlow /></PageWrapper></ProtectedRoute>} />
                  <Route path="/contact" element={<PageWrapper><AboutContact /></PageWrapper>} />
                  <Route path="/ai-assistant" element={<PageWrapper><AIChatAssistant /></PageWrapper>} />
                  <Route path="/mechanic/:id" element={<PageWrapper><MechanicProfile /></PageWrapper>} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </ErrorBoundary>

          {!hideLayout && <Footer />}
          {!hideLayout && <FloatingActionButton />}
        </>
      )}
    </div>
  )
}
