import { motion } from 'framer-motion'
import { FaCar, FaWrench, FaCheckCircle, FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa'

export default function Overview({ setTab }) {
  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Active Jobs', v: '2', sub: 'In Progress', color: 'text-sierra', border: 'hover:border-sierra/30' },
          { l: 'Completed Jobs', v: '18', sub: 'This Month', color: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
          { l: 'Earnings', v: '₹42,500', sub: 'This Month', color: 'text-gold', border: 'hover:border-gold/30' },
          { l: 'Rating', v: '4.9', sub: 'Based on 45 reviews', color: 'text-white', border: 'hover:border-white/20' }
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 shadow-lg ${s.border}`}>
            <p className="text-sm font-body text-text-muted mb-2">{s.l}</p>
            <div className="flex items-end justify-between">
              <p className={`text-4xl font-heading font-bold ${s.color}`}>{s.v}</p>
              <span className="text-xs text-text-muted mb-1">{s.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Job Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-xl font-heading font-bold text-white">Current Active Job</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-sierra/10 text-sierra border-sierra/20 shadow-[0_0_10px_rgba(169,120,95,0.2)]">In Progress</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-full md:w-1/3 aspect-video rounded-xl bg-soft-dark border border-white/5 overflow-hidden flex items-center justify-center">
              <FaCar className="text-6xl text-text-muted opacity-50" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <p className="text-sm text-gold font-bold mb-1">REQ-1023</p>
                <h4 className="text-2xl font-heading font-bold text-white">2024 BMW X5</h4>
                <p className="text-sm text-text-muted flex items-center gap-2 mt-1"><FaWrench className="text-xs" /> Engine making weird noise</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-text-muted mb-1"><FaClock className="inline mr-1" /> Time</p>
                  <p className="text-sm text-white font-medium">Started 2 hrs ago</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1"><FaMapMarkerAlt className="inline mr-1" /> Location</p>
                  <p className="text-sm text-white font-medium">Home Service (2.5 km)</p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <button onClick={() => setTab('jobs')} className="px-6 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] hover:scale-105 transition-all">
                  Open Work Panel
                </button>
                <button className="px-6 py-2.5 bg-soft-dark border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 hover:border-gold/30 transition-colors">
                  Navigate
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Quick Links</h3>
          <div className="space-y-4 flex-1">
            <button onClick={() => setTab('requests')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-soft-dark border border-gold/30 shadow-[0_0_15px_rgba(200,155,60,0.1)] hover:bg-gold/5 transition-all group text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full m-3 animate-pulse" />
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><FaCar /></div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">View Live Requests</p>
                <p className="text-xs text-text-muted">4 new jobs available</p>
              </div>
            </button>
            <button onClick={() => setTab('earnings')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-soft-dark border border-white/5 hover:border-white/20 transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform"><FaStar /></div>
              <div>
                <p className="text-sm font-bold text-white">Check Earnings</p>
                <p className="text-xs text-text-muted">View your payout history</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
