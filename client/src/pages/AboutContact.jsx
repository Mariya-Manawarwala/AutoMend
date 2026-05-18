import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaPaperPlane, FaShieldAlt, FaUsers, FaCogs, FaTrophy, FaCheckCircle, FaStar 
} from 'react-icons/fa'
import { useToast } from '../context/ToastContext'
import { useSettings } from '../context/SettingsContext'
import { STATS } from '../data/constants'

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section 
      ref={ref} 
      initial={{ opacity: 0, y: 40 }} 
      animate={inView ? { opacity: 1, y: 0 } : {}} 
      transition={{ duration: 0.7 }} 
      className={className}
    >
      {children}
    </motion.section>
  )
}

const VALUES = [
  { icon: FaShieldAlt, title: 'Trust & Safety', desc: 'Every mechanic is verified, insured, and certified to provide the highest quality service.' },
  { icon: FaUsers, title: 'Customer First', desc: 'We put our customers at the heart of everything we do with 24/7 support.' },
  { icon: FaCogs, title: 'Innovation', desc: 'Leveraging cutting-edge technology for seamless booking and tracking experiences.' },
  { icon: FaTrophy, title: 'Excellence', desc: 'We maintain the highest standards across all our services and team members.' },
]

export default function AboutContact() {
  const { addToast } = useToast()
  const { settings } = useSettings()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      addToast('Message sent successfully! We will get back to you soon.', 'success')
      setForm({ name: '', email: '', subject: '', message: '' })
      setLoading(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen bg-deep-black text-white relative overflow-hidden">
      {/* ── Global Zig-Zag Background ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 1000" preserveAspectRatio="none" style={{ opacity: 0.05 }}>
          <path 
            d="M-50,0 L150,200 L-50,400 L150,600 L-50,800 L150,1000 L250,1000 L50,800 L250,600 L50,400 L250,200 L50,0 Z" 
            fill="url(#combinedZigGrad)"
            stroke="rgba(217,137,106,0.1)"
            strokeWidth="0.05"
          />
          <defs>
            <linearGradient id="combinedZigGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-text-main)" />
              <stop offset="50%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-text-main)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* ── HERO SECTION (ABOUT) ── */}
      <section className="relative h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-warm-brown/10 to-deep-black z-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10 text-center px-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block mt-8"
          >
            AutoMend Experience
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading font-black italic uppercase tracking-tight mb-6"
          >
            Our Story & <span className="text-gold">Contact</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-text-muted text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Revolutionizing automotive care with technology, transparency, and a commitment to excellence. We're here to help you move forward.
          </motion.p>
        </div>
      </section>

      {/* ── ABOUT SECTION ── */}
      <Section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Who We Are</span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white italic uppercase mb-8 leading-tight">
                Redefining the Way You <span className="text-gold">Service Your Vehicle</span>
              </h2>
              <p className="text-text-muted leading-relaxed mb-6">
                {settings.garageName} was founded with a simple mission: make quality automotive services accessible, transparent, and convenient for everyone. We connect vehicle owners with top-tier certified mechanics through a seamless digital experience.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Verified Mechanics', 'Transparent Pricing', 'Real-Time Tracking', '24/7 Assistance'].map(item => (
                  <div key={item} className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 rounded-2xl">
                    <FaCheckCircle className="text-gold text-lg shrink-0" />
                    <span className="text-white text-xs font-black uppercase tracking-widest">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-soft-dark border border-white/5 rounded-[3rem] p-12 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 rounded-bl-full group-hover:w-48 group-hover:h-48 transition-all duration-700" />
                <div className="relative z-10 text-center">
                  <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-gold to-light-gold flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(200,155,60,0.3)]">
                    <FaShieldAlt className="text-4xl text-deep-black" />
                  </div>
                  <h3 className="text-3xl font-heading font-black text-white italic mb-2 uppercase">Since 2020</h3>
                  <p className="text-text-muted text-xs font-black uppercase tracking-[0.2em]">Engineering Excellence</p>
                </div>
              </div>
              <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -bottom-8 -right-8 bg-card/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <FaStar className="text-gold text-2xl" />
                  <div>
                    <p className="text-2xl font-black text-white italic">50K+</p>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Jobs Completed</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* ── VALUES SECTION ── */}
      <Section className="py-24 bg-soft-dark/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center mb-16">
          <span className="text-gold text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Our Philosophy</span>
          <h2 className="text-4xl font-heading font-black text-white italic uppercase">Core Values</h2>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {VALUES.map((v, i) => (
            <motion.div key={v.title} whileHover={{ y: -10 }} className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-10 text-center group transition-all">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold group-hover:text-deep-black transition-all">
                <v.icon className="text-2xl text-gold group-hover:text-deep-black" />
              </div>
              <h3 className="text-lg font-heading font-black text-white italic uppercase mb-4">{v.title}</h3>
              <p className="text-text-muted text-xs leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── CONTACT SECTION ── */}
      <Section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            
            {/* Info Side */}
            <div>
              <span className="text-gold font-black uppercase tracking-[0.2em] text-[10px] mb-4 block">Direct Support</span>
              <h2 className="text-4xl md:text-5xl font-heading font-black text-white italic uppercase mb-8">
                Let's <span className="text-gold">Connect</span>
              </h2>
              <p className="text-text-muted leading-relaxed mb-12">
                Questions about a booking or interested in joining our network of mechanics? Our team is available 24/7 to provide the support you need.
              </p>

              <div className="space-y-6">
                {[
                  { icon: FaMapMarkerAlt, label: 'Headquarters', val: settings.address },
                  { icon: FaEnvelope, label: 'Official Support', val: settings.email },
                  { icon: FaPhone, label: 'Priority Line', val: settings.phone },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group bg-white/5 p-6 rounded-3xl border border-white/5 hover:border-gold/30 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-deep-black flex items-center justify-center text-gold text-lg group-hover:scale-110 transition-transform">
                      <item.icon />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">{item.label}</p>
                      <p className="text-sm font-black text-white">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Side */}
            <div className="bg-card/40 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                      placeholder="Enter name"
                      className="w-full bg-soft-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-gold/50 focus:bg-soft-dark transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">Email</label>
                    <input 
                      required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                      placeholder="Email address"
                      className="w-full bg-soft-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-gold/50 focus:bg-soft-dark transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-text-muted uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    placeholder="Describe your inquiry..."
                    className="w-full bg-soft-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-xs text-white focus:outline-none focus:border-gold/50 focus:bg-soft-dark transition-all resize-none"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-5 bg-gold hover:bg-light-gold text-deep-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(200,155,60,0.4)] disabled:opacity-50"
                >
                  {loading ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      </Section>

      {/* ── MAP ── */}
      <section className="relative h-[450px] grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117763.67493630654!2d75.79380965!3d22.723911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b449735%3A0x119cffdf5d2a6327!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1715424732000!5m2!1sen!2sin" 
          width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade" title="Indore Office"
        />
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      </section>
    </main>
  )
}
