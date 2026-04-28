import { motion } from 'framer-motion'
import { FaCar, FaWrench, FaShieldAlt, FaMapMarkerAlt, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { SERVICES, MECHANICS, STATS } from '../data/constants'

export default function Home() {
  return (
    <main className="font-body">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-deep-black">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/10 via-deep-black to-deep-black pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-warm-brown/20 blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 text-gold text-sm font-semibold mb-6 tracking-wide uppercase border border-gold/20 shadow-[0_0_10px_rgba(200,155,60,0.2)]">Premium Auto Care</span>
              <h1 className="text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6">
                Expert Garage Services at Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold to-light-gold relative inline-block">Doorstep<motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.8, duration: 0.8 }} className="absolute -bottom-2 left-0 h-2 bg-gradient-to-r from-gold to-transparent rounded-full opacity-50" /></span>
              </h1>
              <p className="text-lg text-text-muted mb-10 max-w-lg leading-relaxed">Book certified mechanics instantly. Transparent pricing, genuine parts, and world-class service—wherever you are.</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/booking" className="px-8 py-4 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_25px_rgba(200,155,60,0.4)] transition-all flex items-center gap-2 hover:-translate-y-1">Book Service Now <FaArrowRight /></Link>
                <Link to="/services" className="px-8 py-4 bg-soft-dark border border-white/10 text-white rounded-xl font-medium hover:bg-white/5 transition-all flex items-center gap-2">Explore Services</Link>
              </div>

              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {['AK', 'PS', 'RV'].map((a, i) => (
                    <div key={i} className="w-12 h-12 rounded-full bg-card border-2 border-deep-black flex items-center justify-center text-xs font-bold text-gold shadow-lg z-[3-i] relative">{a}</div>
                  ))}
                </div>
                <div><div className="flex items-center gap-1 text-gold mb-1">{[...Array(5)].map((_, i) => <FaStar key={i} />)}</div><p className="text-sm text-text-muted"><strong className="text-white">4.9/5</strong> from 15,000+ reviews</p></div>
              </div>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-gold/20 to-transparent rounded-[3rem] blur-2xl transform rotate-3" />
              <div className="relative bg-card border border-white/10 rounded-[3rem] p-8 shadow-2xl overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-bl-full transition-transform duration-700 group-hover:scale-110" />
                <img src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80" alt="Luxury Car Service" className="rounded-2xl shadow-xl w-full object-cover h-[500px] border border-white/5 relative z-10" />
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} className="absolute -left-8 top-1/4 bg-soft-dark/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl z-20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400"><FaCheckCircle className="text-2xl" /></div>
                  <div><p className="text-white font-bold text-sm">Service Complete</p><p className="text-text-muted text-xs">Your car is ready</p></div>
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5, delay: 1 }} className="absolute -right-8 bottom-1/4 bg-soft-dark/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl z-20 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold"><FaStar className="text-2xl" /></div>
                  <div><p className="text-white font-bold text-sm">Top Rated</p><p className="text-text-muted text-xs">Expert Mechanics</p></div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-soft-dark relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-gold text-sm font-bold tracking-widest uppercase mb-3 block">What We Offer</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Our Premium Services</h2>
            <p className="text-text-muted">Comprehensive automotive care tailored to your vehicle's specific needs, delivered by industry experts.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service, idx) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-50px' }} transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-3xl p-8 border border-white/5 hover:border-gold/30 hover:shadow-[0_0_30px_rgba(200,155,60,0.15)] transition-all duration-300 group relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${service.gradient} rounded-bl-full -z-10 opacity-50 group-hover:scale-110 transition-transform`} />
                <div className="w-16 h-16 rounded-2xl bg-soft-dark border border-white/5 flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                  <service.icon className="text-3xl text-gold" />
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-3 group-hover:text-gold transition-colors">{service.title}</h3>
                <p className="text-text-muted mb-6 line-clamp-2">{service.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-white">{service.price}</span>
                  <Link to="/booking" className="w-10 h-10 rounded-full bg-soft-dark border border-white/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-deep-black transition-all">
                    <FaArrowRight />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mechanics Section */}
      <section className="py-24 bg-deep-black relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gold/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-gold text-sm font-bold tracking-widest uppercase mb-3 block">Expert Team</span>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Meet Our Master Mechanics</h2>
              <p className="text-text-muted">Certified professionals with years of experience working on luxury and premium vehicles.</p>
            </div>
            <Link to="/mechanics" className="px-6 py-3 border border-white/10 rounded-xl text-white font-semibold hover:bg-white/5 transition-colors whitespace-nowrap">View All Mechanics</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MECHANICS.map((mechanic, idx) => (
              <motion.div key={mechanic.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                className="bg-card rounded-3xl p-6 border border-white/5 group hover:border-white/10 transition-colors">
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-soft-dark to-deep-black border-2 border-gold/30 flex items-center justify-center text-2xl font-heading font-bold text-gold group-hover:border-gold transition-colors shadow-[0_0_15px_rgba(200,155,60,0.2)]">
                    {mechanic.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-white">{mechanic.name}</h3>
                    <p className="text-sm text-gold font-medium">{mechanic.specialty}</p>
                  </div>
                </div>
                <p className="text-text-muted text-sm mb-6 leading-relaxed">{mechanic.desc}</p>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2"><FaStar className="text-gold" /><span className="font-bold text-white">{mechanic.rating}</span><span className="text-xs text-text-muted">({mechanic.reviews} reviews)</span></div>
                  <span className="text-sm font-medium text-white bg-soft-dark px-3 py-1 rounded-full border border-white/10">{mechanic.experience}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
