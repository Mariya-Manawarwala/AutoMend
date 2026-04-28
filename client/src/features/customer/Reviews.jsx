import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaPlus, FaTimes, FaUserCircle } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

const MOCK_REVIEWS = [
  { id: 1, type: 'garage', rating: 5, date: 'May 20, 2026', text: 'Excellent service. They picked up my car on time and returned it perfectly clean. Highly recommend AutoMend Garage!' },
  { id: 2, type: 'mechanic', mechanic: 'James Rodriguez', rating: 4.8, date: 'May 10, 2026', text: 'James was very professional and explained the engine issue clearly before proceeding with repairs.' },
]

export default function Reviews() {
  const { addToast } = useToast()
  const [tab, setTab] = useState('garage')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ garageRating: 0, garageReview: '', mechanicRating: 0, mechanicReview: '' })

  const handleSubmit = () => {
    if (!form.garageRating) return addToast('Please provide at least a garage rating', 'error')
    addToast('Review submitted successfully!', 'success')
    setShowModal(false)
    setForm({ garageRating: 0, garageReview: '', mechanicRating: 0, mechanicReview: '' })
  }

  const reviews = MOCK_REVIEWS.filter(r => r.type === tab)

  return (
    <div className="max-w-4xl space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-max">
          {['garage', 'mechanic'].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all ${tab === t ? 'bg-card text-white shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
              {t} Reviews
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-soft-dark border border-white/10 flex items-center justify-center text-text-muted"><FaUserCircle className="text-2xl" /></div>
                <div>
                  <p className="text-sm font-bold text-white">{r.type === 'garage' ? 'AutoMend Garage' : r.mechanic}</p>
                  <div className="flex items-center gap-1 text-gold text-xs">
                    {[...Array(5)].map((_, idx) => <FaStar key={idx} className={idx < Math.floor(r.rating) ? 'text-gold' : 'text-white/10'} />)}
                    <span className="ml-1 text-white font-bold">{r.rating}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted">{r.date}</p>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{r.text}</p>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="py-12 text-center text-text-muted">No reviews found for this category.</div>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-card border border-white/10 rounded-3xl p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">Rate your Experience</h3>
                  <p className="text-xs text-text-muted">Job ID: REQ-1024</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-sm font-bold text-white block mb-3">Rate the Garage</label>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setForm({...form, garageRating: star})} className="text-2xl hover:scale-110 transition-transform">
                        <FaStar className={star <= form.garageRating ? 'text-gold drop-shadow-[0_0_5px_rgba(200,155,60,0.8)]' : 'text-white/10'} />
                      </button>
                    ))}
                  </div>
                  <textarea rows={3} value={form.garageReview} onChange={e => setForm({...form, garageReview: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none" placeholder="Share details of your experience with the garage..." />
                </div>

                <div className="pt-6 border-t border-white/5">
                  <label className="text-sm font-bold text-white block mb-3">Rate the Mechanic (James R.)</label>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setForm({...form, mechanicRating: star})} className="text-2xl hover:scale-110 transition-transform">
                        <FaStar className={star <= form.mechanicRating ? 'text-gold drop-shadow-[0_0_5px_rgba(200,155,60,0.8)]' : 'text-white/10'} />
                      </button>
                    ))}
                  </div>
                  <textarea rows={3} value={form.mechanicReview} onChange={e => setForm({...form, mechanicReview: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none" placeholder="How was the mechanic's service?" />
                </div>

                <button onClick={handleSubmit} className="w-full py-3.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
