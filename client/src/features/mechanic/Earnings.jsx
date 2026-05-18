import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaChartBar, FaCalendarDay, FaArrowUp, FaMoneyBillWave,
  FaClock, FaCheckCircle, FaReceipt, FaTimes, FaCar, FaWrench
} from 'react-icons/fa'
import { useMechanicEarnings } from '../../hooks/useJobHooks'

/* ── Bar chart column ── */
function BarColumn({ height, label, amount }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-2 group">
      <div className="relative w-full flex items-end" style={{ height: '100px' }}>
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22,1,0.36,1] }}
          className="w-full rounded-t-lg bg-gradient-to-t from-champagne/20 to-champagne/40 group-hover:from-champagne/35 group-hover:to-champagne/60 transition-all relative"
        >
          {/* Tooltip */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface border border-champagne/30 text-champagne text-[10px] font-heading font-700 px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            ₹{amount}
          </div>
        </motion.div>
      </div>
      <span className="text-label text-text-muted">{label}</span>
    </div>
  )
}

export default function Earnings({ setTab }) {
  const { data, isLoading } = useMechanicEarnings()
  const [selectedJob, setSelectedJob] = useState(null)

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-6 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(n => <div key={n} className="h-28 skeleton rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="h-80 skeleton rounded-2xl" />
          <div className="lg:col-span-2 h-80 skeleton rounded-2xl" />
        </div>
      </div>
    )
  }

  const { stats, history = [] } = data || {}

  const barData = [40, 60, 45, 80, 50, 90, 75].map((h, i) => ({
    height: h, label: 'SMTWTFS'[i], amount: (h * 100).toLocaleString()
  }))

  return (
    <div className="max-w-5xl space-y-8 pb-10">

      {/* ── Editorial header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-label text-text-muted mb-1">Financial Overview</p>
        <h2 className="font-display text-4xl text-white font-300">
          Earnings<span className="text-gradient-gold italic"> Dashboard</span>
        </h2>
      </motion.div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'This Month',   value: `₹${stats?.month?.toLocaleString('en-IN') || 0}`,  accent: 'text-champagne', icon: '💰' },
          { label: 'Today',        value: `₹${stats?.today?.toLocaleString('en-IN') || 0}`,  accent: 'text-sage',      icon: '📅' },
          { label: 'This Week',    value: `₹${stats?.week?.toLocaleString('en-IN') || 0}`,   accent: 'text-slate',     icon: '📈' },
          { label: 'Jobs Done',    value: `${stats?.completed || 0}`,                          accent: 'text-white',     icon: '✅' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 * i, duration: 0.5, ease: [0.22,1,0.36,1] }}
            className="stat-card hover:border-white/12 cursor-default"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-2xl">{s.icon}</span>
            </div>
            <p className={`font-display text-2xl font-400 ${s.accent} leading-none mb-1`}>
              {s.value}
            </p>
            <p className="text-label text-text-muted">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="card rounded-2xl p-6"
        >
          <p className="text-label text-champagne mb-1">Weekly Performance</p>
          <p className="font-display text-2xl text-white font-300 mb-6">
            ₹{stats?.week?.toLocaleString('en-IN') || 0}
          </p>

          <div className="flex items-end gap-2 h-28 mb-2 border-b border-border pb-2">
            {barData.map((b, i) => <BarColumn key={i} {...b} />)}
          </div>

          <p className="text-label text-text-muted text-center mt-4">
            Performance vs. last week
          </p>
        </motion.div>

        {/* Earning history list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.22,1,0.36,1] }}
          className="lg:col-span-2 card rounded-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
            <div>
              <p className="text-label text-champagne mb-1">Transaction Log</p>
              <h3 className="font-heading font-700 text-white">Earning History</h3>
            </div>
            <span className="text-label text-text-muted">{history.length} records</span>
          </div>

          <div className="max-h-[420px] overflow-y-auto custom-scrollbar divide-y divide-border">
            {history.length === 0 ? (
              <div className="py-16 text-center">
                <FaReceipt className="text-3xl text-white/10 mx-auto mb-3" />
                <p className="text-label text-text-muted">No earnings recorded yet</p>
              </div>
            ) : history.map((j, i) => (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                onClick={() => setSelectedJob(j)}
                className="flex items-center gap-4 px-6 py-4 hover:bg-white/3 cursor-pointer group transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-champagne group-hover:border-champagne/25 transition-all shrink-0">
                  <FaReceipt className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-600 text-white group-hover:text-champagne transition-colors truncate">
                    {j.vehicle}
                    <span className="text-text-muted font-400 text-xs ml-2">REQ-{j.requestId?.toString().slice(-6).toUpperCase()}</span>
                  </p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <p className="text-label text-text-muted">
                      {new Date(j.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                    <span className={`badge ${j.payoutStatus === 'Released' ? 'badge-green' : 'badge-gold'}`}>
                      {j.payoutStatus || 'Pending'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading font-700 text-white text-base">₹{j.total?.toLocaleString('en-IN')}</p>
                  <p className="text-label text-sage">Your cut</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Breakdown modal ── */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-void/85 backdrop-blur-luxury"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
              className="relative w-full max-w-md glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10"
            >
              <div className="bg-gradient-to-r from-champagne/8 to-transparent px-6 py-5 border-b border-white/6 flex items-center justify-between">
                <div>
                  <p className="text-label text-champagne mb-1">Earning Breakdown</p>
                  <h3 className="font-heading font-700 text-white">{selectedJob.vehicle}</h3>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-border">
                  <span className="text-sm text-text-muted">Labor Charges (Total)</span>
                  <span className="text-sm font-600 text-white">₹{selectedJob.laborCharges?.toLocaleString('en-IN')}</span>
                </div>

                <div className="card-gold rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <p className="text-label text-champagne">Your Commission (60%)</p>
                    <p className="text-[10px] text-text-muted font-heading">Platform revenue share</p>
                  </div>
                  <p className="font-display text-2xl text-champagne font-400">
                    ₹{selectedJob.earning?.toLocaleString('en-IN')}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Performance Bonus</span>
                    <span className="text-sage font-600">+₹{selectedJob.bonus || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-text-muted">Customer Tips</span>
                    <span className="text-sage font-600">+₹{selectedJob.tips || 0}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-end">
                  <div>
                    <p className="text-label text-text-muted mb-1">Total Job Earnings</p>
                    <p className="font-display text-3xl text-white font-300">
                      ₹{selectedJob.total?.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`badge ${selectedJob.payoutStatus === 'Released' ? 'badge-green' : 'badge-gold'}`}>
                    {selectedJob.payoutStatus || 'Pending'}
                  </span>
                </div>
              </div>

              <div className="px-6 pb-5 text-center">
                <p className="text-label text-text-muted">Payouts processed weekly every Monday</p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
