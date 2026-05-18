import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCar, FaSignOutAlt, FaSun, FaMoon
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({
  menuItems, activeTab, setActiveTab, children,
  headerTitle, headerSub, userAvatar, userName, userRole
}) {
  const { logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isDark, setIsDark] = useState(false) // Default: light mode

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  const avatarIsUrl = typeof userAvatar === 'string' && userAvatar.startsWith('http')
  const avatarChar  = userName?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div style={{
      height: '100vh', display: 'flex', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      background: 'var(--color-bg)',
    }}>

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <motion.aside
        initial={false}
        animate={{ width: 80 }}
        style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 30, overflowX: 'hidden' }}
      >
        {/* Pill Rail */}
        <div style={{
          position: 'relative', height: '98vh', width: '64px',
          display: 'flex', flexDirection: 'column',
          margin: 'auto', marginLeft: '8px', marginRight: 0,
          borderRadius: '2.5rem',
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          boxShadow: '0 2px 16px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.07)',
          transition: 'all 0.3s',
        }}>

          {/* Subtle top tint */}
          <div style={{ position: 'absolute', inset: 0, borderRadius: '2.5rem', background: 'linear-gradient(180deg, rgba(217,137,106,0.04) 0%, transparent 40%)', pointerEvents: 'none' }} />

          {/* Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.25rem', position: 'relative', zIndex: 10 }}>
            <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '10px',
                background: 'var(--color-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(217,137,106,0.35)',
                transition: 'transform 0.2s',
              }}>
                <FaCar style={{ color: '#fff', fontSize: '0.85rem' }} />
              </div>
            </Link>
          </div>

          {/* Nav Items */}
          <nav style={{ flex: 1, padding: '0.5rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem', overflowY: 'auto', position: 'relative', zIndex: 10 }}>
            {menuItems.map((item) => {
              const isActive = activeTab === item.key
              return (
                <div key={item.key} style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }} className="group">
                  <button
                    onClick={() => setActiveTab(item.key)}
                    title={item.label}
                    style={{
                      position: 'relative',
                      width: 38, height: 38,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '10px',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      background: isActive ? 'var(--color-primary)' : 'transparent',
                      color: isActive ? '#fff' : '#4A5568',
                      boxShadow: isActive ? '0 4px 12px rgba(217,137,106,0.3)' : 'none',
                    }}
                    onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(0,0,0,0.07)'; e.currentTarget.style.color = '#16181D' }}}
                    onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A5568' }}}
                  >
                    <item.icon style={{ fontSize: '0.85rem' }} />
                    {/* Active dot */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebar-active"
                        style={{
                          position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)',
                          width: 4, height: 20, borderRadius: '4px 0 0 4px',
                          background: 'var(--color-primary)',
                        }}
                      />
                    )}
                  </button>

                  {/* Tooltip on hover */}
                  <div style={{
                    position: 'fixed', left: 88,
                    pointerEvents: 'none',
                    opacity: 0, transition: 'all 0.2s',
                    zIndex: 100,
                  }} className="group-hover:opacity-100 group-hover:translate-x-0 translate-x-2">
                    <div style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: '10px',
                      background: 'var(--color-dark-graphite)',
                      color: '#fff',
                      fontSize: '0.65rem', fontWeight: 700,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                    }}>
                      {item.label}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>

          {/* Footer: Theme + Logout */}
          <div style={{
            padding: '0.75rem 0.5rem',
            borderTop: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            position: 'relative', zIndex: 10,
          }}>
            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'Switch to Light' : 'Switch to Dark'}
              style={{
                width: 36, height: 36, borderRadius: '10px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.05)',
                color: 'var(--color-accent)',
                transition: 'all 0.2s',
              }}
            >
              {isDark ? <FaSun style={{ fontSize: '0.75rem' }} /> : <FaMoon style={{ fontSize: '0.75rem' }} />}
            </button>

            {/* Logout */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              title="Logout"
              style={{
                width: 36, height: 36, borderRadius: '10px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(239,68,68,0.08)',
                color: '#EF4444',
                transition: 'all 0.2s',
              }}
            >
              <FaSignOutAlt style={{ fontSize: '0.75rem' }} />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* ── MAIN AREA ── */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>

        {/* Floating user pill — top right */}
        <div style={{ position: 'absolute', top: 28, right: 28, zIndex: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0.45rem 0.85rem',
            borderRadius: '12px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-card)',
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-dark-graphite)', textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1 }}>{userName}</p>
              <p style={{ fontSize: '0.55rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 2 }}>{userRole}</p>
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: '8px',
              border: '1.5px solid var(--color-border)',
              background: 'rgba(217,137,106,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 800,
              color: 'var(--color-primary)',
              overflow: 'hidden',
            }}>
              {avatarIsUrl ? <img src={userAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" /> : avatarChar}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)' }} className="custom-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ padding: '1.5rem', paddingTop: '6rem', minHeight: '100%' }}
          >
            {children}
          </motion.div>
        </div>

        {/* ── LOGOUT MODAL ── */}
        <AnimatePresence>
          {showLogoutConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}
            >
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(22,24,29,0.4)', backdropFilter: 'blur(6px)' }} onClick={() => setShowLogoutConfirm(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                style={{
                  position: 'relative', width: '100%', maxWidth: 400,
                  padding: '2.5rem',
                  borderRadius: '2rem',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  textAlign: 'center',
                }}
              >
                <div style={{ position: 'absolute', top: 0, right: 0, width: 96, height: 96, background: 'rgba(217,137,106,0.06)', borderBottomLeftRadius: '100%', pointerEvents: 'none' }} />
                <div style={{ width: 56, height: 56, borderRadius: '14px', background: 'rgba(217,137,106,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', color: 'var(--color-primary)', fontSize: '1.25rem' }}>
                  <FaSignOutAlt />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-dark-graphite)', margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>Sign out?</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
                  Are you sure you want to end your session and sign out of AutoMend?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={logout}
                    style={{ flex: 1, padding: '0.85rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.2s' }}
                  >Sign Out</button>
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{ flex: 1, padding: '0.85rem', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.2s' }}
                  >Stay</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

