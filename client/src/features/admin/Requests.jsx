import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaClipboardList, FaSearch, FaFilter, FaMapMarkerAlt, FaCar } from 'react-icons/fa'

const MOCK_ALL_REQUESTS = [
  { id: 'REQ-1050', customer: 'Alex Johnson', vehicle: '2024 BMW X5', issue: 'Engine noise', type: 'Home Service', status: 'pending', date: 'Today, 10:00 AM' },
  { id: 'REQ-1049', customer: 'Samantha Lee', vehicle: '2023 Tesla Model 3', issue: 'Battery check', type: 'Garage Service', status: 'accepted', mechanic: 'James Rodriguez', date: 'Today, 2:00 PM' },
  { id: 'REQ-1048', customer: 'Michael Brown', vehicle: '2021 Porsche Macan', issue: 'Oil change', type: 'Home Service', status: 'completed', mechanic: 'David Smith', date: 'Yesterday' },
]

export default function Requests() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = MOCK_ALL_REQUESTS.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(search.toLowerCase()) || r.customer.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || r.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID or Customer..." className="w-full pl-10 pr-4 py-2.5 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          {['all', 'pending', 'accepted', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${filter === f ? 'bg-gold text-deep-black shadow-[0_0_15px_rgba(200,155,60,0.4)]' : 'bg-soft-dark text-text-muted hover:text-white border border-white/10'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filtered.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}
              className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors">
              
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${r.status === 'pending' ? 'bg-sierra/10 text-sierra' : r.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gold/10 text-gold'}`}>
                    <FaClipboardList />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{r.id} <span className="text-text-muted font-normal">• {r.customer}</span></p>
                    <p className="text-xs text-text-muted mt-1">{r.date}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${r.status === 'pending' ? 'bg-sierra/10 text-sierra border-sierra/20' : r.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gold/10 text-gold border-gold/20'}`}>
                  {r.status}
                </span>
              </div>

              <div className="space-y-3 bg-soft-dark/50 rounded-xl p-4 border border-white/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted flex items-center gap-2"><FaCar /> Vehicle</span>
                  <span className="text-white font-medium">{r.vehicle}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Reported Issue</span>
                  <span className="text-white font-medium truncate max-w-[200px]">{r.issue}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted flex items-center gap-2"><FaMapMarkerAlt /> Type</span>
                  <span className="text-white font-medium">{r.type}</span>
                </div>
                {r.mechanic && (
                  <div className="flex items-center justify-between text-sm pt-3 border-t border-white/5">
                    <span className="text-text-muted">Assigned To</span>
                    <span className="text-gold font-bold">{r.mechanic}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted bg-card/50 rounded-3xl border border-dashed border-white/10">
            No requests found matching your criteria.
          </div>
        )}
      </div>

    </div>
  )
}
