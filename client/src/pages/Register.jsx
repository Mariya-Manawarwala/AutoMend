import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { 
  FaCar, FaUser, FaLock, FaEnvelope, FaPhone, FaWrench, 
  FaUserShield, FaArrowRight, FaArrowLeft, FaCheckCircle, 
  FaIdBadge, FaTools, FaMapMarkerAlt, FaGoogle, FaTwitter, FaFacebookF 
} from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const ROLES = [
  { id: 'customer', label: 'Customer', icon: FaUser, desc: 'I want to maintain my vehicle' },
  { id: 'mechanic', label: 'Mechanic', icon: FaWrench, desc: 'I want to offer repair services' }
]

export default function Register() {
  const [role, setRole] = useState('customer')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', password: '', 
    skills: '', experience: '', address: '', adminId: '', age: '',
    profilePhoto: null
  })

  const { register, isLoading } = useAuth()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 15,
      y: (clientY / innerHeight - 0.5) * 15,
    })
  }

  const handleNext = () => {
    if (step === 1 && (!form.name || !form.email || !form.phone || !form.age)) return addToast('Please fill all fields', 'error')
    setStep(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.password) return addToast('Password is required', 'error')
    
    if (role === 'mechanic' && !form.profilePhoto) {
      return addToast('Profile photo is mandatory for mechanics', 'error')
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('email', form.email)
    formData.append('phone', form.phone)
    formData.append('password', form.password)
    formData.append('role', role)
    formData.append('age', form.age)
    if (form.address) formData.append('address', form.address)
    
    if (role === 'mechanic') {
      const skillsArray = form.skills.split(',').map(s => s.trim())
      formData.append('skills', JSON.stringify(skillsArray))
      formData.append('experience', form.experience)
      if (form.adminId) formData.append('adminId', form.adminId)
      if (form.profilePhoto) formData.append('profilePhoto', form.profilePhoto)
    }

    const result = await register(formData)
    if (result.success) {
      addToast('Registration successful!', 'success')
      navigate(`/dashboard/${role}`)
    } else {
      addToast(result.message || 'Registration failed', 'error')
    }
  }

  // Helper for image preview
  const [photoPreview, setPhotoPreview] = useState(null)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, profilePhoto: file })
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  return (
    <main 
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-deep-black flex relative overflow-hidden font-body"
    >
      {/* ... rest of the code remains similar ... */}
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
            Join the <br /> <span className="text-gold">Elite</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-text-muted text-lg leading-relaxed max-w-sm font-medium"
          >
            Experience the future of automotive care with precision tools and master technicians.
          </motion.p>
        </div>
      </div>

      {/* RIGHT SIDE: Multi-step Form */}
      <div className="flex-1 bg-deep-black relative flex items-center justify-center lg:justify-start lg:pl-20 px-6 overflow-y-auto py-12">
        <div className="w-full max-w-lg flex">
          {/* Main Form Content */}
          <div className="flex-1">
            <div className="mb-10">
              <h2 className="text-3xl font-heading font-bold text-white mb-2">Create Account</h2>
              <div className="flex gap-2 mt-4">
                {[1, 2].map(s => (
                  <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-gold' : 'w-4 bg-white/10'}`} />
                ))}
              </div>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-4">I am a...</label>
                      <div className="grid grid-cols-2 gap-4">
                        {ROLES.map(r => (
                          <button key={r.id} type="button" onClick={() => setRole(r.id)} className={`relative flex flex-col p-4 rounded-xl border transition-all text-left group ${role === r.id ? 'bg-gold/10 border-gold shadow-[0_0_20px_rgba(200,155,60,0.15)]' : 'bg-soft-dark/50 border-white/5 hover:border-white/10'}`}>
                            <r.icon className={`text-xl mb-3 transition-colors ${role === r.id ? 'text-gold' : 'text-text-muted group-hover:text-white'}`} />
                            <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${role === r.id ? 'text-white' : 'text-text-muted'}`}>{r.label}</p>
                            {role === r.id && <div className="absolute top-3 right-3 text-gold text-xs"><FaCheckCircle /></div>}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Full Name</label>
                        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" placeholder="John Doe" />
                      </div>
                      <div className="relative group">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Phone</label>
                        <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" placeholder="+91..." />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="relative group">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Age</label>
                        <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" placeholder="25" />
                      </div>
                      <div className="relative group">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Email</label>
                        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" placeholder="john@example.com" />
                      </div>
                    </div>

                    <button type="button" onClick={handleNext} className="w-full py-4 bg-gold text-deep-black rounded-lg font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_10px_30px_rgba(217,137,106,0.3)] transition-all flex items-center justify-center gap-2">
                      Next Step <FaArrowRight />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    {role === 'mechanic' ? (
                      <div className="space-y-8">
                        {/* Profile Photo Upload */}
                        <div className="flex flex-col items-center justify-center p-6 bg-soft-dark/50 border-2 border-dashed border-white/10 rounded-2xl group hover:border-gold/30 transition-all">
                          <label className="cursor-pointer flex flex-col items-center">
                            {photoPreview ? (
                              <div className="relative">
                                <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-gold" />
                                <div className="absolute inset-0 bg-deep-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <FaTools className="text-white text-xl" />
                                </div>
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-gold transition-colors">
                                <FaUser className="text-3xl" />
                              </div>
                            )}
                            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                            <p className="mt-4 text-[10px] font-black text-text-muted uppercase tracking-widest group-hover:text-white">
                              {photoPreview ? 'Change Profile Photo' : 'Upload Profile Photo'} <span className="text-red-500">*</span>
                            </p>
                          </label>
                        </div>

                        <div className="relative group">
                          <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Skills (Engine, Brakes...)</label>
                          <input value={form.skills} onChange={e => setForm({...form, skills: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div className="relative group">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Experience (Years)</label>
                            <input type="number" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" />
                          </div>
                          <div className="relative group">
                            <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Admin ID (Opt)</label>
                            <input value={form.adminId} onChange={e => setForm({...form, adminId: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group">
                        <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Home Address</label>
                        <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" />
                      </div>
                    )}

                    <div className="relative group">
                      <label className="block text-[10px] uppercase tracking-widest font-black text-text-muted mb-1">Password</label>
                      <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-2 text-white text-sm focus:outline-none focus:border-gold transition-all" placeholder="••••••••" />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 border border-white/10 text-white rounded-lg font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <FaArrowLeft /> Back
                      </button>
                      <button type="submit" disabled={isLoading} className="flex-[2] py-4 bg-gold text-deep-black rounded-lg font-black uppercase tracking-[0.2em] text-xs hover:shadow-[0_10px_30px_rgba(217,137,106,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                        {isLoading ? 'Creating...' : <><FaCheckCircle /> Register</>}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-text-muted">Member? <Link to="/login" className="text-gold font-bold ml-1">Sign In</Link></p>
              <div className="flex gap-4 sm:hidden">
                 <FaFacebookF className="text-text-muted text-sm" />
                 <FaTwitter className="text-text-muted text-sm" />
                 <FaGoogle className="text-text-muted text-sm" />
              </div>
            </div>
          </div>

          {/* Social Icons Bar */}
          <div className="hidden sm:flex flex-col items-center gap-10 ml-16 pt-24 border-l border-white/5 pl-10 relative">
            <span className="absolute top-10 left-[-11px] bg-deep-black px-2 text-[10px] font-black text-text-muted">OR</span>
            {[FaFacebookF, FaTwitter, FaGoogle].map((Icon, i) => (
              <button key={i} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-gold hover:text-gold transition-all">
                <Icon className="text-sm" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
