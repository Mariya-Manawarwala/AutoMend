import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FaCar, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowRight, FaWrench } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [role, setRole] = useState('customer')
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })
  const { login } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) return addToast('Please fill all fields', 'error')
    
    const result = await login(form.email, form.password)
    
    if (result.success) {
      addToast('Logged in successfully!', 'success')
      const targetPath = `/dashboard/${result.user.role}`
      navigate(targetPath)
    } else {
      addToast(result.message || 'Login failed', 'error')
    }
  }

  return (
    <main className="min-h-screen bg-deep-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-deep-black to-deep-black pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-warm-brown/20 blur-[150px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-light-gold flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all"><FaCar className="text-deep-black text-lg" /></div>
          <span className="text-2xl font-heading font-bold text-white">Auto<span className="text-gold">Mend</span></span>
        </Link>
        <h2 className="text-3xl font-heading font-bold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-text-muted">Please sign in to your account</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-card/80 backdrop-blur-xl py-8 px-4 shadow-2xl border border-white/5 sm:rounded-2xl sm:px-10 relative">
          
          <div className="flex p-1 bg-soft-dark rounded-xl mb-8 border border-white/5">
            {[ { id: 'customer', label: 'Customer', icon: FaUser }, { id: 'mechanic', label: 'Mechanic', icon: FaWrench } ].map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === r.id ? 'bg-gradient-to-r from-gold to-light-gold text-deep-black shadow-lg' : 'text-text-muted hover:text-white'}`}>
                <r.icon className={role === r.id ? 'text-deep-black' : ''} /> <span className="hidden sm:inline">{r.label}</span>
              </button>
            ))}
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Email address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="block w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-text-muted" placeholder="Enter your email" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-text-light">Password</label>
                <a href="#" className="text-xs font-medium text-gold hover:text-light-gold">Forgot password?</a>
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="block w-full pl-11 pr-12 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-text-muted" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-[0_0_15px_rgba(200,155,60,0.2)] text-sm font-bold text-deep-black bg-gradient-to-r from-gold to-light-gold hover:shadow-[0_0_25px_rgba(200,155,60,0.4)] transition-all">
              Sign In <FaArrowRight />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">Don't have an account? <Link to="/register" className="font-bold text-gold hover:text-light-gold transition-colors">Register now</Link></p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
