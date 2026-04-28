import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTicketAlt, FaPlus, FaTrash, FaTimes } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

const MOCK_COUPONS = [
  { id: 1, code: 'WELCOME10', desc: '10% OFF up to ₹300', usage: 145, limit: 500, expiry: '2026-06-30', status: 'active' },
  { id: 2, code: 'SAVE200', desc: 'Flat ₹200 OFF on billing > ₹1000', usage: 89, limit: 100, expiry: '2026-07-15', status: 'active' },
  { id: 3, code: 'WINTER50', desc: 'Flat ₹50 OFF', usage: 200, limit: 200, expiry: '2026-01-31', status: 'expired' },
]

export default function Coupons() {
  const { addToast } = useToast()
  const [coupons, setCoupons] = useState(MOCK_COUPONS)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ code: '', desc: '', limit: '', expiry: '' })

  const handleSave = () => {
    if (!form.code) return addToast('Coupon code required', 'error')
    setCoupons([...coupons, { id: Date.now(), ...form, usage: 0, status: 'active' }])
    setShowModal(false)
    addToast('Coupon created successfully', 'success')
  }

  const handleDelete = (id) => {
    setCoupons(coupons.filter(c => c.id !== id))
    addToast('Coupon deleted', 'info')
  }

  return (
    <div className="space-y-6 pb-10 max-w-6xl">
      
      <div className="flex justify-between items-center bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-white">Promo Campaigns</h2>
          <p className="text-xs text-text-muted">Manage discount codes for customers.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(200,155,60,0.3)] hover:scale-105 transition-all flex items-center gap-2">
          <FaPlus /> Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {coupons.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
              className={`bg-card/80 backdrop-blur-md rounded-2xl p-6 border shadow-lg relative overflow-hidden group ${c.status === 'expired' ? 'border-white/5 opacity-70' : 'border-gold/30 shadow-[0_0_15px_rgba(200,155,60,0.1)] hover:-translate-y-1 transition-transform'}`}>
              
              <div className="flex justify-between items-start mb-4">
                <div className={`flex items-center gap-3 px-3 py-1.5 rounded-lg border ${c.status === 'expired' ? 'bg-soft-dark border-white/10 text-text-muted' : 'bg-gold/10 border-gold/30 text-gold'}`}>
                  <FaTicketAlt className={c.status === 'expired' ? '' : 'rotate-[-45deg]'} />
                  <span className="font-heading font-bold tracking-widest">{c.code}</span>
                </div>
                <button onClick={() => handleDelete(c.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors bg-soft-dark rounded-lg opacity-0 group-hover:opacity-100"><FaTrash /></button>
              </div>

              <p className="text-sm font-medium text-white mb-6">{c.desc}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-text-muted mb-1">Usage Limit</p>
                  <p className="text-sm font-bold text-white">{c.usage} / {c.limit}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Expires On</p>
                  <p className="text-sm font-bold text-white">{c.expiry}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl z-10">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">Create Coupon</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Coupon Code</label>
                  <input value={form.code} onChange={e => setForm({...form, code: e.target.value.toUpperCase()})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 uppercase" placeholder="e.g. SUMMER20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Description</label>
                  <input value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. 20% OFF on all services" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Total Limit</label>
                    <input type="number" value={form.limit} onChange={e => setForm({...form, limit: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. 500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Expiry Date</label>
                    <input type="date" value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 [color-scheme:dark]" />
                  </div>
                </div>

                <button onClick={handleSave} className="w-full py-3.5 mt-4 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
                  Publish Campaign
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
