import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FaCar, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowRight, FaWrench, FaUserShield, FaClock, FaTimes, FaGoogle, FaTwitter, FaFacebookF } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [role, setRole] = useState('customer')
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const { login, isLoading } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const [rejectionData, setRejectionData] = useState(null)
  const [showPendingSide, setShowPendingSide] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 15,
      y: (clientY / innerHeight - 0.5) * 15,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return addToast('Please fill all fields', 'error')
    
    const result = await login(form.email, form.password)
    
    if (result.success) {
      const { user } = result
      if (user.role === 'mechanic') {
        if (user.status === 'pending') {
          setShowPendingSide(true)
          setTimeout(() => setShowPendingSide(false), 5000)
          return
        }
        if (user.status === 'rejected') {
          setRejectionData(user)
          return
        }
      }
      addToast('Logged in successfully!', 'success')
      const targetPath = user.role === 'admin' ? '/dashboard/admin' : user.role === 'mechanic' ? '/dashboard/mechanic' : '/dashboard/customer'
      navigate(targetPath)
    } else {
      addToast(result.message || 'Login failed', 'error')
    }
  }

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-deep-black flex relative overflow-hidden font-body"
    >
      {/* LEFT SIDE: Immersive Background & Branding */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden items-center px-20">
        <motion.div 
          animate={{ x: mousePos.x, y: mousePos.y, scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 40, damping: 25 }}
          style={{
            position: 'absolute', inset: -40,
            backgroundImage: 'url(/images/auth-split-bg.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-black/90 via-deep-black/40 to-transparent z-[1]" />
        
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 mb-12 group">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
              <FaCar className="text-deep-black text-sm" />
            </div>
            <span className="text-xl font-heading font-bold text-white tracking-tight">Auto<span className="text-gold">Mend</span></span>
          </Link>
          
          <motion.h1 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="text-6xl font-heading font-black text-white leading-tight mb-6 italic"
          >
            Welcome <br /> <span className="text-gold">Back</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-muted text-lg leading-relaxed max-w-sm font-medium mb-20"
          >
            Access your premium automotive dashboard and manage your fleet with precision.
          </motion.p>

          <div className="absolute bottom-8 left-20 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                <FaWrench className="text-gold text-sm" />
             </div>
             <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/50">Presented by AutoMend Elite</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Minimal Form */}
      <div className="flex-1 bg-deep-black relative flex items-center justify-center lg:justify-start lg:pl-20 px-6">
        {/* Mobile Back to Home Option */}
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
              <FaCar className="text-deep-black text-sm" />
            </div>
            <span className="text-sm font-heading font-bold text-white tracking-tight">
              Auto<span className="text-gold">Mend</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md flex">
          {/* Main Form Content */}
          <div className="flex-1">
            <div className="mb-12">
              <h2 className="text-3xl font-heading font-bold text-white mb-2">Sign in</h2>
              <p className="text-text-muted text-sm font-medium">Select your role to proceed</p>
            </div>

            {/* Role Switcher (Underlined Style) */}
            <div className="flex gap-8 mb-10 border-b border-white/5">
              {['customer', 'mechanic', 'admin'].map(r => (
                <button 
                  key={r} 
                  onClick={() => setRole(r)}
                  className={`pb-3 text-xs font-black uppercase tracking-widest transition-all relative ${role === r ? 'text-gold' : 'text-text-muted hover:text-white'}`}
                >
                  {r}
                  {role === r && <motion.div layoutId="activeRole" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-gold" />}
                </button>
              ))}
            </div>

            <form className="space-y-10" onSubmit={handleSubmit}>
              <div className="relative group">
                <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1 transition-colors group-focus-within:text-gold">Your Email</label>
                <input 
                  type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} 
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white font-medium focus:outline-none focus:border-gold transition-all"
                  placeholder="name@luxury.com"
                />
              </div>

              <div className="relative group">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted transition-colors group-focus-within:text-gold">Password</label>
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-text-muted hover:text-gold text-xs">
                    {showPwd ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <input 
                  type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} 
                  className="w-full bg-transparent border-b border-white/10 py-2 text-white font-medium focus:outline-none focus:border-gold transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit" disabled={isLoading}
                  className="w-full py-4 bg-gold hover:bg-light-gold text-deep-black font-black uppercase tracking-[0.2em] text-xs rounded-lg transition-all shadow-[0_10px_30px_rgba(217,137,106,0.3)] disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Sign in'}
                </button>
                
                <div className="mt-8 flex items-center justify-between">
                  <p className="text-xs text-text-muted">Already a Member? <Link to="/register" className="text-gold font-bold ml-1">Register</Link></p>
                  <a href="#" className="text-[10px] uppercase font-black text-text-muted hover:text-white tracking-widest transition-colors">Forgot Pwd?</a>
                </div>
              </div>
            </form>
          </div>

          {/* Social Icons Bar (Matching Reference) — Increased spacing to fix overlap */}
          <div className="hidden sm:flex flex-col items-center gap-10 ml-24 pt-24 border-l border-white/5 pl-16 relative">
            <span className="absolute top-10 left-[-11px] bg-deep-black px-2 text-[10px] font-black text-text-muted">OR</span>
            {[
               { icon: FaFacebookF, color: '#1877F2' },
               { icon: FaTwitter, color: '#1DA1F2' },
               { icon: FaGoogle, color: '#EA4335' }
            ].map((s, i) => (
              <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all">
                <s.icon className="text-sm" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rejection/Pending Overlays (Same logic) */}
      <AnimatePresence>
        {showPendingSide && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
            className="fixed top-24 right-8 z-[100] w-80 bg-card/90 backdrop-blur-xl border border-gold/30 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold animate-pulse"><FaClock /></div>
              <div>
                <h4 className="text-sm font-black text-white uppercase tracking-widest italic">Pending Review</h4>
                <p className="text-[10px] text-text-muted mt-2 leading-relaxed">Administrator is currently verifying your mechanic credentials.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectionData && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setRejectionData(null)} className="absolute inset-0 bg-deep-black/95 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-md bg-card rounded-[2.5rem] border border-red-500/20 p-10">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-3xl text-red-500 mb-6 mx-auto"><FaTimes /></div>
              <h3 className="text-2xl font-heading font-black text-white italic uppercase text-center mb-8">Declined</h3>
              <div className="bg-soft-dark/50 border border-white/5 rounded-2xl p-5 mb-8 text-center italic text-sm text-text-gray">"{rejectionData.rejectionReason || 'Verification failed.'}"</div>
              <button onClick={() => setRejectionData(null)} className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase text-white tracking-widest transition-all">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}


