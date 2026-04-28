import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingActionButton from './components/FloatingActionButton'
import LoadingScreen from './components/LoadingScreen'

const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Mechanics = lazy(() => import('./pages/Mechanics'))
const About = lazy(() => import('./pages/About'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard'))
const MechanicDashboard = lazy(() => import('./pages/GarageDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const BookingFlow = lazy(() => import('./pages/BookingFlow'))
const AIChatAssistant = lazy(() => import('./pages/AIChatAssistant'))

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

          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
                <Route path="/mechanics" element={<PageWrapper><Mechanics /></PageWrapper>} />
                <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                
                <Route path="/dashboard/customer" element={<PageWrapper><CustomerDashboard /></PageWrapper>} />
                <Route path="/dashboard/mechanic" element={<PageWrapper><MechanicDashboard /></PageWrapper>} />
                <Route path="/dashboard/admin" element={<PageWrapper><AdminDashboard /></PageWrapper>} />

                <Route path="/booking" element={<PageWrapper><BookingFlow /></PageWrapper>} />
                <Route path="/ai-assistant" element={<PageWrapper><AIChatAssistant /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </Suspense>

          {!hideLayout && <Footer />}
          {!hideLayout && <FloatingActionButton />}
        </>
      )}
    </div>
  )
}
