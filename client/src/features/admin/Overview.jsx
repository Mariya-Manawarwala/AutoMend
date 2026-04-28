import { motion } from 'framer-motion'
import { FaUsers, FaWrench, FaCar, FaMoneyBillWave, FaChartLine } from 'react-icons/fa'

export default function Overview({ setTab }) {
  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Total Users', v: '1,245', sub: '+12 this week', icon: FaUsers, color: 'text-white' },
          { l: 'Active Mechanics', v: '48', sub: '3 pending approval', icon: FaWrench, color: 'text-sierra' },
          { l: 'Jobs in Progress', v: '12', sub: 'Across 4 cities', icon: FaCar, color: 'text-emerald-400' },
          { l: 'Total Revenue', v: '₹4.2L', sub: 'This month', icon: FaMoneyBillWave, color: 'text-gold' }
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg group hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-soft-dark border border-white/10 flex items-center justify-center text-xl ${s.color} group-hover:scale-110 transition-transform`}><s.icon /></div>
              <span className="text-xs text-text-muted bg-white/5 px-2 py-1 rounded-md">{s.sub}</span>
            </div>
            <p className="text-sm font-body text-text-muted mb-1">{s.l}</p>
            <p className="text-3xl font-heading font-bold text-white">{s.v}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart Placeholder */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2"><FaChartLine className="text-gold" /> Revenue Overview</h3>
              <p className="text-sm text-text-muted mt-1">Platform gross revenue over the last 6 months</p>
            </div>
            <select className="bg-soft-dark border border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-gold/30">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="h-64 flex items-end gap-6 justify-between border-b border-white/5 pb-4 relative z-10">
            {[30, 45, 40, 65, 55, 85].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
                <div className="w-full max-w-[40px] bg-gradient-to-t from-gold/10 to-gold/40 rounded-t-lg relative hover:from-gold/20 hover:to-gold border border-gold/20 hover:border-gold transition-all duration-500 shadow-[0_0_15px_rgba(200,155,60,0)] hover:shadow-[0_0_15px_rgba(200,155,60,0.3)]" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-deep-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h}k</div>
                </div>
                <span className="text-xs text-text-muted font-medium">{'Jan Feb Mar Apr May Jun'.split(' ')[i]}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Center */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Action Center</h3>
          
          <div className="space-y-4 flex-1">
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
              <p className="text-sm font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> 5 Unassigned Requests</p>
              <button onClick={() => setTab('requests')} className="text-xs font-bold underline mt-2 hover:text-red-300">View Requests</button>
            </div>
            
            <div className="p-4 rounded-xl bg-sierra/10 border border-sierra/20 text-sierra">
              <p className="text-sm font-bold flex items-center gap-2">3 Pending Mechanic Approvals</p>
              <button onClick={() => setTab('mechanics')} className="text-xs font-bold underline mt-2 hover:text-sierra/80">Review Applications</button>
            </div>

            <div className="p-4 rounded-xl bg-soft-dark border border-white/5">
              <p className="text-sm font-bold text-white">System Health</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-emerald-400 font-medium">
                <FaCheckCircle /> All systems operational
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
