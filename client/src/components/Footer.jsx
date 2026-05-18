import { Link } from 'react-router-dom'
import { FaCar, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import { useSettings } from '../context/SettingsContext'

const LINKS = [
  { title: 'Services', links: [{ l: 'Engine Repair', p: '/services' }, { l: 'Oil Change', p: '/services' }, { l: 'Tire Service', p: '/services' }, { l: 'Battery Replacement', p: '/services' }, { l: 'Emergency Help', p: '/services' }] },
  { title: 'Company', links: [{ l: 'About Us', p: '/about' }, { l: 'Our Mechanics', p: '/mechanics' }, { l: 'Careers', p: '#' }, { l: 'Blog', p: '#' }, { l: 'Contact', p: '/about' }] },
  { title: 'Support', links: [{ l: 'Help Center', p: '#' }, { l: 'FAQs', p: '#' }, { l: 'Privacy Policy', p: '#' }, { l: 'Terms of Service', p: '#' }, { l: 'Refund Policy', p: '#' }] },
]
const SOCIALS = [FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn]

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="bg-deep-black text-dark-graphite relative overflow-hidden border-t border-black/5">
      {/* ── Zig-Zag Background Design ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.1 }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path 
            d="M-20,0 L120,50 L-20,100 L200,100 L200,0 Z" 
            fill="url(#footerZigGrad)" 
          />
          <defs>
            <linearGradient id="footerZigGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-text-main)" />
              <stop offset="50%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-warm-brown/10 via-transparent to-transparent pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-light-gold flex items-center justify-center shadow-[0_0_15px_rgba(200,155,60,0.3)] transition-all">
                <FaCar className="text-deep-black text-lg" />
              </div>
              <span className="text-xl font-heading font-bold text-dark-graphite">
                {settings.garageName.split(' ')[0]}<span className="text-gold">{settings.garageName.split(' ').slice(1).join(' ') || 'Mend'}</span>
              </span>
            </Link>
            <p className="text-text-muted text-sm font-body leading-relaxed mb-6 max-w-sm">Premium garage services delivered to your doorstep. Book expert mechanics instantly with transparent pricing and guaranteed satisfaction.</p>
            <div className="flex flex-col gap-3 text-sm font-body text-text-muted">
              <span className="flex items-center gap-3 hover:text-dark-graphite transition-colors"><FaMapMarkerAlt className="text-gold text-xs" /> {settings.address}</span>
              <span className="flex items-center gap-3 hover:text-dark-graphite transition-colors"><FaPhone className="text-gold text-xs" /> {settings.phone}</span>
              <span className="flex items-center gap-3 hover:text-dark-graphite transition-colors"><FaEnvelope className="text-gold text-xs" /> {settings.email}</span>
            </div>
          </div>
          {LINKS.map(c => (
            <div key={c.title}>
              <h4 className="text-dark-graphite font-heading font-semibold text-sm mb-5 uppercase tracking-wider">{c.title}</h4>
              <ul className="flex flex-col gap-3">
                {c.links.map(lk => <li key={lk.l}><Link to={lk.p} className="text-text-muted text-sm font-body hover:text-gold transition-colors flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-gold/50 group-hover:bg-gold transition-colors" /> {lk.l}</Link></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-black/5 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs font-body">© 2026 AutoMend. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {SOCIALS.map((I, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-lg bg-soft-dark border border-black/5 flex items-center justify-center text-text-muted hover:text-deep-black hover:bg-gradient-to-r hover:from-gold hover:to-light-gold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all"><I className="text-sm" /></a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
