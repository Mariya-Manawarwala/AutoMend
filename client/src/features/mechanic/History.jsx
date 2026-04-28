import { motion } from 'framer-motion'
import { FaCheckCircle, FaCar } from 'react-icons/fa'

const COMPLETED_JOBS = [
  { id: 'REQ-1022', vehicle: '2021 Porsche Macan', service: 'Full Synthetic Oil Change', date: 'May 18, 2026', revenue: '₹4,299', rating: 5 },
  { id: 'REQ-1015', vehicle: '2019 Audi A6', service: 'Brake Pad Replacement', date: 'May 14, 2026', revenue: '₹12,500', rating: 4.8 },
  { id: 'REQ-1008', vehicle: '2022 Honda City', service: 'AC Gas Refill', date: 'May 05, 2026', revenue: '₹3,200', rating: 5 },
]

export default function History() {
  return (
    <div className="max-w-5xl space-y-6 pb-10">
      
      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-sm text-text-muted">
              <th className="pb-4 pl-4 font-semibold">Job ID & Vehicle</th>
              <th className="pb-4 font-semibold">Service Performed</th>
              <th className="pb-4 font-semibold">Date Completed</th>
              <th className="pb-4 font-semibold">Revenue</th>
              <th className="pb-4 pr-4 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {COMPLETED_JOBS.map((job, i) => (
              <motion.tr key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-soft-dark border border-white/10 flex items-center justify-center text-text-muted group-hover:text-gold transition-colors"><FaCar /></div>
                    <div>
                      <p className="text-sm font-bold text-white">{job.vehicle}</p>
                      <p className="text-xs text-gold">{job.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-text-muted">{job.service}</td>
                <td className="py-4 text-sm text-text-muted">{job.date}</td>
                <td className="py-4 text-sm font-bold text-emerald-400">{job.revenue}</td>
                <td className="py-4 pr-4 text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <FaCheckCircle /> Cleared
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}
