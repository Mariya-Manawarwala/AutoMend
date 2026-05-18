import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWrench, FaCheckCircle, FaMoneyBillWave, FaUser, FaTools, FaMapMarkerAlt, FaCalendarAlt, FaTimes, FaPhone, FaCar } from 'react-icons/fa'
import { useActiveJobs } from '../../hooks/useAdminHooks'
import PillSelector from '../../components/common/PillSelector'

export default function Jobs() {
  const { data: jobs = [], isLoading } = useActiveJobs()
  const [filter, setFilter] = useState('all')
  const [selectedJob, setSelectedJob] = useState(null)

  const filtered = filter === 'all' 
    ? jobs 
    : jobs.filter(j => j.jobStatus.toLowerCase() === filter.toLowerCase())

  if (isLoading) return (
    <div className="flex flex-col gap-4">
      {[1,2,3].map(i => <div key={i} className="h-24 bg-card/50 rounded-2xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PillSelector 
          value={filter} 
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All Jobs' },
            { value: 'InProgress', label: 'In Progress' },
            { value: 'Completed', label: 'Completed' }
          ]}
        />
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">Live Tracking</p>
          <p className="text-xs font-bold text-white flex items-center gap-2 justify-end">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            {jobs.filter(j => j.jobStatus === 'InProgress').length} Active Repairs
          </p>
        </div>
      </div>

      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[900px]">
          <thead>
            <tr className="border-b border-white/10 text-sm text-text-muted uppercase tracking-wider">
              <th className="pb-4 pl-4 font-semibold">Job ID & Details</th>
              <th className="pb-4 font-semibold">Customer</th>
              <th className="pb-4 font-semibold">Mechanic</th>
              <th className="pb-4 font-semibold">Repair Status</th>
              <th className="pb-4 font-semibold">Payment Status</th>
              <th className="pb-4 pr-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((job, i) => (
              <motion.tr key={job._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-soft-dark border border-white/10 flex items-center justify-center text-xl ${job.jobStatus === 'InProgress' ? 'text-gold' : 'text-emerald-400'}`}>
                      <FaWrench />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tighter">JOB-{job._id.slice(-6)}</p>
                      <p className="text-xs text-text-muted mt-0.5">{job.requestId?.vehicle?.brand} {job.requestId?.vehicle?.model}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <FaUser className="text-text-muted text-[10px]" />
                    <span className="text-sm font-bold text-white">{job.customerId?.name}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-sm font-bold text-gold">{job.mechanicId?.name}</span>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${job.jobStatus === 'InProgress' ? 'bg-gold/10 text-gold border-gold/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                    {job.jobStatus === 'InProgress' ? 'In Progress' : <><FaCheckCircle /> Completed</>}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${job.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {job.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <button 
                    onClick={() => setSelectedJob(job)}
                    className="px-4 py-1.5 bg-soft-dark border border-white/10 text-white text-xs font-bold rounded-lg hover:border-gold/50 hover:text-gold transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && <div className="py-12 text-center text-text-muted">No jobs found for this filter.</div>}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedJob(null)} className="absolute inset-0 bg-deep-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-card border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]">
              
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-soft-dark/30">
                <div>
                  <h3 className="text-xl font-heading font-bold text-white">Job Details</h3>
                  <p className="text-[10px] font-black text-gold uppercase tracking-widest">JOB-{selectedJob._id}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-text-muted hover:text-white transition-colors text-2xl"><FaTimes /></button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Status Card */}
                <div className="bg-soft-dark/50 p-4 rounded-2xl border border-white/5 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                      <FaCar />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Repair Status</p>
                      <p className="text-sm font-bold text-white uppercase">{selectedJob.jobStatus}</p>
                    </div>
                  </div>
                  <div className="text-left md:text-center">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Payment Status</p>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${selectedJob.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {selectedJob.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                    </span>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Started At</p>
                    <p className="text-sm font-bold text-white">{new Date(selectedJob.startedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Customer Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-2">
                      <FaUser /> Customer Information
                    </h4>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                      <p className="text-sm font-bold text-white">{selectedJob.customerId?.name}</p>
                      <p className="text-xs text-text-muted flex items-center gap-2"><FaPhone className="text-[10px]" /> {selectedJob.customerId?.phone}</p>
                      <p className="text-xs text-text-muted flex items-center gap-2"><FaMapMarkerAlt className="text-[10px]" /> {selectedJob.requestId?.location?.address}</p>
                    </div>
                  </div>

                  {/* Mechanic Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-2">
                      <FaWrench /> Assigned Mechanic
                    </h4>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2">
                      <p className="text-sm font-bold text-white">{selectedJob.mechanicId?.name}</p>
                      <p className="text-xs text-text-muted flex items-center gap-2"><FaPhone className="text-[10px]" /> {selectedJob.mechanicId?.phone}</p>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-tighter bg-gold/10 px-2 py-0.5 rounded inline-block">Verified Expert</p>
                    </div>
                  </div>
                </div>

                {/* Repair Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black text-gold uppercase tracking-widest flex items-center gap-2">
                    <FaTools /> Repair Specifications
                  </h4>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Issue Description</p>
                      <p className="text-sm text-white italic">"{selectedJob.requestId?.description}"</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                      <div>
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Requested Services</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.requestId?.serviceIds?.length > 0 ? (
                            selectedJob.requestId.serviceIds.map(s => (
                              <span key={s._id} className="px-3 py-1 bg-soft-dark border border-white/10 rounded-lg text-[10px] font-bold text-white">
                                {s.title}
                              </span>
                            ))
                          ) : selectedJob.servicesUsed?.length > 0 ? (
                            selectedJob.servicesUsed.map((s, idx) => (
                              <span key={s._id || idx} className="px-3 py-1 bg-soft-dark border border-white/10 rounded-lg text-[10px] font-bold text-white">
                                {s.name}
                              </span>
                            ))
                          ) : (
                            <span className="px-3 py-1 bg-soft-dark border border-white/10 rounded-lg text-[10px] font-bold text-white capitalize">
                              {selectedJob.requestId?.serviceType || 'General Service'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">Estimated Cost</p>
                        <p className="text-xl font-heading font-bold text-gold">₹{selectedJob.requestId?.estimatedCost?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-soft-dark/30 border-t border-white/5 flex justify-end gap-3">
                <button onClick={() => setSelectedJob(null)} className="px-6 py-2.5 text-xs font-black uppercase tracking-widest text-text-muted hover:text-white transition-colors">Close</button>
                {selectedJob.jobStatus === 'Completed' && (
                  <button className="px-6 py-2.5 bg-gold text-deep-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all flex items-center gap-2">
                    <FaMoneyBillWave /> View Final Invoice
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
