import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaCar, FaSignOutAlt, FaBell } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

export default function DashboardLayout({ menuItems, activeTab, setActiveTab, children, headerTitle, headerSub, userAvatar, userName, userRole }) {
  const { logout } = useAuth()

  return (
    <div className="h-screen bg-deep-black font-body flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-soft-dark border-r border-white/5 hidden md:flex flex-col h-screen shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold/10 to-transparent rounded-bl-full pointer-events-none" />

        {/* Logo - links to home */}
        <Link to="/" className="flex items-center gap-2 p-6 border-b border-white/5 relative z-10 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold to-light-gold flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
            <FaCar className="text-deep-black text-sm" />
          </div>
          <span className="text-xl font-heading font-bold text-white">Auto<span className="text-gold">Mend</span></span>
        </Link>

        {/* User Profile Mini */}
        <div className="px-6 py-8 border-b border-white/5 flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-full bg-card border-2 border-gold/30 flex items-center justify-center font-heading font-bold text-gold shadow-[0_0_15px_rgba(200,155,60,0.2)] shrink-0">
            {userAvatar || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-heading font-bold text-white truncate">{userName || 'User'}</p>
            <p className="text-xs text-text-muted capitalize">{userRole || 'Customer'}</p>
          </div>
        </div>

        <nav className="flex-1 p-5 space-y-3 overflow-y-auto custom-scrollbar relative z-10">
          {menuItems.map(item => {
            const isActive = activeTab === item.key
            return (
              <button key={item.key} onClick={() => setActiveTab(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group hover:translate-x-1 ${
                  isActive ? 'text-gold bg-gold/10 shadow-[0_0_10px_rgba(200,155,60,0.2)]' : 'text-text-muted hover:bg-white/5 hover:text-white'
                }`}>
                {isActive && <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-light-gold shadow-[0_0_10px_rgba(200,155,60,0.8)]" />}
                <item.icon className="text-lg transition-transform group-hover:scale-110" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30">{item.badge}</span>}
              </button>
            )
          })}
        </nav>
        
        {/* Fade effect at bottom of sidebar */}
        <div className="absolute bottom-16 left-0 right-0 h-10 bg-gradient-to-t from-soft-dark to-transparent pointer-events-none z-10" />

        <div className="p-5 border-t border-white/5 relative z-10">
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:translate-x-1 transition-all duration-300">
            <FaSignOutAlt className="text-lg" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />
        
        {/* Topbar */}
        <header className="h-20 bg-deep-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 shrink-0 z-20">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">{headerTitle || menuItems.find(i => i.key === activeTab)?.label}</h1>
            {headerSub && <p className="text-sm text-text-muted mt-1">{headerSub}</p>}
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-text-muted hover:text-white transition-colors hover:scale-110">
              <FaBell className="text-xl" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-deep-black" />
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="h-full">
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
