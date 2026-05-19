import { useState, useEffect, useRef } from 'react'
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
  const drawerRef = useRef(null)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const dashboardPath =
    user?.role === 'admin' ? '/dashboard/admin' :
    user?.role === 'mechanic' ? '/dashboard/mechanic' :
    '/dashboard/customer'

  const navBg = isHome && !scrolled ? 'var(--navbar-glass-bg)' : 'var(--color-surface)'
  const textColor = 'var(--color-text-main)'
  const mutedColor = 'var(--color-text-muted)'
  const accentColor = 'var(--color-accent)'
  const brandColor = 'var(--color-primary)'

  return (
    <>
      {/* ════════════ DESKTOP PILL NAVBAR ════════════ */}
      <motion.nav
        className="hide-mobile navbar-pill"
        initial={{ y: -100, x: '-50%' }}
        animate={{ y: 0, x: '-50%' }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
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
            <span style={{ fontWeight: 900, fontSize: '1rem', color: textColor, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
              {settings.garageName.split(' ')[0]}<span style={{ color: accentColor }}>{settings.garageName.split(' ').slice(1).join(' ') || 'Mend'}</span>
            </span>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {NAV_LINKS.map(link => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0.6rem 1.2rem', fontSize: '0.75rem', fontWeight: 800,
                  color: location.pathname === link.path ? 'var(--color-text-main)' : mutedColor,
                  textDecoration: 'none', transition: 'all 0.3s', position: 'relative',
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                }}
              >
                {link.label}
                {location.pathname === link.path && (
                  <motion.span layoutId="nav-glow"
                    style={{
                      position: 'absolute', top: '-2px', left: '50%', transform: 'translateX(-50%)',
                      width: '40px', height: '3px', background: 'var(--color-accent)',
                      borderRadius: '0 0 4px 4px',
                      boxShadow: '0 0 15px var(--color-accent), 0 0 8px var(--color-accent)',
                      display: 'block'
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth & Theme */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
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
        </div>
      </motion.nav>

      {/* ════════════ MOBILE TOP BAR ════════════ */}
      <div
        className="show-mobile"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          height: '60px',
          background: navBg,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          paddingInline: '1.25rem',
        }}
      >
        {/* Mobile Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FaWrench style={{ color: '#fff', fontSize: '0.7rem' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '0.95rem', color: textColor, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            {settings.garageName.split(' ')[0]}<span style={{ color: brandColor }}>{settings.garageName.split(' ').slice(1).join(' ') || 'Mend'}</span>
          </span>
        </Link>

        {/* Mobile right actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={toggleTheme}
            style={{ width: '36px', height: '36px', borderRadius: '50%', border: 'none', background: 'var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: accentColor }}
          >
            {theme === 'dark' ? <IoSunny /> : <IoMoon />}
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: textColor }}
            aria-label="Open menu"
          >
            <FaBars style={{ fontSize: '0.9rem' }} />
          </button>
        </div>
      </div>

      {/* ════════════ MOBILE FULL-SCREEN DRAWER ════════════ */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-drawer-overlay"
              onClick={() => setMenuOpen(false)}
            />

            {/* Slide-in drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 38 }}
              className="mobile-drawer"
            >
              {/* Drawer header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                <Link to="/" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: brandColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaWrench style={{ color: '#fff', fontSize: '0.8rem' }} />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '1rem', color: textColor, letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                    {settings.garageName.split(' ')[0]}<span style={{ color: brandColor }}>{settings.garageName.split(' ').slice(1).join(' ') || 'Mend'}</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: textColor }}
                  aria-label="Close menu"
                >
                  <FaTimes style={{ fontSize: '0.9rem' }} />
                </button>
              </div>

              {/* Nav links */}
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.85rem 1rem',
                      borderRadius: '12px',
                      textDecoration: 'none',
                      fontWeight: 700, fontSize: '0.95rem',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: location.pathname === link.path ? '#fff' : textColor,
                      background: location.pathname === link.path ? brandColor : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--color-border)', margin: '0.75rem 0' }} />

              {/* Auth buttons */}
              {user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '0.85rem 1rem', borderRadius: '12px', textDecoration: 'none',
                      fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: '#fff', background: brandColor,
                      marginBottom: '0.5rem',
                    }}
                  >
                    My Portal
                  </Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '100%', padding: '0.85rem 1rem', borderRadius: '12px',
                      border: '1px solid var(--color-accent)', background: 'transparent',
                      fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase',
                      letterSpacing: '0.08em', color: accentColor, cursor: 'pointer',
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '0.85rem 1rem', borderRadius: '12px', textDecoration: 'none',
                    fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: '#fff', background: brandColor,
                  }}
                >
                  Sign In
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
