import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaCar } from 'react-icons/fa'
import { IoSunny, IoMoon } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const NAV_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/services', label: 'Services' },
  { path: '/mechanics', label: 'Mechanics' },
  { path: '/about', label: 'About' },
  { path: '/ai-assistant', label: 'AI Assistant' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setMenuOpen(false) }, [location])

  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'garage' ? '/garage-dashboard' : '/dashboard'

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled ? 'bg-deep-black/80 backdrop-blur-xl shadow-lg border-b border-white/10' : 'bg-transparent'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-light-gold flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-shadow">
              <FaCar className="text-deep-black text-lg" />
            </div>
            <span className="text-xl font-heading font-bold text-white">Auto<span className="text-gold">Mend</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path}
                className={`relative px-4 py-2 text-sm font-medium font-body transition-colors rounded-lg ${
                  location.pathname === link.path ? 'text-gold' : 'text-text-muted hover:text-white'
                }`}>
                {link.label}
                {location.pathname === link.path && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gold rounded-full shadow-[0_0_8px_rgba(200,155,60,0.8)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to={dashboardPath} className="px-4 py-2 text-sm font-medium font-body text-gold border border-gold/30 rounded-xl hover:bg-gold/10 transition-all">Dashboard</Link>
                <button onClick={logout} className="px-5 py-2.5 text-sm font-semibold font-body text-deep-black bg-gradient-to-r from-gold to-light-gold rounded-xl hover:shadow-[0_0_20px_rgba(200,155,60,0.3)] transition-all">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium font-body text-text-muted hover:text-white transition-colors">Login</Link>
                <Link to="/register" className="px-5 py-2.5 text-sm font-semibold font-body text-deep-black bg-gradient-to-r from-gold to-light-gold rounded-xl hover:shadow-[0_0_20px_rgba(200,155,60,0.3)] transition-all">Register</Link>
              </>
            )}

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gold hover:bg-gold/10 transition-all ml-2"
              title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            >
              {theme === 'dark' ? <IoSunny className="text-lg" /> : <IoMoon className="text-lg" />}
            </button>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-10 h-10 flex items-center justify-center text-white rounded-lg hover:bg-white/5 transition-colors">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-deep-black/95 backdrop-blur-xl border-t border-white/10 overflow-hidden">
            <div className="px-4 py-6 flex flex-col gap-2">
              {NAV_LINKS.map(link => (
                <Link key={link.path} to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium font-body transition-all ${
                    location.pathname === link.path ? 'text-gold bg-gold/10' : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`}>{link.label}</Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <Link to={dashboardPath} className="px-4 py-3 rounded-xl text-sm font-medium font-body text-gold bg-gold/10">Dashboard</Link>
                    <button onClick={logout} className="px-4 py-3 rounded-xl text-sm font-semibold font-body text-deep-black bg-gradient-to-r from-gold to-light-gold">Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="px-4 py-3 rounded-xl text-sm font-body text-text-muted hover:text-white hover:bg-white/5">Login</Link>
                    <Link to="/register" className="px-4 py-3 rounded-xl text-sm font-semibold font-body text-deep-black bg-gradient-to-r from-gold to-light-gold text-center">Register</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
