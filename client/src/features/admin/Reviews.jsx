import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaWrench, FaWarehouse, FaTrash, FaCheck } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

const MOCK_REVIEWS = [
  { id: 'REV-01', target: 'Mechanic', name: 'James Rodriguez', rating: 5, user: 'Alex Johnson', comment: 'Excellent service! Very professional.', date: 'May 20, 2026', status: 'published' },
  { id: 'REV-02', target: 'Garage', name: 'AutoMend South', rating: 4, user: 'Samantha Lee', comment: 'Good work, but took a bit longer than expected.', date: 'May 18, 2026', status: 'published' },
  { id: 'REV-03', target: 'Mechanic', name: 'David Smith', rating: 1, user: 'Michael Brown', comment: 'Mechanic arrived late and didn\'t fix the issue.', date: 'May 15, 2026', status: 'flagged' },
]

export default function Reviews() {
  const { addToast } = useToast()
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? reviews : reviews.filter(r => r.target.toLowerCase() === filter)

  const handleAction = (id, action) => {
    if (action === 'delete') {
      setReviews(reviews.filter(r => r.id !== id))
      addToast('Review deleted permanently.', 'info')
    } else if (action === 'approve') {
      setReviews(reviews.map(r => r.id === id ? { ...r, status: 'published' } : r))
      addToast('Review approved and published.', 'success')
    }
  }

  return (
    <div className="space-y-6 pb-10 max-w-6xl">
      
      <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-max">
        {['all', 'mechanic', 'garage'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all ${filter === f ? 'bg-card text-white shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
            {f} Reviews
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
              className={`bg-card/80 backdrop-blur-md rounded-2xl p-6 border shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform ${r.status === 'flagged' ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-white/5'}`}>
              
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${r.target === 'Mechanic' ? 'bg-sierra/10 text-sierra' : 'bg-gold/10 text-gold'}`}>
                    {r.target === 'Mechanic' ? <FaWrench /> : <FaWarehouse />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{r.name}</p>
                    <p className="text-xs text-text-muted">{r.target}</p>
                  </div>
                </div>
                {r.status === 'flagged' && <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase rounded border border-red-500/20">Flagged</span>}
              </div>

              <div className="flex items-center gap-1 text-gold text-sm mb-3">
                {[...Array(5)].map((_, idx) => <FaStar key={idx} className={idx < Math.floor(r.rating) ? 'text-gold' : 'text-white/10'} />)}
                <span className="text-white font-bold ml-1">{r.rating}</span>
              </div>

              <p className="text-sm text-text-muted mb-4 italic">"{r.comment}"</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-text-muted mb-4">
                <span>By {r.user}</span>
                <span>{r.date}</span>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {r.status === 'flagged' && (
                  <button onClick={() => handleAction(r.id, 'approve')} className="flex-1 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2">
                    <FaCheck /> Approve
                  </button>
                )}
                <button onClick={() => handleAction(r.id, 'delete')} className="flex-1 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                  <FaTrash /> Delete
                </button>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
