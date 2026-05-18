import { motion } from 'framer-motion'
import { FaCheckCircle, FaCar, FaReceipt, FaClock, FaArrowUp } from 'react-icons/fa'
import { useMechanicEarnings } from '../../hooks/useJobHooks'

export default function History() {
  const { data, isLoading } = useMechanicEarnings()
  const history = data?.history || []

  if (isLoading) {
    return (
      <div className="max-w-5xl space-y-4 pb-10">
        <div className="h-12 skeleton rounded-xl w-48" />
        <div className="h-[500px] skeleton rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl space-y-8 pb-10">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-label text-text-muted mb-1">Mechanic Records</p>
        <h2 className="font-display text-4xl text-white font-300">
          Service<span className="text-gradient-gold italic"> History</span>
        </h2>
      </motion.div>

      {/* Table card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.22,1,0.36,1] }}
        className="card rounded-2xl overflow-hidden"
      >
        {history.length === 0 ? (
          <div className="py-24 text-center">
            <div className="w-16 h-16 card rounded-full flex items-center justify-center mx-auto mb-5">
              <FaReceipt className="text-2xl text-white/10" />
            </div>
            <p className="font-display text-2xl text-white/40 mb-2">No history yet</p>
            <p className="text-label text-text-muted">Your completed jobs will appear here after you finish your first assignment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-label text-text-muted font-700">Vehicle</th>
                  <th className="px-6 py-4 text-label text-text-muted font-700">Description</th>
                  <th className="px-6 py-4 text-label text-text-muted font-700">Completed</th>
                  <th className="px-6 py-4 text-label text-text-muted font-700 text-right">Earned</th>
                  <th className="px-6 py-4 text-label text-text-muted font-700 text-right">Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {history.map((job, i) => (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                    className="group hover:bg-white/2 transition-colors"
                  >
                    {/* Vehicle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-champagne group-hover:border-champagne/25 transition-all">
                          <FaCar className="text-sm" />
                        </div>
                        <div>
                          <p className="text-sm font-600 text-white group-hover:text-champagne transition-colors">
                            {job.vehicle}
                          </p>
                          <p className="text-label text-champagne">
                            REQ-{job.requestId?.toString().slice(-6).toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 max-w-[220px]">
                      <p className="text-sm text-text-muted italic truncate">
                        "{job.description || 'Service completed'}"
                      </p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <p className="text-label text-text-muted">
                        {new Date(job.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </td>

                    {/* Earned */}
                    <td className="px-6 py-4 text-right">
                      <p className="font-heading font-700 text-white text-base">
                        ₹{job.total?.toLocaleString('en-IN')}
                      </p>
                      <p className="text-label text-sage">Total</p>
                    </td>

                    {/* Payout status */}
                    <td className="px-6 py-4 text-right">
                      <span className={`badge ${job.payoutStatus === 'Released' ? 'badge-green' : 'badge-gold'}`}>
                        {job.payoutStatus === 'Released'
                          ? <><FaCheckCircle className="text-[9px]" /> Released</>
                          : <><FaClock className="text-[9px]" /> Pending</>
                        }
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
