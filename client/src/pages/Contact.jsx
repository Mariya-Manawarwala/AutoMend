import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa'
import { useToast } from '../context/ToastContext'

export default function Contact() {
  const { addToast } = useToast()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
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
        <svg width="100%" height="100%" viewBox="0 0 100 1000" preserveAspectRatio="none" style={{ opacity: 0.07 }}>
          <defs>
            <linearGradient id="contactZigGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-text-main)" />
              <stop offset="30%" stopColor="var(--color-primary)" />
              <stop offset="60%" stopColor="var(--color-text-main)" />
              <stop offset="90%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
          <path 
            d="M-50,0 L150,200 L-50,400 L150,600 L-50,800 L150,1000 L250,1000 L50,800 L250,600 L50,400 L250,200 L50,0 Z" 
            fill="url(#contactZigGrad)"
            stroke="rgba(217,137,106,0.1)"
            strokeWidth="0.05"
          />
        </svg>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-deep-black/60 via-deep-black/80 to-deep-black" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-heading font-black italic uppercase tracking-tight mb-4"
          >
            Contact <span className="text-gold">Us</span>
          </motion.h1>
          <div className="flex items-center justify-center gap-3 text-sm font-bold text-text-muted uppercase tracking-widest">
            <span>Home</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold" />
            <span className="text-white">Contact</span>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM SECTION ── */}
      <section className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Info Side */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-gold font-black uppercase tracking-[0.2em] text-xs mb-4 block">Our Contact</span>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white italic uppercase mb-8 leading-tight">
              Get In <span className="text-gold">Touch</span>
            </h2>
            <p className="text-text-muted leading-relaxed mb-12 max-w-lg">
              Have a question about our services or need urgent roadside assistance? Our team is available 24/7 to ensure your vehicle gets the care it deserves.
            </p>

            <div className="space-y-8">
              {[
                { icon: FaMapMarkerAlt, label: 'Our Office', val: 'Vijay Nagar, Indore, MP 452010' },
                { icon: FaEnvelope, label: 'Email Address', val: 'support@automend.com' },
                { icon: FaPhone, label: 'Phone Number', val: '+91 731-456-7890' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-soft-dark border border-white/5 flex items-center justify-center text-gold text-xl group-hover:scale-110 group-hover:border-gold/30 transition-all shadow-lg">
                    <item.icon />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-lg font-bold text-white group-hover:text-gold transition-colors">{item.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full bg-soft-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold/50 focus:bg-soft-dark transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                    placeholder="example@mail.com"
                    className="w-full bg-soft-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold/50 focus:bg-soft-dark transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Subject</label>
                <input 
                  required type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}
                  placeholder="How can we help?"
                  className="w-full bg-soft-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-gold/50 focus:bg-soft-dark transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                  placeholder="Tell us more about your requirement..."
                  className="w-full bg-soft-dark/50 border border-white/10 rounded-2xl px-6 py-5 text-sm text-white focus:outline-none focus:border-gold/50 focus:bg-soft-dark transition-all resize-none"
                />
              </div>
              
              <button 
                disabled={loading}
                className="w-full py-5 bg-gold hover:bg-light-gold text-deep-black rounded-2xl font-heading font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(200,155,60,0.4)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── SOCIAL FOLLOW SECTION ── */}
      <section className="relative z-10 py-20 bg-soft-dark/30 border-y border-white/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Get Connected</span>
          <h3 className="text-3xl md:text-4xl font-heading font-black text-white italic uppercase mb-10">Follow Our Social Media</h3>
          <div className="flex items-center justify-center gap-6">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a key={i} href="#" className="w-14 h-14 rounded-2xl bg-card border border-white/10 flex items-center justify-center text-white text-lg hover:bg-gold hover:text-deep-black hover:border-gold hover:shadow-[0_0_20px_rgba(200,155,60,0.3)] transition-all transform hover:-translate-y-2">
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAP SECTION ── */}
      <section className="relative h-[500px] w-full overflow-hidden grayscale contrast-125 opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117763.67493630654!2d75.79380965!3d22.723911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcad1b449735%3A0x119cffdf5d2a6327!2sIndore%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1715424732000!5m2!1sen!2sin" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy" 
          referrerPolicy="no-referrer-when-downgrade"
          title="AutoMend Indore Office"
        />
        {/* Map Overlay to prevent scroll interference */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      </section>
    </main>
  )
}
