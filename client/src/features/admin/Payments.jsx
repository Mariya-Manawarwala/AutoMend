import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaMoneyBillWave, FaDownload, FaSearch, FaCheckCircle, FaClock } from 'react-icons/fa'

const MOCK_ADMIN_PAYMENTS = [
  { id: 'TRX-1090', customer: 'Alex Johnson', mechanic: 'James R.', amount: '₹12,450', date: 'May 20, 2026', status: 'cleared', type: 'Credit Card' },
  { id: 'TRX-1089', customer: 'Samantha Lee', mechanic: 'David S.', amount: '₹8,990', date: 'May 19, 2026', status: 'cleared', type: 'UPI' },
  { id: 'TRX-1088', customer: 'Michael Brown', mechanic: 'Pending', amount: '₹4,500', date: 'May 18, 2026', status: 'pending', type: 'Net Banking' },
]

export default function Payments() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_ADMIN_PAYMENTS.filter(p => p.id.toLowerCase().includes(search.toLowerCase()) || p.customer.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by Transaction ID or Customer..." className="w-full pl-10 pr-4 py-2.5 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
        </div>
        <button className="px-5 py-2.5 bg-soft-dark border border-white/10 text-white rounded-xl text-sm font-bold hover:border-gold/30 hover:text-gold transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
          <FaDownload /> Export Ledger
        </button>
      </div>

      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 text-sm text-text-muted uppercase tracking-wider">
              <th className="pb-4 pl-4 font-semibold">Transaction ID & Date</th>
              <th className="pb-4 font-semibold">Customer / Mechanic</th>
              <th className="pb-4 font-semibold">Payment Method</th>
              <th className="pb-4 font-semibold">Amount</th>
              <th className="pb-4 pr-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <motion.tr key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${p.status === 'cleared' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-sierra/10 text-sierra border border-sierra/20'}`}>
                      <FaMoneyBillWave />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.id}</p>
                      <p className="text-xs text-text-muted">{p.date}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <p className="text-sm font-bold text-white">{p.customer}</p>
                  <p className="text-xs text-text-muted mt-0.5">Mec: {p.mechanic}</p>
                </td>
                <td className="py-4">
                  <span className="text-sm text-white px-3 py-1 rounded-lg bg-soft-dark border border-white/5">{p.type}</span>
                </td>
                <td className="py-4">
                  <span className="text-lg font-bold text-gold">{p.amount}</span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider border ${p.status === 'cleared' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-sierra/10 text-sierra border-sierra/20'}`}>
                    {p.status === 'cleared' ? <><FaCheckCircle /> Cleared</> : <><FaClock /> Pending</>}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && <div className="py-12 text-center text-text-muted">No transactions found.</div>}
      </div>

    </div>
  )
}
