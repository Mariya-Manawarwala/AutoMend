import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaWrench } from 'react-icons/fa'
import { IoSunny, IoMoon } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'

const NAV_LINKS = [
  { path: '/services', label: 'Services' },
  { path: '/mechanics', label: 'Mechanics' },
  { path: '/booking', label: 'Booking' },
  { path: '/about', label: 'About' },
  { path: '/ai-assistant', label: 'AI' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { settings } = useSettings()

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setMenuOpen(false) }, [location])

  const dashboardPath = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'mechanic' ? '/dashboard/mechanic' : '/dashboard/customer'

  const navBg = isHome && !scrolled ? 'rgba(255,255,255,0.45)' : 'var(--color-surface)'
  const textColor = 'var(--color-text-main)'
  const mutedColor = 'var(--color-text-muted)'
  const borderColor = 'var(--color-border)'
  const accentColor = 'var(--color-accent)'
  const brandColor = 'var(--color-primary)'

  return (
    <motion.nav
      initial={{ y: -100, x: '-50%' }} animate={{ y: 0, x: '-50%' }} transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      style={{
        position: 'fixed', top: '1.5rem', left: '50%', zIndex: 100,
        background: navBg,
        backdropFilter: 'blur(20px)',
        border: `1px solid var(--color-border)`,
        borderRadius: '999px',
        transition: 'all 0.4s ease',
        boxShadow: '0 12px 48px rgba(0,0,0,0.5)',
        width: 'fit-content',
        padding: '0 1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', height: '64px', padding: '0 1.5rem' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaWrench style={{ color: 'var(--color-bg)', fontSize: '0.8rem' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1rem', color: textColor, letterSpacing: '-0.02em', textTransform: 'uppercase' }} className="hide-mobile">
            {settings.garageName.split(' ')[0]}<span style={{ color: accentColor }}>{settings.garageName.split(' ').slice(1).join(' ') || 'Mend'}</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="hide-mobile">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.6rem 1.2rem',
                fontSize: '0.75rem',
                fontWeight: 800,
                color: location.pathname === link.path ? 'var(--color-text-main)' : mutedColor,
                textDecoration: 'none',
                transition: 'all 0.3s',
                position: 'relative',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.span layoutId="nav-glow"
                  style={{ 
                    position: 'absolute', top: '-2px', left: '50%', transform: 'translateX(-50%)', 
                    width: '40px', height: '3px', background: 'var(--color-accent)', borderRadius: '0 0 4px 4px',
                    boxShadow: '0 0 15px var(--color-accent), 0 0 8px var(--color-accent)',
                    display: 'block' 
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth & Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }} className="hide-mobile">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link to={dashboardPath} style={{ padding: '0.4rem 1.2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-bg)', background: brandColor, borderRadius: '999px', textDecoration: 'none', textTransform: 'uppercase' }}>
                Portal
              </Link>
              <button onClick={logout} style={{ padding: '0.4rem 1.2rem', fontSize: '0.75rem', fontWeight: 800, background: 'transparent', border: '1px solid var(--color-accent)', color: 'var(--color-accent)', borderRadius: '999px', cursor: 'pointer', textTransform: 'uppercase' }}>
                Exit
              </button>
            </div>
          ) : (
            <Link to="/login" style={{ padding: '0.4rem 1.2rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-bg)', background: brandColor, borderRadius: '999px', textDecoration: 'none', textTransform: 'uppercase' }}>
              SIGNIN
            </Link>
          )}

          <button
            onClick={toggleTheme}
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: accentColor }}
          >
            {theme === 'dark' ? <IoSunny /> : <IoMoon />}
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: 'var(--color-text-main)', cursor: 'pointer' }} className="show-mobile">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu (Integrated into pill on open) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            style={{ padding: '0.5rem 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} style={{ color: 'var(--color-text-main)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', padding: '0.5rem 0' }}>{link.label}</Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
