import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCar, FaChevronDown, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaCloudUploadAlt, FaWrench, FaCogs, FaOilCan, FaTools, FaSnowflake, FaBoxOpen } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { useVehicles } from '../../hooks/useVehicleHooks'
import { useCreateRequest, useUpdateRequest } from '../../hooks/useRequestHooks'
import { useServices } from '../../hooks/useServiceHooks'
import { useParts } from '../../hooks/usePartHooks'

const getServiceIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'engine': return FaCogs
    case 'maintenance': return FaOilCan
    case 'brakes': return FaWrench
    case 'cooling': return FaSnowflake
    default: return FaTools
  }
}

export default function AddRequest({ setTab, editData, clearEdit }) {
  const { addToast } = useToast()
  const { data: vehicles = [] } = useVehicles()
  const { data: services = [], isLoading: isServLoading } = useServices()
  const { data: parts = [], isLoading: isPartsLoading } = useParts()
  const createRequestMutation = useCreateRequest()
  const updateRequestMutation = useUpdateRequest()
  
  const [step, setStep] = useState(1)
  const [showVehicleSelect, setShowVehicleSelect] = useState(false)
  const [form, setForm] = useState(editData ? {
    brand: editData.vehicle?.brand || '',
    model: editData.vehicle?.model || '',
    plate: editData.vehicle?.plate || '',
    issue: editData.description || '',
    services: editData.serviceIds?.map(s => typeof s === 'string' ? s : s._id) || [],
    parts: editData.partIds?.map(p => typeof p === 'string' ? p : p._id) || [],
    type: editData.serviceType?.toLowerCase() === 'home' ? 'Home' : 'Garage',
    location: editData.location?.address || '',
    date: editData.scheduledDate ? new Date(editData.scheduledDate).toISOString().slice(0, 16) : '',
    image: null
  } : { brand: '', model: '', plate: '', issue: '', services: [], parts: [], type: 'Home', location: '', date: '', image: null })

  const handleSelectVehicle = (v) => {
    setForm({ ...form, brand: v.brand, model: v.model, plate: v.plate || v.numberPlate })
    setShowVehicleSelect(false)
  }

  const submitRequest = async () => {
    if (!form.brand || !form.issue) return addToast('Please fill required details', 'error')
    
    try {
      const formData = new FormData()
      formData.append('brand', form.brand)
      formData.append('model', form.model)
      formData.append('plate', form.plate)
      formData.append('description', form.issue)
      formData.append('serviceType', form.type.toLowerCase())
      formData.append('location', JSON.stringify({ address: form.location }))
      formData.append('scheduledDate', form.date)
      formData.append('serviceIds', JSON.stringify(form.services))
      formData.append('partIds', JSON.stringify(form.parts))
      if (form.image) formData.append('vehicleImage', form.image)

      if (editData) {
        await updateRequestMutation.mutateAsync({ id: editData._id, data: formData })
        addToast('Service request updated successfully!', 'success')
        clearEdit()
      } else {
        await createRequestMutation.mutateAsync(formData)
        addToast('Service request created successfully!', 'success')
      }
      setTab('requests')
    } catch (error) {
      console.error("Submit Request Error:", error)
      addToast(error.response?.data?.message || 'Failed to submit request', 'error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-full pointer-events-none" />
        
        {/* Progress Header */}
        <div className="mb-8 relative z-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-2">{editData ? 'Update Service Request' : 'Create New Request'}</h2>
          <p className="text-sm text-text-muted">{editData ? 'Modify your request details below.' : "Tell us about your issue and we'll take care of the rest."}</p>
          
          <div className="flex items-center gap-4 mt-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex-1 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-gold text-deep-black shadow-[0_0_10px_rgba(200,155,60,0.5)]' : 'bg-soft-dark text-text-muted border border-white/10'}`}>
                  {step > s ? <FaCheck /> : s}
                </div>
                <div className={`h-1 flex-1 rounded-full transition-all ${step > s ? 'bg-gold' : 'bg-soft-dark'}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between px-1 mt-2 text-xs font-medium text-text-muted">
            <span className={step >= 1 ? 'text-gold' : ''}>Vehicle & Issue</span>
            <span className={step >= 2 ? 'text-gold' : ''}>Services & Parts</span>
            <span className={step >= 3 ? 'text-gold' : ''}>Location & Date</span>
          </div>
        </div>

        {/* Step 1: Vehicle & Issue */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 relative z-10">
              
              <div className="relative">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Select Existing Vehicle (Optional)</label>
                <button onClick={() => setShowVehicleSelect(!showVehicleSelect)} className="w-full px-4 py-3.5 bg-soft-dark border border-white/10 rounded-2xl text-sm text-white flex items-center justify-between hover:border-gold/30 transition-all shadow-inner">
                  {form.plate ? `${form.brand} ${form.model} (${form.plate})` : 'Choose from your garage...'}
                  <FaChevronDown className={`text-text-muted transition-transform ${showVehicleSelect ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showVehicleSelect && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                      {vehicles.length === 0 ? (
                        <p className="p-6 text-xs text-text-muted text-center italic">No vehicles in your garage</p>
                      ) : vehicles.map(v => (
                        <button key={v._id} onClick={() => handleSelectVehicle(v)} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0">
                          <div className="w-12 h-12 rounded-xl bg-soft-dark flex items-center justify-center text-white shrink-0 border border-white/5">
                            {v.image ? <img src={v.image} className="w-full h-full object-cover rounded-xl" /> : <FaCar />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{v.brand} {v.model}</p>
                            <p className="text-[10px] text-gold font-black uppercase tracking-widest">{v.plate || v.numberPlate}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Brand</label>
                  <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full px-4 py-3.5 bg-soft-dark border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner" placeholder="e.g. Honda" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Model</label>
                  <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full px-4 py-3.5 bg-soft-dark border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner" placeholder="e.g. City" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Describe the Issue</label>
                <textarea rows={4} value={form.issue} onChange={e => setForm({...form, issue: e.target.value})} className="w-full px-4 py-3.5 bg-soft-dark border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none shadow-inner" placeholder="Please describe the problem in detail..." />
              </div>

              <label className="flex flex-col items-center justify-center gap-3 p-8 bg-soft-dark border-2 border-dashed border-white/10 rounded-[2rem] cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaCloudUploadAlt className="text-3xl text-text-muted group-hover:text-gold" />
                </div>
                <span className="text-sm font-bold text-white">{form.image ? form.image.name : 'Click to upload vehicle image'}</span>
                <span className="text-[10px] text-text-muted uppercase tracking-widest">JPG, PNG up to 5MB (Optional)</span>
                <input type="file" className="hidden" accept="image/*" onChange={e => setForm({...form, image: e.target.files[0]})} />
              </label>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
              
              {/* Services Section */}
              <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4 block">Select Required Services (Optional)</label>
                {isServLoading ? (
                  <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" /></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {services.map(s => {
                      const isSelected = form.services.includes(s._id)
                      const Icon = getServiceIcon(s.category)
                      return (
                        <button key={s._id} onClick={() => {
                          const newS = isSelected ? form.services.filter(id => id !== s._id) : [...form.services, s._id]
                          setForm({...form, services: newS})
                        }} className={`p-4 rounded-2xl border text-left transition-all ${isSelected ? 'bg-gold/10 border-gold shadow-[0_0_15px_rgba(200,155,60,0.2)]' : 'bg-soft-dark border-white/10 hover:border-white/30'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <Icon className={`text-xl ${isSelected ? 'text-gold' : 'text-text-muted'}`} />
                            <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-text-muted'}`}>₹{s.basePrice}</span>
                          </div>
                          <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-muted'}`}>{s.name}</p>
                          <p className="text-[10px] text-text-muted mt-1 line-clamp-1">{s.description}</p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Parts Section */}
              <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4 block">Select Pre-required Parts (Optional)</label>
                {isPartsLoading ? (
                  <div className="py-8 text-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" /></div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {parts.map(p => {
                      const isSelected = form.parts.includes(p._id)
                      return (
                        <button key={p._id} onClick={() => {
                          const newP = isSelected ? form.parts.filter(id => id !== p._id) : [...form.parts, p._id]
                          setForm({...form, parts: newP})
                        }} className={`p-4 rounded-2xl border text-left transition-all ${isSelected ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-soft-dark border-white/10 hover:border-white/30'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <FaBoxOpen className={`text-xl ${isSelected ? 'text-emerald-400' : 'text-text-muted'}`} />
                            <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-text-muted'}`}>₹{p.unitPrice}</span>
                          </div>
                          <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-muted'}`}>{p.name}</p>
                          <p className="text-[10px] text-text-muted mt-1">{p.category} • {p.unit}</p>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 relative z-10">
              
              <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4 block">Service Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Home', 'Garage'].map(t => (
                    <button key={t} onClick={() => setForm({...form, type: t})} className={`py-5 rounded-[1.5rem] border text-xs font-black uppercase tracking-widest transition-all ${form.type === t ? 'bg-gold/10 border-gold text-gold shadow-[0_0_20px_rgba(200,155,60,0.2)]' : 'bg-soft-dark border-white/10 text-text-muted hover:border-white/30'}`}>
                      {t} Service
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {form.type === 'Home' ? (
                  <motion.div key="home" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block">Service Address</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-soft-dark border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner" placeholder="Enter full address" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="garage" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-6 bg-soft-dark/50 border border-white/10 rounded-[1.5rem] flex items-center justify-between shadow-inner">
                    <div>
                      <p className="text-sm font-bold text-white">AutoMend Premium Garage</p>
                      <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">123 Auto Street, Motor City</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20 shadow-lg">
                      <FaMapMarkerAlt />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4 block">Preferred Date & Time</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full pl-11 pr-4 py-3.5 bg-soft-dark border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all [color-scheme:dark] shadow-inner" />
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 relative z-10 pt-8 border-t border-white/5">
          <button 
            onClick={() => {
              if (step === 1 && editData) {
                clearEdit()
                setTab('requests')
              } else {
                setStep(step - 1)
              }
            }} 
            className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 transition-all ${step === 1 && !editData ? 'opacity-0 pointer-events-none' : ''}`}
          >
            {step === 1 && editData ? 'Cancel' : 'Back'}
          </button>
          
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="px-10 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all hover:scale-105">
              Next Step
            </button>
          ) : (
            <button onClick={submitRequest} disabled={createRequestMutation.isPending} className="px-10 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(200,155,60,0.6)] hover:scale-105 transition-all disabled:opacity-50">
              {createRequestMutation.isPending ? 'Submitting...' : 'Confirm Request'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
