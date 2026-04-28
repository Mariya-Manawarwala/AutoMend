import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaWrench, FaCheckCircle, FaMoneyBillWave } from 'react-icons/fa'

const MOCK_JOBS = [
  { id: 'JOB-4050', req: 'REQ-1049', mechanic: 'James Rodriguez', vehicle: '2023 Tesla Model 3', cost: '₹0 (In Progress)', status: 'in_progress', date: 'Today' },
  { id: 'JOB-4049', req: 'REQ-1048', mechanic: 'David Smith', vehicle: '2021 Porsche Macan', cost: '₹12,450', status: 'completed', date: 'Yesterday' },
  { id: 'JOB-4048', req: 'REQ-1045', mechanic: 'James Rodriguez', vehicle: '2019 Audi A6', cost: '₹8,990', status: 'completed', date: 'May 20, 2026' },
]

export default function Jobs() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? MOCK_JOBS : MOCK_JOBS.filter(j => j.status === filter)

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-max">
        {['all', 'in_progress', 'completed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-5 py-2 text-sm font-medium rounded-lg capitalize transition-all ${filter === f ? 'bg-card text-white shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 text-sm text-text-muted uppercase tracking-wider">
              <th className="pb-4 pl-4 font-semibold">Job ID & Details</th>
              <th className="pb-4 font-semibold">Assigned Mechanic</th>
              <th className="pb-4 font-semibold">Total Cost</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 pr-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job, i) => (
              <motion.tr key={job.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-soft-dark border border-white/10 flex items-center justify-center text-xl ${job.status === 'in_progress' ? 'text-gold' : 'text-emerald-400'}`}>
                      <FaWrench />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{job.id} <span className="text-text-muted font-normal text-xs">• {job.req}</span></p>
                      <p className="text-xs text-text-muted mt-0.5">{job.vehicle}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm font-bold text-gold">{job.mechanic}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-text-muted" />
                    <span className="text-sm font-bold text-white">{job.cost}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${job.status === 'in_progress' ? 'bg-gold/10 text-gold border-gold/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {job.status === 'in_progress' ? 'In Progress' : <><FaCheckCircle /> Completed</>}
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <button className="px-4 py-1.5 bg-soft-dark border border-white/10 text-white text-xs font-bold rounded-lg hover:border-gold/50 hover:text-gold transition-colors">
                    View Invoice
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && <div className="py-12 text-center text-text-muted">No jobs found for this filter.</div>}
      </div>

    </div>
  )
}
