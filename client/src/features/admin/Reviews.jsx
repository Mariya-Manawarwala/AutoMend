import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaStar, FaWrench, FaWarehouse, FaTrash, FaCheck } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import axios from 'axios'

export default function Reviews() {
  const { addToast } = useToast()
  const [reviewsList, setReviewsList] = useState([])
  const [filter, setFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem('token')
      const { data } = await axios.get('http://localhost:8080/api/reviews/admin', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setReviewsList(data || [])
    } catch (err) {
      addToast('Failed to fetch platform reviews', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleAction = async (dbId, action, target) => {
    if (action === 'delete') {
      try {
        const token = localStorage.getItem('token')
        await axios.delete(`http://localhost:8080/api/reviews/${dbId}?target=${target.toLowerCase()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        addToast(`${target} review deleted permanently.`, 'info')
        fetchReviews()
      } catch (err) {
        addToast('Failed to delete review', 'error')
      }
    }
  }

  // Unpack MongoDB reviews into discrete garage and mechanic cards
  const items = []
  reviewsList.forEach(r => {
    // 1. Garage review card
    if (r.garageComment && r.garageComment.trim()) {
      items.push({
        id: `${r._id}_garage`,
        dbId: r._id,
        target: 'Garage',
        name: 'AutoMend Garage',
        rating: r.garageRating,
        comment: r.garageComment,
        user: r.customerId?.name || 'Customer',
        date: new Date(r.createdAt).toLocaleDateString(),
        status: 'published'
      })
    }
    // 2. Mechanic review card
    if (r.mechanicComment && r.mechanicComment.trim()) {
      items.push({
        id: `${r._id}_mechanic`,
        dbId: r._id,
        target: 'Mechanic',
        name: r.mechanicId?.name || 'Expert Mechanic',
        rating: r.mechanicRating,
        comment: r.mechanicComment,
        user: r.customerId?.name || 'Customer',
        date: new Date(r.createdAt).toLocaleDateString(),
        status: 'published'
      })
    }
  })

  const filtered = filter === 'all' ? items : items.filter(r => r.target.toLowerCase() === filter)

  return (
    <div className="space-y-6 pb-10 max-w-6xl">
      
      <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-max">
        {['all', 'mechanic', 'garage'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all ${filter === f ? 'bg-card text-white shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
            {f} Reviews
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((r, i) => (
              <motion.div key={r.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
                className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${r.target === 'Mechanic' ? 'bg-amber-500/10 text-amber-500' : 'bg-gold/10 text-gold'}`}>
                      {r.target === 'Mechanic' ? <FaWrench /> : <FaWarehouse />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{r.name}</p>
                      <p className="text-xs text-text-muted">{r.target} Feedback</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gold text-sm mb-3">
                  {[...Array(5)].map((_, idx) => <FaStar key={idx} className={idx < Math.floor(r.rating) ? 'text-gold' : 'text-white/10'} />)}
                  <span className="text-white font-bold ml-1">{r.rating}</span>
                </div>

                <p className="text-sm text-text-gray mb-4 italic leading-relaxed">"{r.comment}"</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs text-text-muted mb-4">
                  <span>By {r.user}</span>
                  <span>{r.date}</span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleAction(r.dbId, 'delete', r.target)} className="flex-1 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2">
                    <FaTrash /> Delete Review
                  </button>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="py-12 text-center text-text-muted">No platform reviews found in this category.</div>
      )}

    </div>
  )
}
