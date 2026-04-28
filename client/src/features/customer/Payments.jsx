import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle, FaClock, FaCreditCard, FaWallet, FaMobileAlt } from 'react-icons/fa'

const MOCK_PAYMENTS = [
  { id: 'PAY-1004', req: 'REQ-1024', amount: '₹6,850', date: 'May 24, 2026', status: 'paid' },
  { id: 'PAY-1003', req: 'REQ-1018', amount: '₹4,299', date: 'May 18, 2026', status: 'paid' },
  { id: 'PAY-1002', req: 'REQ-1012', amount: '₹3,150', date: 'May 12, 2026', status: 'paid' },
  { id: 'PAY-1001', req: 'REQ-1008', amount: '₹2,999', date: 'May 05, 2026', status: 'pending' },
]

export default function Payments() {
  const [filter, setFilter] = useState('all')

  const payments = filter === 'all' ? MOCK_PAYMENTS : MOCK_PAYMENTS.filter(p => p.status === filter)

  return (
    <div className="space-y-8 pb-10">
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Payment History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-max">
            {['all', 'paid', 'pending'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all ${filter === f ? 'bg-card text-white shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {payments.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card/80 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${p.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-sierra/10 text-sierra'}`}>
                    {p.status === 'paid' ? <FaCheckCircle /> : <FaClock />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white mb-0.5">{p.id} <span className="text-text-muted font-normal">• {p.req}</span></p>
                    <p className="text-xs text-text-muted">{p.date}</p>
                  </div>
                </div>
                <div className="w-full sm:w-auto text-right">
                  <p className="text-lg font-heading font-bold text-white">{p.amount}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${p.status === 'paid' ? 'text-emerald-400' : 'text-sierra'}`}>{p.status}</p>
                </div>
                {p.status === 'paid' && (
                  <div className="w-full pt-4 mt-2 border-t border-white/5 flex flex-wrap gap-3">
                    <button className="flex-1 py-2 bg-soft-dark border border-white/10 text-white rounded-lg text-xs font-bold hover:bg-white/5 transition-colors">
                      View Bill Breakdown
                    </button>
                    <button className="flex-1 py-2 bg-gradient-to-r from-gold/20 to-light-gold/20 text-gold border border-gold/30 rounded-lg text-xs font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.3)] transition-all">
                      Download Invoice
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-6">
          <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg">
            <h3 className="text-lg font-heading font-bold text-white mb-6">Payment Methods We Accept</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { l: 'Credit/Debit', i: FaCreditCard },
                { l: 'UPI Apps', i: FaMobileAlt },
                { l: 'Net Banking', i: FaWallet },
              ].map(m => (
                <div key={m.l} className="bg-soft-dark border border-white/5 rounded-xl p-4 text-center group hover:-translate-y-1 hover:border-gold/30 hover:shadow-[0_0_15px_rgba(200,155,60,0.2)] transition-all">
                  <m.i className="text-2xl text-text-muted mx-auto mb-2 group-hover:text-gold transition-colors" />
                  <p className="text-xs font-medium text-white">{m.l}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-gold/20 to-soft-dark rounded-2xl p-6 border border-gold/20 shadow-[0_0_20px_rgba(200,155,60,0.1)]">
            <h4 className="text-gold font-bold mb-2">Secure Payments</h4>
            <p className="text-sm text-text-muted">All transactions are secured with 256-bit encryption. We never store your card details.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
