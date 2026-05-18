import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClipboardList, FaSearch, FaFilter, FaMapMarkerAlt, FaCar, FaCheck, FaTimes, FaUser, FaClock, FaTools } from 'react-icons/fa'
import { useRequests, useApproveRequest, useRejectRequest } from '../../hooks/useRequestHooks'
import { useToast } from '../../context/ToastContext'
import { useEffect } from 'react'

export default function Requests({ initialFilter }) {
  const { addToast } = useToast()
  const { data: requests = [], isLoading } = useRequests('admin')
  const approveMutation = useApproveRequest()
  const rejectMutation = useRejectRequest()

  const [filter, setFilter] = useState(initialFilter || 'all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (initialFilter) {
      setFilter(initialFilter)
    }
  }, [initialFilter])

  const filtered = requests.filter(r => {
    const searchStr = `${r._id} ${r.customerId?.name} ${r.vehicle?.brand} ${r.vehicle?.model}`.toLowerCase()
    const matchesSearch = searchStr.includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || r.status.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const handleApprove = async (id) => {
    try {
      await approveMutation.mutateAsync(id)
      addToast('Request approved and mechanics notified!', 'success')
    } catch (err) {
      addToast('Failed to approve request', 'error')
    }
  }

  const handleReject = async (id) => {
    try {
      await rejectMutation.mutateAsync(id)
      addToast('Request rejected', 'info')
    } catch (err) {
      addToast('Failed to reject request', 'error')
    }
  }

  if (isLoading) return <div className="h-64 flex items-center justify-center"><div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, Customer, or Car..." className="w-full pl-10 pr-4 py-2.5 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          {['all', 'pending', 'approved', 'inprogress', 'completed', 'rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-gold text-deep-black shadow-[0_0_15px_rgba(200,155,60,0.4)]' : 'bg-soft-dark text-text-muted hover:text-white border border-white/10'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filtered.map((r, i) => (
            <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
              className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                    r.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' : 
                    r.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                    r.status === 'Rejected' ? 'bg-red-500/10 text-red-500' :
                    'bg-gold/10 text-gold'
                  }`}>
                    <FaClipboardList />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gold uppercase tracking-widest mb-0.5">ID: {r._id.slice(-6)}</p>
                    <p className="text-sm font-bold text-white flex items-center gap-2">
                      <FaUser className="text-[10px] text-text-muted" /> {r.customerId?.name || 'Unknown'}
                    </p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                  r.status === 'Pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                  r.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  r.status === 'Rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                  'bg-gold/10 text-gold border-gold/20'
                }`}>
                  {r.status}
                </span>
              </div>

              <div className="space-y-3 bg-soft-dark/50 rounded-xl p-4 border border-white/5 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted flex items-center gap-2"><FaCar className="text-xs" /> Vehicle</span>
                  <span className="text-white font-bold">{r.vehicle?.brand} {r.vehicle?.model}</span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-text-muted">Issue</span>
                  <p className="text-sm text-text-gray line-clamp-2 italic">"{r.description}"</p>
                </div>
                <div className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
                  <span className="text-text-muted flex items-center gap-2"><FaClock className="text-xs" /> Scheduled</span>
                  <span className="text-white font-medium">{new Date(r.scheduledDate).toLocaleDateString()}</span>
                </div>
                {r.serviceIds?.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {r.serviceIds.map(s => (
                      <span key={s._id} className="px-2 py-0.5 bg-white/5 rounded-md text-[10px] text-text-muted border border-white/5 flex items-center gap-1">
                        <FaTools className="text-[8px]" /> {s.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Actions */}
              {r.status === 'Pending' && (
                <div className="grid grid-cols-2 gap-3 relative z-10">
                  <button 
                    onClick={() => handleReject(r._id)}
                    disabled={rejectMutation.isPending}
                    className="flex items-center justify-center gap-2 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
                  >
                    <FaTimes /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(r._id)}
                    disabled={approveMutation.isPending}
                    className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-deep-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:scale-105 transition-all"
                  >
                    <FaCheck /> Approve
                  </button>
                </div>
              )}

              {r.assignedMechanicId && (
                <div className="flex items-center justify-between p-3 bg-gold/5 rounded-xl border border-gold/10">
                  <span className="text-[10px] font-black text-gold uppercase tracking-widest">Assigned Mechanic</span>
                  <span className="text-sm font-bold text-white">{r.assignedMechanicId.name}</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-text-muted bg-card/40 rounded-[3rem] border border-dashed border-white/10">
          <FaClipboardList className="text-5xl opacity-10 mx-auto mb-4" />
          <p className="text-lg font-heading">No requests found</p>
        </div>
      )}
    </div>
  )
}
