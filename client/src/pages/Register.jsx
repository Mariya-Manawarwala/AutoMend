import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FaCar, FaUser, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowRight, FaWrench, FaPhone, FaTools, FaBriefcase, FaIdBadge, FaUpload } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Register() {
  const [role, setRole] = useState('customer')
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', adminId: '', experience: '' })
  const [skills, setSkills] = useState([])
  const [status, setStatus] = useState(null) // null | 'pending' | 'rejected'

  const { register } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()

  const handleSkillToggle = (skill) => {
    if (skills.includes(skill)) {
      setSkills(skills.filter(s => s !== skill))
    } else {
      setSkills([...skills, skill])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password || !form.phone) return addToast('Please fill all required fields', 'error')
    
    if (role === 'mechanic' && (!form.adminId || !form.experience || skills.length === 0)) {
      return addToast('Please fill all mechanic details', 'error')
    }

    const userData = { ...form, role, skills }
    const result = await register(userData)

    if (result.success) {
      addToast('Account created successfully!', 'success')
      if (role === 'mechanic') {
        setStatus('pending')
      } else {
        navigate('/dashboard/customer')
      }
    } else {
      addToast(result.message || 'Registration failed', 'error')
    }
  }

  // Pending UI
  if (status === 'pending') {
    return (
      <main className="min-h-screen bg-deep-black flex flex-col items-center justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body text-center">
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none" />
        
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 bg-card/80 backdrop-blur-xl p-10 border border-white/5 rounded-3xl shadow-2xl max-w-md w-full">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Account Under Review</h2>
          <p className="text-text-muted mb-8 text-sm">Our admin is verifying your details. You will be notified once approved.</p>
          <Link to="/login" className="inline-block w-full py-3 px-4 rounded-xl text-sm font-bold text-deep-black bg-gradient-to-r from-gold to-light-gold hover:shadow-[0_0_25px_rgba(200,155,60,0.4)] transition-all">
            Go to Login
          </Link>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-deep-black flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-body">
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-warm-brown/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-gold/5 blur-[150px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-light-gold flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all"><FaCar className="text-deep-black text-lg" /></div>
          <span className="text-2xl font-heading font-bold text-white">Auto<span className="text-gold">Mend</span></span>
        </Link>
        <h2 className="text-3xl font-heading font-bold text-white">Create an account</h2>
        <p className="mt-2 text-sm text-text-muted">Join thousands of users on AutoMend</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-card/80 backdrop-blur-xl py-8 px-4 shadow-2xl border border-white/5 sm:rounded-3xl sm:px-10">
          
          <div className="flex p-1 bg-soft-dark rounded-xl mb-8 border border-white/5">
            {[ { id: 'customer', label: 'Customer', icon: FaUser }, { id: 'mechanic', label: 'Mechanic', icon: FaWrench } ].map(r => (
              <button key={r.id} type="button" onClick={() => setRole(r.id)} className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${role === r.id ? 'bg-gradient-to-r from-gold to-light-gold text-deep-black shadow-lg' : 'text-text-muted hover:text-white'}`}>
                <r.icon className={role === r.id ? 'text-deep-black' : ''} /> {r.label}
              </button>
            ))}
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="block w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder:text-text-muted" placeholder="John Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Phone Number</label>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="block w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-text-muted" placeholder="+1 234 567 890" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Email address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="block w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-text-muted" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-light mb-2">Password</label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="block w-full pl-11 pr-12 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-text-muted" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white">
                  {showPwd ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {role === 'mechanic' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-5 overflow-hidden">
                  <div className="pt-4 border-t border-white/5">
                    <h3 className="text-sm font-bold text-gold uppercase tracking-widest mb-4">Professional Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-sm font-medium text-text-light mb-2">Admin / Garage ID</label>
                        <div className="relative">
                          <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input type="text" value={form.adminId} onChange={e => setForm({...form, adminId: e.target.value})} className="block w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-text-muted" placeholder="e.g. ADM-101" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-light mb-2">Experience (Years)</label>
                        <div className="relative">
                          <FaBriefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                          <input type="number" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="block w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all placeholder:text-text-muted" placeholder="e.g. 5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-light mb-2">Core Skills</label>
                      <div className="flex flex-wrap gap-2">
                        {['Engine Diagnostics', 'Electrical', 'Transmission', 'Brakes', 'Suspension', 'AC / Heating'].map(s => (
                          <button key={s} type="button" onClick={() => handleSkillToggle(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${skills.includes(s) ? 'bg-gold/10 text-gold border-gold/30' : 'bg-soft-dark text-text-muted border-white/5 hover:border-white/20'}`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-deep-black bg-gradient-to-r from-gold to-light-gold hover:shadow-[0_0_25px_rgba(200,155,60,0.4)] transition-all mt-6">
              {role === 'mechanic' ? 'Submit Application' : 'Create Account'} <FaArrowRight />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-muted">Already have an account? <Link to="/login" className="font-bold text-gold hover:text-light-gold transition-colors">Sign in here</Link></p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
