import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaShieldAlt, FaUsers, FaCogs, FaTrophy, FaArrowRight, FaStar, FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { STATS } from '../data/constants'

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className={className}>
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

export default function About() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-warm-brown/20 to-deep-black" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold text-xs font-semibold font-body uppercase tracking-[0.2em] mb-3 block">Our Story</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6">About <span className="text-gold">AutoMend</span></h1>
            <p className="text-text-muted text-lg font-body max-w-2xl mx-auto">Revolutionizing automotive care with technology, transparency, and trust.</p>
          </motion.div>
        </div>
      </section>

      {/* Who We Are - Split Layout */}
      <Section className="py-20 bg-soft-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-gold text-xs font-semibold font-body uppercase tracking-[0.2em] mb-3 block">Who We Are</span>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6 leading-tight">Redefining the Way You <span className="text-gold">Service Your Vehicle</span></h2>
              <p className="text-text-light text-base font-body leading-relaxed mb-5">AutoMend was founded with a simple mission: make quality automotive services accessible, transparent, and convenient for everyone. We connect vehicle owners with top-tier certified mechanics across the nation.</p>
              <p className="text-text-muted text-sm font-body leading-relaxed mb-8">Our platform eliminates the hassle of finding reliable mechanics by providing verified professionals, upfront pricing, and real-time service tracking — all from your smartphone.</p>
              <div className="space-y-3">
                {['Certified & Background-Verified Mechanics', 'Transparent, Upfront Pricing', 'Real-Time Service Tracking', 'Nationwide Coverage in 120+ Cities'].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <FaCheckCircle className="text-gold text-sm shrink-0" />
                    <span className="text-text-light text-sm font-body">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-card border border-white/5 rounded-3xl aspect-square relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-warm-brown/30 via-gold/10 to-deep-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-8">
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-gold to-light-gold flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(200,155,60,0.3)]">
                      <FaShieldAlt className="text-4xl text-deep-black" />
                    </div>
                    <p className="text-white font-heading font-bold text-2xl mb-2">Since 2020</p>
                    <p className="text-text-muted font-body text-sm">Serving Excellence</p>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute -bottom-4 -right-4 bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl">
                <div className="flex items-center gap-3"><FaStar className="text-gold text-xl" /><div><p className="text-white font-heading font-bold">50,000+</p><p className="text-text-muted text-xs font-body">Services Completed</p></div></div>
              </motion.div>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats */}
      <Section className="py-16 bg-deep-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border border-white/5 rounded-2xl p-8 text-center hover:shadow-[0_0_20px_rgba(200,155,60,0.1)] transition-all">
                <p className="text-3xl font-heading font-bold text-gold mb-2">{s.value}</p>
                <p className="text-text-muted text-sm font-body">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Our Values */}
      <Section className="py-20 bg-soft-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-warm-brown/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-gold text-xs font-semibold font-body uppercase tracking-[0.2em] mb-3 block">What Drives Us</span>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -6 }}
                className="group bg-card border border-white/5 rounded-2xl p-8 text-center hover:shadow-[0_0_25px_rgba(200,155,60,0.12)] transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-warm-brown/40 to-warm-brown-light/20 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="text-2xl text-gold" />
                </div>
                <h3 className="text-base font-heading font-bold text-white mb-3 group-hover:text-gold transition-colors">{v.title}</h3>
                <p className="text-text-muted text-sm font-body leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-20 bg-deep-black relative">
        <div className="absolute inset-0"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[200px]" /></div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-text-muted font-body mb-8">Experience premium automotive care with AutoMend.</p>
          <Link to="/booking" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold to-light-gold text-deep-black font-heading font-bold text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(200,155,60,0.5)] hover:scale-105 active:scale-95 transition-all">
            Book a Service <FaArrowRight />
          </Link>
        </div>
      </Section>
    </main>
  )
}
