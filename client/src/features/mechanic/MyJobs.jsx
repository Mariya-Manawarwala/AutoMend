import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaWrench, FaCheck, FaCar, FaMapMarkerAlt, FaCogs, FaTools, FaPlus, FaMinus } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { SERVICES } from '../../data/constants'

const MOCK_PARTS = [
  { id: 1, name: 'Synthetic Engine Oil (5W-30)', price: 4500 },
  { id: 2, name: 'Oil Filter', price: 800 },
  { id: 3, name: 'Air Filter', price: 1200 },
  { id: 4, name: 'Brake Pads (Front)', price: 3500 },
]

import { useJob, useUpdateJob, useSubmitBill } from '../../hooks/useJobHooks'

export default function MyJobs() {
  const { addToast } = useToast()
  
  // For demonstration, we assume we have a requestId from the context or a selected job
  // In a real scenario, this might come from a prop or a list of active jobs
  const activeRequestId = localStorage.getItem('activeJobId') 
  const { data: job, isLoading } = useJob(activeRequestId)
  const updateJobMutation = useUpdateJob()
  const submitBillMutation = useSubmitBill()
  
  // Work Panel State (Synchronized with job data)
  const [selectedServices, setSelectedServices] = useState([])
  const [usedParts, setUsedParts] = useState([])
  const [showPartsDropdown, setShowPartsDropdown] = useState(false)
  const [status, setStatus] = useState('idle')

  // Sync state when job data loads
  useEffect(() => {
    if (job) {
      setSelectedServices(job.serviceIds || [])
      setUsedParts(job.parts || [])
      setStatus(job.status === 'billed' ? 'success' : 'idle')
    }
  }, [job])

  // Calculate Costs
  const servicesCost = selectedServices.reduce((total, id) => {
    const s = SERVICES.find(s => s.id === id)
    return total + parseInt(s.price.replace('$', '')) * 83 // roughly convert mock $ to ₹ for display
  }, 0)

  const partsCost = usedParts.reduce((total, p) => total + (p.price * p.qty), 0)
  const totalCost = servicesCost + partsCost

  const handleToggleService = (id) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleAddPart = (part) => {
    const existing = usedParts.find(p => p.id === part.id)
    if (existing) {
      setUsedParts(prev => prev.map(p => p.id === part.id ? { ...p, qty: p.qty + 1 } : p))
    } else {
      setUsedParts([...usedParts, { ...part, qty: 1 }])
    }
    setShowPartsDropdown(false)
  }

  const handleUpdateQty = (id, delta) => {
    setUsedParts(prev => prev.map(p => {
      if (p.id === id) {
        const newQty = p.qty + delta
        return newQty > 0 ? { ...p, qty: newQty } : p
      }
      return p
    }))
  }

  const handleRemovePart = (id) => setUsedParts(prev => prev.filter(p => p.id !== id))

  const handleSave = async () => {
    try {
      await updateJobMutation.mutateAsync({ 
        jobId: job._id, 
        data: { serviceIds: selectedServices, parts: usedParts } 
      })
      addToast('Work progress saved.', 'info')
    } catch (error) {
      addToast('Failed to save progress', 'error')
    }
  }

  const handleSubmitBill = async () => {
    try {
      setStatus('submitting')
      await submitBillMutation.mutateAsync(job._id)
      setStatus('success')
      addToast('Invoice Generated Successfully', 'success')
    } catch (error) {
      setStatus('idle')
      addToast('Failed to submit bill', 'error')
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 pb-10 h-full">
      
      {/* LEFT: Job Details */}
      <div className="w-full lg:w-1/3 space-y-4 flex flex-col">
        <div className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-gold/20 shadow-[0_0_20px_rgba(200,155,60,0.1)] flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-bold text-white">Active Job</h3>
            <span className="px-2 py-1 rounded bg-sierra/10 text-sierra text-[10px] font-bold border border-sierra/20 uppercase tracking-widest">In Progress</span>
          </div>

          <div className="w-full aspect-video rounded-xl bg-soft-dark border border-white/5 overflow-hidden flex items-center justify-center mb-6">
            <FaCar className="text-5xl text-white/10" />
          </div>

          <p className="text-sm text-gold font-bold mb-1">REQ-1023</p>
          <h4 className="text-2xl font-heading font-bold text-white mb-4">2024 BMW X5</h4>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-text-muted mb-1"><FaWrench className="inline mr-1 text-gold" /> Reported Issue</p>
              <p className="text-sm font-medium text-white">Engine making weird noise during acceleration.</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-1"><FaMapMarkerAlt className="inline mr-1 text-gold" /> Location</p>
              <p className="text-sm font-medium text-white">123 Palm Avenue, South District</p>
            </div>
            <button className="w-full py-2 bg-soft-dark border border-white/10 text-white rounded-lg text-sm hover:bg-white/5 transition-colors">
              Open Maps
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Work Panel */}
      <div className="w-full lg:w-2/3 h-[78vh] bg-card/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold/5 to-transparent rounded-bl-full pointer-events-none" />
        
        <div className="p-4 border-b border-white/5 relative z-10 shrink-0">
          <h3 className="text-2xl font-heading font-bold text-white flex items-center gap-3"><FaCogs className="text-gold" /> Live Work Panel</h3>
          <p className="text-sm text-text-muted">Log services and parts to auto-generate the bill.</p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar relative z-10 space-y-8">
          
          {/* Services Selection */}
          <div>
            <h4 className="text-sm font-bold text-gold uppercase tracking-widest mb-4">Services Rendered</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICES.map(s => {
                const isSelected = selectedServices.includes(s.id)
                return (
                  <button key={s.id} onClick={() => handleToggleService(s.id)} className={`p-4 rounded-xl border text-left transition-all ${isSelected ? 'bg-gold/10 border-gold shadow-[0_0_15px_rgba(200,155,60,0.2)]' : 'bg-soft-dark border-white/10 hover:border-white/30'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <s.icon className={`text-xl ${isSelected ? 'text-gold' : 'text-text-muted'}`} />
                      {isSelected && <FaCheck className="text-gold text-sm" />}
                    </div>
                    <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-muted'}`}>{s.title}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Parts Selection */}
          <div className="pt-6 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gold uppercase tracking-widest">Parts Used</h4>
              <div className="relative">
                <button onClick={() => setShowPartsDropdown(!showPartsDropdown)} className="px-4 py-2 bg-soft-dark border border-white/10 rounded-lg text-sm text-white hover:border-gold/30 transition-colors flex items-center gap-2">
                  <FaPlus className="text-gold" /> Add Part
                </button>
                <AnimatePresence>
                  {showPartsDropdown && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 top-full mt-2 w-64 bg-deep-black border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                      {MOCK_PARTS.map(p => (
                        <button key={p.id} onClick={() => handleAddPart(p)} className="w-full text-left px-4 py-3 hover:bg-white/5 text-sm text-white border-b border-white/5 last:border-0 flex justify-between">
                          <span>{p.name}</span><span className="text-text-muted">₹{p.price}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {usedParts.map(p => (
                  <motion.div key={p.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} 
                    className="flex items-center justify-between p-4 rounded-xl bg-soft-dark border border-white/5">
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-text-muted">₹{p.price} per unit</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3 bg-deep-black px-3 py-1.5 rounded-lg border border-white/5">
                        <button onClick={() => handleUpdateQty(p.id, -1)} className="text-text-muted hover:text-white"><FaMinus className="text-xs" /></button>
                        <span className="text-sm font-bold text-white w-4 text-center">{p.qty}</span>
                        <button onClick={() => handleUpdateQty(p.id, 1)} className="text-text-muted hover:text-white"><FaPlus className="text-xs" /></button>
                      </div>
                      <p className="text-sm font-bold text-gold w-16 text-right">₹{p.price * p.qty}</p>
                      <button onClick={() => handleRemovePart(p.id)} className="text-red-400 hover:text-red-300 p-2"><FaTimes /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {usedParts.length === 0 && <p className="text-sm text-text-muted italic py-4">No parts added to this job yet.</p>}
            </div>
          </div>
        </div>

        {/* Live Cost & Actions Footer */}
        <div className="p-4 border-t border-white/5 bg-deep-black/50 relative z-10 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            
            <div className="w-full sm:w-auto">
              <div className="flex justify-between text-sm mb-1"><span className="text-text-muted">Services:</span><span className="text-white font-medium">₹{servicesCost}</span></div>
              <div className="flex justify-between text-sm mb-2"><span className="text-text-muted">Parts:</span><span className="text-white font-medium">₹{partsCost}</span></div>
              <div className="flex items-end gap-3"><span className="text-text-muted uppercase tracking-widest text-xs font-bold">Total Bill</span><span className="text-3xl font-heading font-bold text-gold">₹{totalCost}</span></div>
            </div>

            <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              {status === 'idle' && (
                <>
                  <button onClick={handleSave} className="px-6 py-3 bg-soft-dark border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/5 transition-colors">
                    Save Draft
                  </button>
                  <button onClick={handleSubmitBill} className="px-8 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(200,155,60,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <FaCheck /> Submit Bill
                  </button>
                </>
              )}

              {status === 'submitting' && (
                <button disabled className="px-10 py-3 bg-gradient-to-r from-gold/50 to-light-gold/50 text-deep-black rounded-xl text-sm font-bold shadow-[0_0_25px_rgba(200,155,60,0.8)] scale-105 transition-all flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-deep-black border-t-transparent rounded-full animate-spin" />
                  Generating...
                </button>
              )}

              {status === 'success' && (
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <span className="text-emerald-400 font-bold text-sm flex items-center gap-2">
                    <FaCheck /> Sent to Customer
                  </span>
                  <button onClick={() => addToast('Downloading Invoice PDF...', 'info')} className="px-6 py-3 bg-soft-dark border border-white/10 text-white rounded-xl text-sm font-bold hover:border-gold/30 hover:text-gold transition-colors">
                    View Invoice
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
