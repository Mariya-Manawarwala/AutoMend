import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FaWrench, FaCar, FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaArrowRight, FaCheckCircle, FaTools, FaOilCan, FaCogs } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { SERVICES as MOCK_SERVICES, MECHANICS as MOCK_MECHANICS, STATS } from '../data/constants'
import { getAllServices } from '../api/services.api'
import { getPublicMechanics } from '../api/mechanics.api'

const SERVICE_TYPES = [
  { id: 'repair', label: 'Repair', icon: FaWrench },
  { id: 'inspection', label: 'Inspection', icon: FaTools },
]

const BRAND_LOGOS = [
  { name: 'BMW', symbol: 'BMW' },
  { name: 'Ford', symbol: 'Ford' },
  { name: 'Toyota', symbol: 'Toyota' },
  { name: 'Tesla', symbol: 'Tesla' },
  { name: 'Mercedes', symbol: 'Merc' },
  { name: 'Nissan', symbol: 'Nissan' },
  { name: 'Honda', symbol: 'Honda' },
  { name: 'KIA', symbol: 'KIA' },
]

// Fallback image mapping based on service names or categories
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

export default function Home() {
  const navigate = useNavigate()
  const [activeType, setActiveType] = useState('repair')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [mechanicsData, setMechanicsData] = useState(MOCK_MECHANICS)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getAllServices()
        if (data && Array.isArray(data)) {
          setServices(data.length > 0 ? data : MOCK_SERVICES)
        } else {
          setServices(MOCK_SERVICES)
        }
      } catch (err) {
        console.error('Failed to fetch services:', err)
        setServices(MOCK_SERVICES)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  // Fetch real mechanics from backend (fallback to mock)
  useEffect(() => {
    getPublicMechanics(3)
      .then(data => { if (data?.length > 0) setMechanicsData(data) })
      .catch(() => {}) // silently use mock on failure
  }, [])

  const nextService = () => {
    setActiveIndex(prev => (prev + 1) % services.length)
  }

  const prevService = () => {
    setActiveIndex(prev => (prev - 1 + services.length) % services.length)
  }
  const handleQuickSearch = () => {
    navigate('/booking', { 
      state: { 
        serviceType: activeType, 
        location: location, 
        date: startDate, 
        time: endDate 
      } 
    })
  }

  return (
    <main style={{ fontFamily: 'var(--font-body)', position: 'relative', overflow: 'hidden' }}>
      {/* ── Global Zig-Zag Background Design ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 1000" preserveAspectRatio="none" style={{ opacity: 0.09 }}>
          <defs>
            <linearGradient id="globalZigGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-text-main)" />
              <stop offset="30%" stopColor="var(--color-primary)" />
              <stop offset="60%" stopColor="var(--color-text-main)" />
              <stop offset="90%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
          <path 
            d="M-50,0 L150,200 L-50,400 L150,600 L-50,800 L150,1000 L250,1000 L50,800 L250,600 L50,400 L250,200 L50,0 Z" 
            fill="url(#globalZigGrad)"
            stroke="rgba(217,137,106,0.15)"
            strokeWidth="0.1"
          />
        </svg>
      </div>
      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        minHeight: '90vh',
        paddingTop: '68px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Full-background car image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1800)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          zIndex: 0,
        }} />

        {/* Overlay: Light translucent, slightly blurry overlay — lets car show through softly */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--hero-overlay-bg)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 1,
        }} />

        {/* Decorative asterisks */}
        <span style={{ position: 'absolute', top: '12%', left: '15%', fontSize: '2.8rem', color: 'var(--color-primary)', fontWeight: 900, lineHeight: 1, userSelect: 'none', zIndex: 3, opacity: 0.8 }}>✳</span>
        <span style={{ position: 'absolute', top: '10%', right: '18%', fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 900, userSelect: 'none', zIndex: 3, opacity: 0.6 }}>✦</span>
        <span style={{ position: 'absolute', top: '70%', left: '10%', fontSize: '0.9rem', color: 'var(--color-accent)', fontWeight: 900, userSelect: 'none', zIndex: 3, opacity: 0.6 }}>✦</span>

        {/* Content layer */}
        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: '1200px', margin: '0 auto', padding: '0 2rem',
          minHeight: 'calc(90vh - 68px)',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          alignItems: 'center', textAlign: 'center',
          width: '100%',
        }}>
          {/* Centered content: heading + booking card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
            style={{ maxWidth: '720px', width: '100%' }}
          >
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--color-dark-graphite)', lineHeight: 1.15, marginBottom: '1.25rem', fontFamily: 'var(--font-heading)' }}>
              Search, book, and<br />
              <span style={{ color: 'var(--color-primary)' }}>fix your car easily</span>
            </h1>
            <p style={{ fontSize: '1rem', color: 'var(--color-text-muted)', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '520px', margin: '0 auto 2.5rem' }}>
              Get a certified mechanic wherever and whenever you need it — right from your phone or desktop.
            </p>

            {/* Booking card — Frosted glass light with blury overlay */}
            <div style={{ 
              background: 'var(--booking-card-bg)', 
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              borderRadius: '16px', 
              padding: '1.2rem 1.6rem', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 1px 4px rgba(0,0,0,0.06)',
              margin: '0 auto',
              maxWidth: '620px',
              width: '100%',
              border: '1px solid var(--booking-card-border)',
            }}>
              {/* Tabs */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.4rem' }}>
                {SERVICE_TYPES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveType(t.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.35rem',
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontSize: '0.82rem', fontWeight: 600,
                      color: activeType === t.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
                      paddingBottom: '0.2rem',
                      borderBottom: activeType === t.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <t.icon style={{ fontSize: '0.85rem' }} />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Inputs row — completely responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-left">
                <div className="sm:col-span-4">
                  <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Location</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: '1px solid var(--booking-input-border)', paddingBottom: '0.25rem' }}>
                    <FaMapMarkerAlt style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }} />
                    <input type="text" placeholder="City, Area" value={location} onChange={e => setLocation(e.target.value)}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.8rem', color: 'var(--color-text-main)', background: 'transparent' }} />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: '1px solid var(--booking-input-border)', paddingBottom: '0.25rem' }}>
                    <FaCalendarAlt style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }} />
                    <input type="text" placeholder="Pick date" value={startDate} onChange={e => setStartDate(e.target.value)}
                      onFocus={e => (e.target.type = 'date')} onBlur={e => { if (!e.target.value) e.target.type = 'text' }}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.8rem', color: 'var(--color-text-main)', background: 'transparent' }} />
                  </div>
                </div>
                <div className="sm:col-span-3">
                  <label style={{ display: 'block', fontSize: '0.62rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Time</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderBottom: '1px solid var(--booking-input-border)', paddingBottom: '0.25rem' }}>
                    <FaWrench style={{ color: 'var(--color-primary)', fontSize: '0.75rem' }} rotate={90} />
                    <input type="text" placeholder="Pick time" value={endDate} onChange={e => setEndDate(e.target.value)}
                      onFocus={e => (e.target.type = 'time')} onBlur={e => { if (!e.target.value) e.target.type = 'text' }}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: '0.8rem', color: 'var(--color-text-main)', background: 'transparent' }} />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <button 
                    onClick={handleQuickSearch}
                    className="w-full h-[38px] rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary)] text-[var(--color-bg)] flex items-center justify-center fontSize-0.9rem flex-shrink-0 transition-all hover:scale-105 active:scale-95 border-none cursor-pointer"
                  >
                    <FaSearch className="mr-2 sm:mr-0" />
                    <span className="sm:hidden font-bold text-xs uppercase tracking-wider">Search</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand logos strip — Infinite Marquee */}
      <div className="relative z-10 border-t border-[var(--color-border)] bg-[var(--booking-card-bg)] backdrop-blur-md py-5 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            }
          }}
          className="flex items-center gap-16 w-max px-8"
        >
          {/* Render logos twice for seamless loop */}
          {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
            <span
              key={`${brand.name}-${idx}`}
              className="text-sm md:text-base font-bold text-[var(--color-dark-graphite)] tracking-widest opacity-40 whitespace-nowrap"
              style={{ fontStyle: brand.name === 'Ford' ? 'italic' : 'normal' }}
            >
              {brand.symbol}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── STATS STRIP (Fully Responsive Grid) ── */}
      <section className="bg-[var(--color-bg)] py-10 px-4 md:px-8 border-t border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-2"
            >
              <p className="text-2xl md:text-3xl font-extrabold text-[var(--color-primary)] mb-1">{stat.value}</p>
              <p className="text-[10px] md:text-xs text-[var(--color-text-muted)] uppercase tracking-wider font-bold">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SERVICES SECTION (3D Carousel) ── */}
      <section className="bg-[var(--color-bg)] py-16 md:py-24 overflow-hidden relative min-h-[750px]">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-12">
          <div className="flex items-baseline gap-4">
            <span className="text-xl md:text-2xl font-light text-[var(--color-text-muted)] opacity-40 font-heading">01</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-main)] font-heading uppercase tracking-tight">Our services</h2>
          </div>
        </div>

        {/* 3D Stack Container with Buttons */}
        <div style={{ position: 'relative', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Navigation Buttons */}
          <div style={{ 
            position: 'absolute', top: '50%', left: '5%', right: '5%', transform: 'translateY(-50%)', 
            display: 'flex', justifyContent: 'space-between', width: '90%', zIndex: 50, pointerEvents: 'none' 
          }}>
            <button 
              onClick={prevService}
              style={{ 
                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--carousel-btn-bg)', 
                border: '1px solid var(--carousel-btn-border)', color: 'var(--color-primary)', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto',
                transition: 'all 0.3s', boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--carousel-btn-bg)'; e.currentTarget.style.color = 'var(--color-primary)' }}
            >
              <FaArrowRight style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button 
              onClick={nextService}
              style={{ 
                width: '60px', height: '60px', borderRadius: '50%', background: 'var(--carousel-btn-bg)', 
                border: '1px solid var(--carousel-btn-border)', color: 'var(--color-primary)', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto',
                transition: 'all 0.3s', boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--carousel-btn-bg)'; e.currentTarget.style.color = 'var(--color-primary)' }}
            >
              <FaArrowRight />
            </button>
          </div>

          <div style={{ 
            height: '100%', width: '100%', position: 'relative', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', perspective: '1500px', transformStyle: 'preserve-3d' 
          }}>
            {services.map((service, idx) => {
              const offset = idx - activeIndex;
              const absOffset = Math.abs(offset);
              const isCenter = offset === 0;

              const name = service.name || service.title;
              const price = service.basePrice ? `$${service.basePrice}` : service.price;
              const desc = service.description || service.desc;
              const image = service.image || getServiceImage(name);

              return (
                <motion.div
                  key={service._id || service.id}
                  animate={{
                    x: offset * 340, // Horizontal spacing
                    scale: 1 - absOffset * 0.15,
                    rotateY: offset * -25,
                    zIndex: 10 - absOffset,
                    opacity: 1 - absOffset * 0.4,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    position: 'absolute',
                    width: '360px', 
                    height: '460px', 
                    borderRadius: '32px', 
                    overflow: 'hidden',
                    background: 'var(--color-surface)', 
                    boxShadow: isCenter ? '0 40px 80px rgba(0,0,0,0.8)' : '0 10px 30px rgba(0,0,0,0.4)',
                    cursor: 'pointer',
                    border: isCenter ? '1px solid rgba(217,137,106,0.3)' : '1px solid var(--color-border)'
                  }}
                  onClick={() => setActiveIndex(idx)}
                >
                  {/* Service Image (Mapped from Backend Name) */}
                  <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isCenter ? 1 : 0.5 }} />
                  
                  {/* Overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(22,24,29,0.95) 0%, transparent 70%)' }} />

                  {/* Top Label */}
                  <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'var(--color-text-main)', padding: '0.4rem 1.1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-bg)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {name}
                  </div>

                  {/* Service Content (Visible on center card) */}
                  <motion.div 
                    animate={{ opacity: isCenter ? 1 : 0, y: isCenter ? 0 : 20 }}
                    style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}
                  >
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: 1.6 }}>{desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Starting from</span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>{price}</span>
                      </div>
                      <Link to="/booking" style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-primary)', color: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.2s' }}>
                        <FaArrowRight style={{ transform: 'rotate(-45deg)' }} />
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Info & CTA */}
        <div style={{ maxWidth: '1200px', margin: '5rem auto 0', padding: '0 2rem', textAlign: 'center', width: '100%' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '750px', margin: '0 auto 2.5rem', fontWeight: 500 }}>
            Precision engineering meets high-end automotive care. Explore our specialized services tailored for premium vehicles.
          </p>
          <Link to="/services" style={{ 
            display: 'inline-block', 
            background: 'transparent', 
            border: '2px solid var(--color-primary)', 
            color: 'var(--color-primary)', 
            padding: '0.9rem 2.8rem', 
            borderRadius: '12px', 
            fontWeight: 800, 
            textDecoration: 'none', 
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontSize: '0.85rem'
          }}>
            View All Services & Prices
          </Link>
        </div>
      </section>

      {/* ── MECHANICS ── */}
      <section style={{ background: 'var(--color-surface)', padding: '5rem 2rem', borderTop: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: '0.6rem' }}>Expert Team</span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 0.5rem' }}>Meet Our Master Mechanics</h2>
              <p style={{ color: 'var(--color-text-muted)', maxWidth: '420px', lineHeight: 1.65, fontSize: '0.9rem', margin: 0 }}>
                Certified professionals with years of experience across all makes and models.
              </p>
            </div>
            <Link to="/mechanics" style={{ padding: '0.65rem 1.5rem', border: '1.5px solid var(--color-primary)', borderRadius: '10px', color: 'var(--color-primary)', fontWeight: 600, fontSize: '0.875rem', textDecoration: 'none', whiteSpace: 'nowrap' }}>
              View All Mechanics
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanicsData.map((mechanic, idx) => {
              const mecId   = mechanic._id || mechanic.id
              const mecName = mechanic.name
              const mecSpec = mechanic.specialization || mechanic.specialty || 'Mechanic'
              const mecDesc = mechanic.bio || mechanic.desc || `${mecName} is a certified mechanic at AutoMend.`
              const mecRating = mechanic.rating || '5.0'
              const mecExp = mechanic.experience ? `${mechanic.experience} Yrs` : mechanic.experienceYears ? `${mechanic.experienceYears} Yrs` : 'Expert'
              const mecReviews = mechanic.reviews || mechanic.totalReviews || 0
              const mecAvatar = mechanic.profilePhoto ? null : (mechanic.avatar || mecName?.charAt(0)?.toUpperCase())
              return (
                <motion.div key={mecId}
                  onClick={() => navigate(`/mechanic/${mecId}`)}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                  style={{
                    background: 'var(--color-surface)', borderRadius: '16px', padding: '1.75rem',
                    border: '1px solid var(--color-border)',
                    cursor: 'pointer',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                  }}
                  whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    {mechanic.profilePhoto ? (
                      <img src={mechanic.profilePhoto} alt={mecName}
                        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: '2px solid var(--color-border)' }} />
                    ) : (
                      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                        {mecAvatar}
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-dark-graphite)', margin: '0 0 0.2rem' }}>{mecName}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, margin: 0 }}>{mecSpec}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.65, marginBottom: '1.25rem' }}>{mecDesc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <FaStar style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-dark-graphite)' }}>{mecRating}</span>
                      {mecReviews > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>({mecReviews} reviews)</span>}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', background: 'rgba(217,137,106,0.12)', padding: '0.25rem 0.7rem', borderRadius: '999px' }}>
                      {mecExp}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: 'var(--color-bg)', padding: '5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: '0.75rem' }}>Ready to get started?</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 1rem' }}>
            Book your car service today
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
            Certified mechanics, transparent pricing, at your location or our garage.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/booking" style={{ padding: '0.85rem 2.2rem', background: 'var(--color-primary)', color: 'var(--color-bg)', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', transition: 'background 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              Book Now <FaArrowRight />
            </Link>
            <Link to="/services" style={{ padding: '0.85rem 2.2rem', background: 'transparent', border: '1.5px solid var(--secondary-cta-border)', color: 'var(--color-dark-graphite)', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
              Explore Services
            </Link>
          </div>
        </motion.div>
      </section>

    </main>
  )
}
