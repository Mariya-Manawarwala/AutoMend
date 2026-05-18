import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWrench, FaCheck, FaTimes, FaEnvelope, FaBriefcase, FaIdBadge, FaPhone, FaMapMarkerAlt, FaToolbox, FaCalendarAlt, FaStar, FaMoneyBillWave } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { useAdminMechanics, useUpdateMechanicStatus } from '../../hooks/useDashboardHooks'
import { useAllMechanics } from '../../hooks/useAdminHooks'
import PillSelector from '../../components/common/PillSelector'

export default function Mechanics() {
  const { addToast } = useToast()
  const [view, setView] = useState('applications')
  const { data: pendingRequests = [], isLoading: pendingLoading } = useAdminMechanics('pending')
  const { data: allMechanics = [], isLoading: allLoading } = useAllMechanics()
  const statusMutation = useUpdateMechanicStatus()
  
  const [selectedMechanic, setSelectedMechanic] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleAction = async (id, action, reason = '') => {
    try {
      await statusMutation.mutateAsync({ 
        mechanicId: id, 
        status: action === 'approve' ? 'approved' : 'rejected',
        reason
      })
      addToast(`Mechanic ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'success')
      setSelectedMechanic(null)
      setShowRejectModal(null)
      setRejectionReason('')
    } catch (error) {
      addToast('Action failed', 'error')
    }
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      <div className="flex justify-between items-center bg-card/80 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-heading font-black text-white italic uppercase tracking-tight">Mechanic Hub</h2>
          <PillSelector 
            value={view}
            onChange={setView}
            options={[
              { value: 'applications', label: `Applications (${pendingRequests.length})` },
              { value: 'performance', label: 'Partner Performance' }
            ]}
          />
        </div>
      </div>

      {view === 'applications' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {pendingLoading ? (
             <div className="col-span-full py-20 text-center text-text-muted">Loading applications...</div>
           ) : pendingRequests.length === 0 ? (
             <div className="col-span-full py-24 text-center bg-card/40 rounded-[3rem] border border-dashed border-white/10">
               <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                 <FaCheck className="text-3xl text-emerald-400" />
               </div>
               <p className="text-xl font-heading font-black text-white italic uppercase tracking-tight">All Caught Up!</p>
               <p className="text-xs font-bold text-text-muted mt-2 uppercase tracking-widest">There are no pending mechanic applications.</p>
             </div>
           ) : pendingRequests.map((req, i) => (
             <motion.div key={req._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
               className="bg-card/80 backdrop-blur-md rounded-[2rem] p-7 border border-white/5 relative overflow-hidden group hover:border-gold/30 transition-all cursor-pointer"
               onClick={() => setSelectedMechanic(req)}
             >
               <div className="flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-2xl bg-soft-dark flex items-center justify-center text-gold overflow-hidden border border-white/5">
                   {req.profilePhoto ? <img src={req.profilePhoto} className="w-full h-full object-cover" alt="" /> : <FaWrench className="text-2xl" />}
                 </div>
                 <div>
                   <h4 className="text-xl font-heading font-black text-white leading-tight">{req.name}</h4>
                   <p className="text-[10px] text-gold font-black uppercase tracking-widest mt-1">Pending Review</p>
                 </div>
               </div>
               <div className="space-y-3 mb-8">
                  <div className="flex justify-between p-3.5 rounded-2xl bg-soft-dark/50 border border-white/5 text-xs font-black text-text-muted uppercase">
                    <span>Experience</span>
                    <span className="text-white italic">{req.experience || 0} Years</span>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-3" onClick={e => e.stopPropagation()}>
                 <button onClick={() => setShowRejectModal(req._id)} className="py-3 bg-red-500/10 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">Reject</button>
                 <button onClick={() => handleAction(req._id, 'approve')} className="py-3 bg-emerald-500 text-deep-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-lg transition-all">Approve</button>
               </div>
             </motion.div>
           ))}
        </div>
      ) : (
        <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-black text-text-muted uppercase tracking-widest">
                <th className="pb-4 pl-4">Mechanic</th>
                <th className="pb-4">Specialty</th>
                <th className="pb-4">Total Jobs</th>
                <th className="pb-4">Rating</th>
                <th className="pb-4 pr-4 text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {allLoading ? (
                <tr><td colSpan="5" className="py-10 text-center text-text-muted">Loading partners...</td></tr>
              ) : allMechanics.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-text-muted">No partners registered yet.</td></tr>
              ) : allMechanics.map((m, i) => (
                <motion.tr key={m._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="py-5 pl-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-soft-dark flex items-center justify-center text-gold overflow-hidden">
                       {m.profilePhoto ? <img src={m.profilePhoto} className="w-full h-full object-cover" alt="" /> : <FaWrench />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase">{m.name}</p>
                      <p className="text-[9px] text-text-muted font-black uppercase tracking-tighter">ID: {m._id.slice(-6)}</p>
                    </div>
                  </td>
                  <td className="py-5 text-xs text-white font-medium">{m.skills?.[0] || 'General Repair'}</td>
                  <td className="py-5">
                    <span className="text-sm font-black text-white italic">{m.totalJobs || 0} <span className="text-[10px] text-text-muted font-normal ml-1">Jobs Done</span></span>
                  </td>
                  <td className="py-5">
                    <div className="flex items-center gap-1 text-gold">
                      <FaStar className="text-[10px]" />
                      <span className="text-sm font-black italic">{m.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="py-5 pr-4 text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/10 border border-gold/20 rounded-lg">
                       <FaMoneyBillWave className="text-gold text-[10px]" />
                       <span className="text-sm font-black text-gold">₹{(m.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedMechanic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedMechanic(null)}
              className="absolute inset-0 bg-deep-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-card rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="h-32 bg-gradient-to-r from-gold/20 via-sierra/20 to-gold/20 relative">
                <button onClick={() => setSelectedMechanic(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-deep-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-colors z-10"><FaTimes /></button>
              </div>
              
              <div className="px-10 pb-10 relative">
                <div className="absolute -top-12 left-10 w-24 h-24 rounded-3xl bg-soft-dark border-4 border-card shadow-2xl flex items-center justify-center text-4xl text-gold overflow-hidden">
                  {selectedMechanic.profilePhoto ? <img src={selectedMechanic.profilePhoto} className="w-full h-full object-cover" alt="" /> : <FaIdBadge />}
                </div>

                <div className="pt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-3xl font-heading font-black text-white italic uppercase">{selectedMechanic.name}</h3>
                    <p className="text-gold font-black uppercase tracking-widest text-xs mt-1">Professional Mechanic</p>
                    
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold"><FaEnvelope /></div>
                        {selectedMechanic.email}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold"><FaPhone /></div>
                        {selectedMechanic.phone}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-text-muted">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gold"><FaMapMarkerAlt /></div>
                        {selectedMechanic.address || 'Location not specified'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="p-5 rounded-[2rem] bg-soft-dark/50 border border-white/5">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><FaToolbox className="text-gold" /> Expertise & Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedMechanic.skills?.map(s => (
                          <span key={s} className="px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-xl text-[10px] font-black text-gold uppercase tracking-widest">{s}</span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-[2rem] bg-soft-dark/50 border border-white/5 text-center">
                        <FaBriefcase className="text-gold text-xl mx-auto mb-2" />
                        <p className="text-[10px] font-black text-text-muted uppercase">Exp</p>
                        <p className="text-xl font-black text-white">{selectedMechanic.experience || 0}Y</p>
                      </div>
                      <div className="p-5 rounded-[2rem] bg-soft-dark/50 border border-white/5 text-center">
                        <FaCalendarAlt className="text-gold text-xl mx-auto mb-2" />
                        <p className="text-[10px] font-black text-text-muted uppercase">Joined</p>
                        <p className="text-xs font-black text-white">{new Date(selectedMechanic.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                  <button 
                    onClick={() => setShowRejectModal(selectedMechanic._id)}
                    className="flex-1 py-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-2xl text-xs font-black uppercase tracking-widest text-red-400 transition-all"
                  >
                    Reject Application
                  </button>
                  <button 
                    onClick={() => handleAction(selectedMechanic._id, 'approve')}
                    className="flex-1 py-4 bg-gold text-deep-black rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(200,155,60,0.4)] transition-all"
                  >
                    Confirm Approval
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Reason Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(null)}
              className="absolute inset-0 bg-deep-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-card rounded-[2.5rem] border border-white/10 shadow-2xl p-8"
            >
              <h3 className="text-2xl font-heading font-black text-white italic uppercase mb-2">Rejection Reason</h3>
              <p className="text-xs text-text-muted mb-6 uppercase tracking-widest font-bold">Please provide a valid reason for declining this applicant.</p>
              
              <textarea 
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Ex: Insufficient experience or missing certification details..."
                className="w-full h-32 bg-soft-dark border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-red-500/50 transition-all resize-none mb-6"
              />

              <div className="flex gap-3">
                <button onClick={() => setShowRejectModal(null)} className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10">Cancel</button>
                <button 
                  disabled={!rejectionReason.trim() || statusMutation.isPending}
                  onClick={() => handleAction(showRejectModal, 'reject', rejectionReason)}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                >
                  Confirm Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
