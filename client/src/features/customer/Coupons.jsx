import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTicketAlt, FaCheck } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

const MOCK_COUPONS = [
  { code: 'WELCOME10', desc: '10% OFF up to ₹300', min: '₹500', valid: '30 Jun 2026', type: 'available' },
  { code: 'SAVE200', desc: 'Flat ₹200 OFF', min: '₹1000', valid: '15 Jul 2026', type: 'available' },
  { code: 'SERVICE15', desc: '15% OFF up to ₹500', min: '₹1500', valid: '31 Aug 2026', type: 'available' },
  { code: 'WINTER50', desc: 'Flat ₹50 OFF', min: '₹300', valid: 'Expired', type: 'expired' },
]

export default function Coupons() {
  const { addToast } = useToast()
  const [tab, setTab] = useState('available')
  const [applied, setApplied] = useState(null)
  const [inputCode, setInputCode] = useState('')

  const handleApply = (code) => {
    setApplied(code)
    addToast(`Coupon ${code} applied to next booking!`, 'success')
  }

  const handleManualApply = () => {
    if (!inputCode) return
    handleApply(inputCode.toUpperCase())
    setInputCode('')
  }

  const coupons = MOCK_COUPONS.filter(c => c.type === tab)

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      
      {/* Manual Entry */}
      <div className="flex items-center gap-4 p-4 bg-card/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg">
        <input value={inputCode} onChange={e => setInputCode(e.target.value)} placeholder="Enter coupon code" className="flex-1 bg-soft-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-gold/50 uppercase placeholder:normal-case" />
        <button onClick={handleManualApply} className="px-6 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold text-sm hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all shrink-0">
          Apply
        </button>
      </div>

      <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-max">
        {['available', 'used', 'expired'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all ${tab === t ? 'bg-card text-white shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
            {t} ({MOCK_COUPONS.filter(c => c.type === t).length})
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {coupons.map((c, i) => (
          <motion.div key={c.code} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            className={`p-1 rounded-2xl transition-all ${applied === c.code ? 'bg-gradient-to-r from-gold to-light-gold shadow-[0_0_15px_rgba(200,155,60,0.3)] scale-[1.02]' : 'bg-transparent border border-white/5'}`}>
            <div className={`bg-card rounded-xl p-5 flex flex-wrap items-center justify-between gap-4 ${applied === c.code ? 'opacity-95' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${applied === c.code ? 'bg-gold/20 text-gold' : 'bg-soft-dark text-text-muted'}`}>
                  <FaTicketAlt className="rotate-[-45deg]" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gold tracking-widest">{c.code}</p>
                    {applied === c.code && <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">Applied</span>}
                  </div>
                  <p className="text-base font-bold text-white mb-1">{c.desc}</p>
                  <p className="text-xs text-text-muted">Min order {c.min} • Valid till {c.valid}</p>
                </div>
              </div>
              
              {tab === 'available' && (
                <button onClick={() => applied === c.code ? setApplied(null) : handleApply(c.code)}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${applied === c.code ? 'bg-soft-dark text-text-muted hover:text-white' : 'bg-soft-dark border border-white/10 text-white hover:border-gold/50'}`}>
                  {applied === c.code ? 'Remove' : 'Apply'}
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {coupons.length === 0 && (
          <div className="py-12 text-center text-text-muted">No {tab} coupons found.</div>
        )}
      </div>

    </div>
  )
}
