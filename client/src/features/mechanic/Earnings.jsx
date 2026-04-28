import { motion } from 'framer-motion'
import { FaChartBar, FaCalendarDay, FaArrowUp, FaMoneyBillWave } from 'react-icons/fa'

const MOCK_PAYOUTS = [
  { id: 'TRX-9901', job: 'REQ-1022', amount: '₹12,450', date: 'Today, 4:30 PM', status: 'cleared' },
  { id: 'TRX-9900', job: 'REQ-1018', amount: '₹8,990', date: 'Yesterday', status: 'cleared' },
  { id: 'TRX-9899', job: 'REQ-1015', amount: '₹24,500', date: 'May 20, 2026', status: 'cleared' },
]

export default function Earnings({ setTab }) {
  return (
    <div className="max-w-5xl space-y-8 pb-10">
      
      {/* Top Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-gold/20 to-soft-dark border border-gold/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(200,155,60,0.15)] flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-full pointer-events-none" />
          <p className="text-gold font-bold uppercase tracking-widest text-sm mb-2 relative z-10">Total Earnings (This Month)</p>
          <div className="flex items-end gap-4 relative z-10">
            <h2 className="text-5xl lg:text-6xl font-heading font-bold text-white">₹42,500</h2>
            <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md text-sm font-bold mb-2">
              <FaArrowUp /> 12.5%
            </span>
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg flex flex-col justify-center">
          <div className="w-12 h-12 rounded-xl bg-soft-dark border border-white/10 flex items-center justify-center text-gold text-xl mb-4"><FaCalendarDay /></div>
          <p className="text-sm text-text-muted mb-1">Today's Payout</p>
          <p className="text-3xl font-heading font-bold text-white">₹12,450</p>
        </div>
      </div>

      {/* Chart Mock & Recent Payouts */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg">
          <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-3"><FaChartBar className="text-gold" /> Weekly Trend</h3>
          
          <div className="h-64 flex items-end gap-4 justify-between border-b border-white/5 pb-4">
            {[40, 60, 45, 80, 50, 90, 75].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-soft-dark rounded-t-lg relative hover:bg-gold/20 transition-colors" style={{ height: `${h}%` }}>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-deep-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹{h}k</div>
                </div>
                <span className="text-xs text-text-muted">{'SMTWTFS'[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg">
          <h3 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-3"><FaMoneyBillWave className="text-gold" /> Recent Payouts</h3>
          
          <div className="space-y-4">
            {MOCK_PAYOUTS.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-soft-dark border border-white/5 hover:border-white/10 transition-colors">
                <div>
                  <p className="text-sm font-bold text-white">{p.id} <span className="text-text-muted font-normal">• Job {p.job}</span></p>
                  <p className="text-xs text-text-muted mt-1">{p.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-emerald-400">{p.amount}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button onClick={() => setTab('history')} className="w-full py-3 mt-4 text-sm font-bold text-gold hover:text-light-gold transition-colors">View All Transactions</button>
        </div>

      </div>
    </div>
  )
}
