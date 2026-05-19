import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FaTools, FaOilCan, FaCar, FaCogs, FaWrench, FaSearch, FaArrowRight } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { SERVICES as MOCK_SERVICES } from '../data/constants'
import { getAllServices } from '../api/services.api'

const IMAGE_MAP = {
  'Engine': '/images/engine.png',
  'Oil': '/images/oil.png',
  'Wheel': '/images/wheel.png',
  'Brake': '/images/brake.png',
  'Digital': '/images/diagnostics.png',
  'default': '/images/engine.png'
}

const getServiceImage = (name) => {
  const n = name || ''
  if (n.includes('Engine')) return IMAGE_MAP['Engine']
  if (n.includes('Oil')) return IMAGE_MAP['Oil']
  if (n.includes('Wheel') || n.includes('Tire')) return IMAGE_MAP['Wheel']
  if (n.includes('Brake')) return IMAGE_MAP['Brake']
  if (n.includes('Scan') || n.includes('Digital') || n.includes('Diagnostic')) return IMAGE_MAP['Digital']
  return IMAGE_MAP['default']
}

const getServiceIcon = (name) => {
  const n = name || ''
  if (n.includes('Engine')) return FaCogs
  if (n.includes('Oil')) return FaOilCan
  if (n.includes('Wheel') || n.includes('Tire')) return FaCar
  if (n.includes('Brake')) return FaWrench
  if (n.includes('Scan') || n.includes('Digital') || n.includes('Diagnostic')) return FaSearch
  return FaTools
}

function Section({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className={className}>
      {children}
    </motion.section>
  )
}

export default function Services() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices()
        setServices(data && data.length > 0 ? data : MOCK_SERVICES)
      } catch (err) {
        setServices(MOCK_SERVICES)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-warm-brown/20 to-deep-black" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-gold text-xs font-semibold font-body uppercase tracking-[0.2em] mb-3 block">Our Services</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold text-white mb-6">Premium <span className="text-gold">Automotive Services</span></h1>
            <p className="text-text-muted text-lg font-body max-w-2xl mx-auto">Comprehensive vehicle care delivered by certified professionals with guaranteed satisfaction.</p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <Section className="py-20 bg-soft-dark relative">
        <div className="absolute inset-0 bg-gradient-to-b from-warm-brown/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((svc, i) => {
              const name = svc.name || svc.title;
              const desc = svc.description || svc.desc;
              const image = svc.image || getServiceImage(name);
              const SvcIcon = svc.icon || getServiceIcon(name);

              return (
                <motion.div key={svc._id || svc.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -8 }}
                  className="group relative bg-card border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(200,155,60,0.15)] transition-all duration-500">
                  <div className="h-44 flex items-center justify-center relative bg-deep-navy">
                    <img src={image} alt={name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-40" />
                    <SvcIcon className="text-5xl text-gold/60 group-hover:text-gold group-hover:scale-110 transition-all duration-500 relative z-10" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-heading font-bold text-white mb-2 group-hover:text-gold transition-colors">{name}</h3>
                    <p className="text-text-muted text-sm font-body leading-relaxed mb-4">{desc}</p>
                    <Link to="/booking" className="inline-flex items-center gap-2 text-gold text-sm font-body font-medium hover:gap-3 transition-all">
                      Book Now <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold to-light-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="py-20 bg-deep-black relative">
        <div className="absolute inset-0"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[200px]" /></div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-4">Need a Custom Service?</h2>
          <p className="text-text-muted font-body mb-8">Contact us for specialized automotive services tailored to your needs.</p>
          <Link to="/booking" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-gold to-light-gold text-deep-black font-heading font-bold text-sm rounded-2xl hover:shadow-[0_0_30px_rgba(200,155,60,0.5)] hover:scale-105 active:scale-95 transition-all">
            Get Started <FaArrowRight />
          </Link>
        </div>
      </Section>
    </main>
  )
}
