import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWrench, FaCheck, FaCar, FaMapMarkerAlt, FaCogs, FaTools, FaPlus, FaMinus, FaTimes, FaChevronDown, FaUser, FaPhone, FaCheckCircle } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { SERVICES } from '../../data/constants'
import { useJobDetails, useUpdateJobStatus, useSubmitBill, useUpdateMechanicLocation, useGenerateFinalInvoice } from '../../hooks/useJobHooks'
import { useServices } from '../../hooks/useServiceHooks'
import { useParts } from '../../hooks/usePartHooks'

const JOB_STATUSES = [
  { value: 'Accepted', label: 'Accepted', color: 'text-blue-400' },
  { value: 'Arrived', label: 'Arrived at Location', color: 'text-indigo-400' },
  { value: 'InProgress', label: 'In Progress', color: 'text-gold' },
  { value: 'Completed', label: 'Work Finished', color: 'text-emerald-400' },
]

export default function MyJobs() {
  const { addToast } = useToast()
  
  // In a real app, you'd get the current active job ID from context or selection
  const activeJobId = localStorage.getItem('activeJobId') 
  const { data: job, isLoading } = useJobDetails(activeJobId)
  const { data: dbServices = [] } = useServices()
  const { data: dbParts = [] } = useParts()

  const updateStatusMutation = useUpdateJobStatus()
  const submitBillMutation = useSubmitBill()
  const updateLocationMutation = useUpdateMechanicLocation()
  const generateInvoiceMutation = useGenerateFinalInvoice()
  
  const [selectedServices, setSelectedServices] = useState([])
  const [usedParts, setUsedParts] = useState([])
  const [showPartsDropdown, setShowPartsDropdown] = useState(false)
  const [showServicesDropdown, setShowServicesDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [billingStatus, setBillingStatus] = useState('idle')

  // Background Location Tracking for Home Services
  useEffect(() => {
    let intervalId;
    
    const trackLocation = () => {
      if (navigator.geolocation && job && job.jobStatus === 'InProgress') {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateLocationMutation.mutate({
              id: job._id,
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            });
          },
          (error) => console.error("Tracking Error:", error),
          { enableHighAccuracy: true }
        );
      }
    };

    if (job && job.jobStatus === 'InProgress' && job.requestId?.serviceType !== 'garage') {
      trackLocation();
      intervalId = setInterval(trackLocation, 30000); // Update every 30 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [job?.jobStatus, job?._id]);

  useEffect(() => {
    if (job) {
      // Sync with DB data
      setSelectedServices(job.servicesUsed || [])
      setUsedParts(job.partsUsed || [])
      setBillingStatus(job.billSubmitted ? 'success' : 'idle')
    }
  }, [job])

  const handleStatusChange = async (newStatus) => {
    try {
      await updateStatusMutation.mutateAsync({ id: job._id, status: newStatus })
      addToast(`Status updated to ${newStatus}`, 'success')
      setShowStatusDropdown(false)
    } catch (error) {
      addToast('Failed to update status', 'error')
    }
  }

  // Cost calculations
  const servicesCost = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0)
  const partsCost = usedParts.reduce((total, p) => total + (p.price * p.quantity), 0)
  const totalCost = servicesCost + partsCost

  const handleAddService = (service) => {
    if (selectedServices.find(s => s.serviceId === service._id)) {
      addToast('Service already added', 'info')
      return
    }
    setSelectedServices([...selectedServices, { 
      serviceId: service._id, 
      name: service.name, 
      price: service.basePrice 
    }])
    setShowServicesDropdown(false)
  }

  const handleRemoveService = (id) => {
    setSelectedServices(prev => prev.filter(s => s.serviceId !== id))
  }

  const handleAddPart = (part) => {
    const existing = usedParts.find(p => p.partId === part._id)
    if (existing) {
      setUsedParts(prev => prev.map(p => p.partId === part._id ? { ...p, quantity: p.quantity + 1 } : p))
    } else {
      setUsedParts([...usedParts, { 
        partId: part._id, 
        name: part.name, 
        price: part.unitPrice, 
        quantity: 1,
        partNumber: part.partNumber || 'N/A'
      }])
    }
    setShowPartsDropdown(false)
  }

  const handleUpdateQty = (id, delta) => {
    setUsedParts(prev => prev.map(p => {
      if (p.partId === id) {
        const newQty = p.quantity + delta
        return newQty > 0 ? { ...p, quantity: newQty } : p
      }
      return p
    }))
  }

  const handleRemovePart = (id) => setUsedParts(prev => prev.filter(p => p.partId !== id))

  const handleSubmitBill = async () => {
    try {
      setBillingStatus('submitting')
      await submitBillMutation.mutateAsync({ 
        id: job._id, 
        data: { servicesUsed: selectedServices, partsUsed: usedParts } 
      })
      setBillingStatus('awaiting_payment')
      addToast('Bill Submitted. Awaiting Customer Payment.', 'success')
    } catch (error) {
      setBillingStatus('idle')
      addToast('Failed to submit bill', 'error')
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      await generateInvoiceMutation.mutateAsync(job._id)
      addToast('Professional Invoice Generated!', 'success')
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to generate invoice', 'error')
    }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  )

  if (!job) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-3xl text-gold">
         <FaWrench />
      </div>
      <h3 className="text-xl font-heading font-black text-white italic uppercase tracking-tight mb-2">No Active Job Found</h3>
      <p className="text-sm text-text-muted max-w-xs mx-auto uppercase tracking-widest font-black text-[10px] leading-relaxed">
        You don't have any ongoing repair jobs at the moment. Head over to Available Requests to pick up a new task.
      </p>
    </div>
  )

  const isLocked = billingStatus === 'success' || job?.billSubmitted

  return (
    <div className="flex flex-col lg:flex-row gap-4 pb-10 h-full">
      
      {/* LEFT: Job Details */}
      <div className="w-full lg:w-1/3 space-y-4 flex flex-col">
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-gold/20 shadow-[0_0_20px_rgba(200,155,60,0.1)] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-bold text-white">Active Job</h3>
            
            <div className="relative">
              <button 
                onClick={() => !isLocked && setShowStatusDropdown(!showStatusDropdown)}
                disabled={isLocked}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-soft-dark border text-[10px] font-black uppercase tracking-widest transition-all ${isLocked ? 'text-text-muted border-white/5 opacity-50 cursor-not-allowed' : 'text-gold border-white/10 hover:border-gold/50'}`}
              >
                {job.jobStatus || 'Update Status'} {!isLocked && <FaChevronDown className={`transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />}
              </button>
              
              <AnimatePresence>
                {showStatusDropdown && !isLocked && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-48 bg-deep-black border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {JOB_STATUSES.map(s => (
                      <button key={s.value} onClick={() => handleStatusChange(s.value)} className="w-full text-left px-4 py-3 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest text-white border-b border-white/5 last:border-0 flex items-center justify-between group">
                        <span className={s.color}>{s.label}</span>
                        {job.jobStatus === s.value && <FaCheck className="text-gold" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full aspect-video rounded-xl bg-soft-dark border border-white/5 overflow-hidden mb-6">
            {job.requestId?.vehicle?.image ? (
              <img src={job.requestId.vehicle.image} alt="Vehicle" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaCar className="text-5xl text-white/10" />
              </div>
            )}
          </div>

          <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">JOB-{job._id.slice(-6)}</p>
          <h4 className="text-2xl font-heading font-bold text-white mb-4">{job.requestId?.vehicle?.brand} {job.requestId?.vehicle?.model}</h4>
          
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Reported Issue</p>
              <p className="text-sm font-medium text-white italic">"{job.requestId?.description}"</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Location</p>
              <p className="text-sm font-medium text-white">{job.requestId?.location?.address}</p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg text-white">
                <FaUser className="text-[10px]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Customer</p>
                <p className="text-xs font-bold text-white">{job.customerId?.name}</p>
              </div>
              <a href={`tel:${job.customerId?.phone}`} className="ml-auto w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all">
                <FaPhone />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Work Panel */}
      <div className="w-full lg:w-2/3 h-[78vh] bg-card/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="p-4 border-b border-white/5 relative z-10 shrink-0 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-3"><FaCogs className="text-gold" /> {isLocked ? 'Final Repair Log' : 'Live Work Panel'}</h3>
            <p className="text-sm text-text-muted">{isLocked ? 'This job is completed and billing is finalized.' : 'Manage repair logs and generate final invoice.'}</p>
          </div>
          <div className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${job.jobStatus === 'InProgress' ? 'bg-gold/10 text-gold border-gold/20' : 'bg-white/5 text-text-muted border-white/10'}`}>
            {job.jobStatus}
          </div>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar relative z-10 space-y-8">
          
          {/* Services Rendered */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-widest">Services Rendered</h4>
              {!isLocked && (
                <div className="relative">
                  <button onClick={() => setShowServicesDropdown(!showServicesDropdown)} className="px-4 py-2 bg-soft-dark border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:border-gold/30 transition-colors flex items-center gap-2">
                    <FaPlus className="text-gold" /> Add Service
                  </button>
                  <AnimatePresence>
                    {showServicesDropdown && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-64 bg-deep-black border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                        {dbServices.map(s => (
                          <button key={s._id} onClick={() => handleAddService(s)} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs text-white border-b border-white/5 last:border-0 flex justify-between group">
                            <span className="group-hover:text-gold transition-colors">{s.name}</span><span className="text-text-muted">₹{s.basePrice}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedServices.map(s => (
                <div key={s.serviceId} className="p-4 rounded-xl border bg-gold/5 border-gold/30 flex items-center justify-between shadow-[0_0_15px_rgba(200,155,60,0.1)]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-soft-dark border border-white/10 flex items-center justify-center text-gold">
                      <FaTools />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{s.name}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">Charge: ₹{s.price}</p>
                    </div>
                  </div>
                  {!isLocked && <button onClick={() => handleRemoveService(s.serviceId)} className="text-red-400 hover:text-red-300 p-2"><FaTimes /></button>}
                </div>
              ))}
              {selectedServices.length === 0 && <p className="text-sm text-text-muted italic py-4 col-span-full">No services added to this job yet.</p>}
            </div>
          </div>

          {/* Parts Selection */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-black text-gold uppercase tracking-widest">Parts Used</h4>
              {!isLocked && (
                <div className="relative">
                  <button onClick={() => setShowPartsDropdown(!showPartsDropdown)} className="px-4 py-2 bg-soft-dark border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-white hover:border-gold/30 transition-colors flex items-center gap-2">
                    <FaPlus className="text-gold" /> Add Part
                  </button>
                  <AnimatePresence>
                    {showPartsDropdown && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-64 bg-deep-black border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                        {dbParts.map(p => (
                          <button key={p._id} onClick={() => handleAddPart(p)} className="w-full text-left px-4 py-3 hover:bg-white/5 text-xs text-white border-b border-white/5 last:border-0 flex justify-between group">
                            <span className="group-hover:text-gold transition-colors">{p.name}</span><span className="text-text-muted">₹{p.unitPrice}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {usedParts.map(p => (
                  <motion.div key={p.partId} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} 
                    className="flex items-center justify-between p-4 rounded-xl bg-soft-dark border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest">₹{p.price} per unit</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-deep-black px-3 py-1.5 rounded-lg border border-white/5">
                        {!isLocked && <button onClick={() => handleUpdateQty(p.partId, -1)} className="text-text-muted hover:text-white"><FaMinus className="text-xs" /></button>}
                        <span className="text-sm font-bold text-white w-4 text-center">{p.quantity}</span>
                        {!isLocked && <button onClick={() => handleUpdateQty(p.partId, 1)} className="text-text-muted hover:text-white"><FaPlus className="text-xs" /></button>}
                      </div>
                      <p className="text-sm font-bold text-gold w-16 text-right">₹{p.price * p.quantity}</p>
                      {!isLocked && <button onClick={() => handleRemovePart(p.partId)} className="text-red-400 hover:text-red-300 p-2"><FaTimes /></button>}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {usedParts.length === 0 && <p className="text-sm text-text-muted italic py-4">No parts added to this job yet.</p>}
            </div>
          </div>
        </div>

        {/* Live Cost & Actions Footer */}
        <div className="p-6 border-t border-white/5 bg-deep-black/50 relative z-10 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="w-full sm:w-auto flex flex-col gap-3">
              <div>
                <div className="flex justify-between text-xs mb-1"><span className="text-text-muted">Services:</span><span className="text-white font-medium">₹{servicesCost.toLocaleString()}</span></div>
                <div className="flex justify-between text-xs mb-2"><span className="text-text-muted">Parts:</span><span className="text-white font-medium">₹{partsCost.toLocaleString()}</span></div>
                <div className="flex items-end gap-3">
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Total Bill</span>
                  <span className="text-4xl font-heading font-bold text-gold">₹{totalCost.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-white/5 pt-2">
                <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Payment:</span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${job?.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {job?.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                </span>
              </div>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              {/* Initial State: Submit Bill */}
              {!job?.billSubmitted && billingStatus !== 'submitting' && (
                <button 
                  onClick={handleSubmitBill} 
                  disabled={totalCost === 0}
                  className={`px-10 py-3.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(200,155,60,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2 ${totalCost === 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                >
                  <FaCheck /> Submit Bill
                </button>
              )}

              {billingStatus === 'submitting' && (
                <button disabled className="px-10 py-3.5 bg-white/5 text-text-muted rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3">
                  <div className="w-4 h-4 border-2 border-gold/20 border-t-gold rounded-full animate-spin" />
                  Submitting...
                </button>
              )}

              {/* After Bill Submitted, Before Payment */}
              {job?.billSubmitted && job?.paymentStatus !== 'paid' && (
                <div className="px-10 py-3.5 bg-white/5 border border-white/10 text-text-muted rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3">
                   <div className="w-2 h-2 bg-sierra rounded-full animate-pulse" />
                   Awaiting Customer Payment
                </div>
              )}

              {/* After Payment, Before Invoice Generated */}
              {job?.paymentStatus === 'paid' && !job?.invoiceUrl && (
                <button 
                  onClick={handleGenerateInvoice} 
                  disabled={generateInvoiceMutation.isPending}
                  className="px-10 py-3.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  {generateInvoiceMutation.isPending ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <FaCheckCircle />}
                  Generate Final Invoice
                </button>
              )}

              {/* After Invoice Generated */}
              {job?.invoiceUrl && (
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 px-4 py-3.5 rounded-xl border border-emerald-500/20">
                    <FaCheckCircle className="text-sm" /> Invoice Generated
                  </span>
                  <button 
                    onClick={() => {
                      const host = '';
                      window.open(`${host}${job.invoiceUrl}`, '_blank');
                    }} 
                    className="px-6 py-3.5 bg-soft-dark border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:border-gold/30 hover:text-gold transition-colors"
                  >
                    View & Print Invoice
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
