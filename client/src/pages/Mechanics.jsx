import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaStar, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { MECHANICS } from '../data/constants'

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className={className}>
      {children}
    </motion.section>
  )
}

export default function Mechanics() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-warm-brown/20 to-deep-black" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[180px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold text-xs font-semibold font-body uppercase tracking-[0.2em] mb-3 block">Our Team</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6">Meet Our <span className="text-gold">Expert Mechanics</span></h1>
            <p className="text-text-muted text-lg font-body max-w-2xl mx-auto">Handpicked, certified professionals with years of experience and thousands of satisfied customers.</p>
          </motion.div>
        </div>
      </section>

      {/* Mechanics Grid */}
      <Section className="py-20 bg-soft-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-warm-brown/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {MECHANICS.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -6 }}
                className="group bg-card border border-white/5 rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(200,155,60,0.15)] transition-all duration-500">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold/20 to-warm-brown/30 flex items-center justify-center border border-gold/20 shrink-0">
                    <span className="text-xl font-heading font-bold text-gold">{m.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold text-white group-hover:text-gold transition-colors">{m.name}</h3>
                    <p className="text-gold text-sm font-body font-medium">{m.specialty}</p>
                    <p className="text-text-muted text-xs font-body mt-1">{m.experience} Experience</p>
                  </div>
                </div>
                <p className="text-text-muted text-sm font-body leading-relaxed mb-6">{m.desc}</p>
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, j) => (
                      <FaStar key={j} className={`text-sm ${j < Math.floor(m.rating) ? 'text-gold' : 'text-card-hover'}`} />
                    ))}
                    <span className="text-white text-sm font-body font-semibold ml-1">{m.rating}</span>
                  </div>
                  <span className="text-text-muted text-xs font-body">{m.reviews} reviews</span>
                </div>
                <button className="w-full py-3.5 border border-gold/30 text-gold font-heading font-semibold text-sm rounded-xl hover:bg-gold/10 hover:border-gold/50 transition-all duration-300">
                  View Full Profile
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Join CTA */}
      <Section className="py-20 bg-deep-black relative">
        <div className="absolute inset-0"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-warm-brown/10 rounded-full blur-[200px]" /></div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">Are You a Mechanic?</h2>
          <p className="text-text-muted font-body mb-8">Join our network of certified professionals and grow your business.</p>
          <Link to="/register" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold to-light-gold text-deep-black font-heading font-bold text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(200,155,60,0.5)] hover:scale-105 active:scale-95 transition-all">
            Join AutoMend <FaArrowRight />
          </Link>
        </div>
      </Section>
    </main>
  )
}
