import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWrench, FaCheck, FaTimes, FaEnvelope, FaBriefcase, FaIdBadge } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

const MOCK_MECHANIC_REQUESTS = [
  { id: 'REQ-M-01', name: 'Robert Chen', email: 'robert.chen@example.com', skills: ['Engine Diagnostics', 'Electrical'], experience: 5, status: 'pending' },
  { id: 'REQ-M-02', name: 'Alisha Patel', email: 'alisha.p@example.com', skills: ['Brakes', 'Suspension', 'AC / Heating'], experience: 3, status: 'pending' },
  { id: 'REQ-M-03', name: 'Marcus Johnson', email: 'marcus.j@example.com', skills: ['Transmission', 'Engine Diagnostics'], experience: 8, status: 'pending' },
]

export default function Mechanics() {
  const { addToast } = useToast()
  const [requests, setRequests] = useState(MOCK_MECHANIC_REQUESTS)
  const [exitAction, setExitAction] = useState(null)

  const handleAction = (id, action) => {
    setExitAction(action)
    setTimeout(() => {
      setRequests(prev => prev.filter(r => r.id !== id))
      if (action === 'approve') {
        addToast('Mechanic approved successfully. Notification sent.', 'success')
      } else {
        addToast('Mechanic application rejected.', 'error')
      }
      setExitAction(null)
    }, 500)
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      <div className="flex justify-between items-center bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Mechanic Applications</h2>
          <p className="text-xs text-text-muted">Review and approve new mechanics for the platform.</p>
        </div>
        <div className="bg-soft-dark border border-white/10 px-4 py-2 rounded-xl">
          <span className="text-sm font-bold text-gold">{requests.length} Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {requests.map((req, i) => (
            <motion.div 
              key={req.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={exitAction === 'approve' ? { opacity: 0, scale: 1.05, boxShadow: "0 0 30px rgba(16, 185, 129, 0.5)", borderColor: "rgba(16, 185, 129, 0.8)" } : { opacity: 0, scale: 0.9, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-[#1C1C1C] rounded-2xl p-6 border border-white/5 relative overflow-hidden group hover:-translate-y-1 hover:scale-[1.02] hover:border-gold/50 hover:shadow-[0_0_20px_rgba(200,155,60,0.3)] transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 rounded-bl-full pointer-events-none group-hover:bg-gold/10 transition-colors" />
              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-soft-dark border border-white/10 flex items-center justify-center text-xl text-gold group-hover:bg-gold/10 transition-colors">
                    <FaWrench />
                  </div>
                  <div>
                    <h4 className="text-lg font-heading font-bold text-white">{req.name}</h4>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5"><FaEnvelope className="text-[10px]" /> {req.email}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-sierra/10 text-sierra text-[10px] font-bold uppercase rounded border border-sierra/20 animate-pulse">
                  Pending
                </span>
              </div>

              <div className="space-y-4 mb-6 relative z-10">
                <div className="flex items-center gap-2 text-sm text-white bg-soft-dark/50 p-2.5 rounded-lg border border-white/5">
                  <FaBriefcase className="text-text-muted" /> <span className="font-bold">{req.experience} Years</span> Experience
                </div>
                <div>
                  <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Core Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {req.skills.map(s => (
                      <span key={s} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-xs text-text-muted">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5 relative z-10">
                <button 
                  onClick={() => handleAction(req.id, 'approve')} 
                  className="flex-1 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:text-deep-black hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <FaCheck /> Approve
                </button>
                <button 
                  onClick={() => handleAction(req.id, 'reject')} 
                  className="flex-1 py-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-deep-black hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all flex items-center justify-center gap-2"
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {requests.length === 0 && (
        <div className="col-span-full py-16 text-center text-text-muted bg-card/50 rounded-3xl border border-dashed border-white/10">
          <FaCheck className="text-4xl text-emerald-400/50 mx-auto mb-4" />
          <p className="text-lg font-bold text-white">All Caught Up!</p>
          <p className="text-sm mt-1">There are no pending mechanic applications.</p>
        </div>
      )}
    </div>
  )
}
