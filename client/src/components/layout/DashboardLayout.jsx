import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCar, FaSignOutAlt, FaSun, FaMoon, FaBars, FaTimes
} from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({
  menuItems, activeTab, setActiveTab, children,
  headerTitle, headerSub, userAvatar, userName, userRole
}) {
  const { logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('light', !isDark)
  }, [isDark])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const avatarIsUrl = typeof userAvatar === 'string' && userAvatar.startsWith('http')
  const avatarChar  = userName?.charAt(0)?.toUpperCase() || 'U'

  // Show only first 5 items in bottom nav (for mobile real estate)
  const bottomNavItems = menuItems.slice(0, 5)

  const SidebarContent = ({ onItemClick }) => (
    <>
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0.25rem', position: 'relative', zIndex: 10 }}>
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none' }}>
          <div style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(217,137,106,0.35)',
            transition: 'transform 0.2s', flexShrink: 0,
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
                onClick={() => { setActiveTab(item.key); onItemClick?.() }}
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
                  {item.badge && (
                    <span style={{ marginLeft: 6, background: 'var(--color-primary)', color: '#fff', borderRadius: '999px', padding: '0 5px', fontSize: '0.6rem' }}>
                      {item.badge}
                    </span>
                  )}
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
    </>
  )

  return (
    <div style={{
      height: '100vh', display: 'flex', overflow: 'hidden',
      fontFamily: 'var(--font-body)',
      background: 'var(--color-bg)',
    }}>

      {/* ══════════════════ DESKTOP SIDEBAR ══════════════════ */}
      <motion.aside
        className="dashboard-sidebar"
        initial={false}
        animate={{ width: 80 }}
        style={{ position: 'relative', height: '100vh', flexDirection: 'column', flexShrink: 0, zIndex: 30, overflowX: 'hidden' }}
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
          <div style={{ position: 'absolute', inset: 0, borderRadius: '2.5rem', background: 'linear-gradient(180deg, rgba(217,137,106,0.04) 0%, transparent 40%)', pointerEvents: 'none' }} />
          <SidebarContent />
        </div>
      </motion.aside>

      {/* ══════════════════ MOBILE DRAWER ══════════════════ */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mobile-drawer-overlay"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 38 }}
              style={{
                position: 'fixed', left: 0, top: 0, bottom: 0,
                width: 'min(80vw, 280px)',
                background: 'var(--color-surface)',
                borderRight: '1px solid var(--color-border)',
                boxShadow: '4px 0 32px rgba(0,0,0,0.15)',
                zIndex: 210,
                overflowY: 'auto',
                display: 'flex', flexDirection: 'column',
                paddingTop: 'calc(1rem + env(safe-area-inset-top))',
                paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
              }}
            >
              {/* Drawer close button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1rem 0.5rem' }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FaCar style={{ color: '#fff', fontSize: '0.7rem' }} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-dark-graphite)', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                    AutoMend
                  </span>
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{ width: 32, height: 32, borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)', minWidth: 'unset', minHeight: 'unset' }}
                >
                  <FaTimes style={{ fontSize: '0.8rem' }} />
                </button>
              </div>

              {/* User info in drawer */}
              <div style={{ padding: '1rem', margin: '0.5rem', borderRadius: '12px', background: 'rgba(217,137,106,0.06)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(217,137,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)', flexShrink: 0 }}>
                    {avatarIsUrl ? <img src={userAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} alt="" /> : avatarChar}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-dark-graphite)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{userName}</p>
                    <p style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{userRole}</p>
                  </div>
                </div>
              </div>

              {/* Drawer nav items */}
              <nav style={{ flex: 1, padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {menuItems.map((item) => {
                  const isActive = activeTab === item.key
                  return (
                    <button
                      key={item.key}
                      onClick={() => { setActiveTab(item.key); setDrawerOpen(false) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                        padding: '0.7rem 0.9rem',
                        borderRadius: '10px', border: 'none',
                        cursor: 'pointer', width: '100%', textAlign: 'left',
                        background: isActive ? 'var(--color-primary)' : 'transparent',
                        color: isActive ? '#fff' : 'var(--color-text-muted)',
                        fontWeight: 600, fontSize: '0.8rem',
                        letterSpacing: '0.05em', textTransform: 'uppercase',
                        transition: 'all 0.2s',
                        minHeight: 'unset',
                      }}
                    >
                      <item.icon style={{ fontSize: '0.85rem', flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>
                      {item.badge && (
                        <span style={{ marginLeft: 'auto', background: isActive ? 'rgba(255,255,255,0.3)' : 'var(--color-primary)', color: '#fff', borderRadius: '999px', padding: '0 6px', fontSize: '0.6rem', fontWeight: 700 }}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  )
                })}
              </nav>

              {/* Drawer footer */}
              <div style={{ padding: '0.75rem', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setIsDark(!isDark)}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer', color: 'var(--color-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'unset' }}
                >
                  {isDark ? <FaSun style={{ fontSize: '0.75rem' }} /> : <FaMoon style={{ fontSize: '0.75rem' }} />}
                </button>
                <button
                  onClick={() => { setDrawerOpen(false); setShowLogoutConfirm(true) }}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.06)', cursor: 'pointer', color: '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'unset' }}
                >
                  <FaSignOutAlt style={{ fontSize: '0.75rem' }} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════ MAIN AREA ══════════════════ */}
      <main className="dashboard-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative', minWidth: 0 }}>

        {/* Mobile top bar (hamburger + user) */}
        <div className="show-mobile" style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40,
          height: 56, background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingInline: '1rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}>
          <button
            onClick={() => setDrawerOpen(true)}
            style={{ width: 36, height: 36, borderRadius: '10px', border: '1px solid var(--color-border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-dark-graphite)', minWidth: 'unset', minHeight: 'unset' }}
          >
            <FaBars style={{ fontSize: '0.85rem' }} />
          </button>
          <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--color-dark-graphite)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {headerTitle}
          </span>
          <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'rgba(217,137,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}>
            {avatarIsUrl ? <img src={userAvatar} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} alt="" /> : avatarChar}
          </div>
        </div>

        {/* Floating user pill — top right (desktop) */}
        <div className="hide-mobile" style={{ position: 'absolute', top: 28, right: 28, zIndex: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
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

        {/* Content area */}
        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--color-bg)' }} className="custom-scrollbar">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{
              padding: 'clamp(1rem, 3vw, 1.5rem)',
              paddingTop: 'clamp(4rem, 8vw, 6rem)',
              minHeight: '100%',
            }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* ══════════════════ MOBILE BOTTOM NAV ══════════════════ */}
      <div className="mobile-bottom-nav">
        {bottomNavItems.map((item) => {
          const isActive = activeTab === item.key
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`mobile-bottom-nav-item${isActive ? ' active' : ''}`}
            >
              <item.icon />
              <span style={{ lineHeight: 1 }}>{item.label.split(' ')[0]}</span>
              {item.badge && (
                <span style={{ position: 'absolute', top: 6, right: '50%', transform: 'translateX(100%)', background: 'var(--color-primary)', color: '#fff', borderRadius: '999px', padding: '0 4px', fontSize: '0.5rem', fontWeight: 700 }}>
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
        {/* "More" button for items beyond 5 */}
        {menuItems.length > 5 && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="mobile-bottom-nav-item"
          >
            <FaBars />
            <span>More</span>
          </button>
        )}
      </div>

      {/* ══════════════════ LOGOUT MODAL ══════════════════ */}
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
                padding: 'clamp(1.5rem, 5vw, 2.5rem)',
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
              <h3 style={{ fontSize: 'clamp(1rem, 3vw, 1.15rem)', fontWeight: 800, color: 'var(--color-dark-graphite)', margin: '0 0 0.5rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.01em' }}>Sign out?</h3>
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
    </div>
  )
}
