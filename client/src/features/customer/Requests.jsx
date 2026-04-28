import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaFilter } from 'react-icons/fa'
import { MOCK_REQUESTS } from '../../data/constants'

const STATUS_BADGE = {
  pending: 'bg-gold/10 text-gold border-gold/20 shadow-[0_0_10px_rgba(200,155,60,0.2)]',
  in_progress: 'bg-sierra/10 text-sierra border-sierra/20 shadow-[0_0_10px_rgba(169,120,95,0.2)]',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
  accepted: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
  billed: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
}

export default function Requests({ setTab }) {
  const [filter, setFilter] = useState('all')
  const filteredRequests = filter === 'all' ? MOCK_REQUESTS : MOCK_REQUESTS.filter(r => r.status === f)

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['all', 'pending', 'accepted', 'in_progress', 'billed', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-medium rounded-lg capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-card text-white shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        
        <button onClick={() => setTab('add-request')} className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all flex items-center justify-center gap-2 group">
          <FaPlus className="group-hover:rotate-90 transition-transform" /> Add Request
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRequests.map((r, i) => (
            <motion.div layout key={r.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
              className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg hover:-translate-y-1 hover:border-white/10 transition-all flex flex-col">
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-gold mb-1">{r.id}</p>
                  <h4 className="text-lg font-heading font-bold text-white">{r.vehicle}</h4>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${STATUS_BADGE[r.status]}`}>
                  {r.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Issue</p>
                  <p className="text-sm font-medium text-white">{r.issue}</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Service</p>
                    <p className="text-sm font-medium text-white">{r.service}</p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-0.5">Date</p>
                    <p className="text-sm font-medium text-white">{r.date}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-auto">
                <button className="flex-1 py-2.5 bg-soft-dark border border-white/5 text-white rounded-xl text-sm font-bold hover:bg-white/5 transition-colors">
                  Details
                </button>
                {r.status === 'billed' && (
                  <button className="flex-[2] py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2">
                    Pay Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredRequests.length === 0 && (
          <div className="col-span-full py-20 text-center text-text-muted">
            <div className="w-16 h-16 rounded-full bg-soft-dark border border-white/5 flex items-center justify-center mx-auto mb-4 opacity-50"><FaFilter className="text-2xl" /></div>
            <p>No requests found for this status.</p>
          </div>
        )}
      </div>
    </div>
  )
}
