import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCar, FaChevronDown, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaCloudUploadAlt, FaWrench } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { SERVICES, MOCK_VEHICLES } from '../../data/constants'

import { useVehicles } from '../../hooks/useVehicleHooks'
import { useCreateRequest } from '../../hooks/useRequestHooks'

export default function AddRequest({ setTab }) {
  const { addToast } = useToast()
  const { data: vehicles = [] } = useVehicles()
  const createRequestMutation = useCreateRequest()
  
  const [step, setStep] = useState(1)
  const [showVehicleSelect, setShowVehicleSelect] = useState(false)
  const [form, setForm] = useState({ brand: '', model: '', plate: '', issue: '', services: [], type: 'Home', location: '', date: '', image: null })

  const handleSelectVehicle = (v) => {
    setForm({ ...form, brand: v.brand, model: v.model, plate: v.plate })
    setShowVehicleSelect(false)
  }

  const submitRequest = async () => {
    if (!form.brand || !form.issue) return addToast('Please fill required details', 'error')
    
    try {
      const formData = new FormData()
      formData.append('brand', form.brand)
      formData.append('model', form.model)
      formData.append('plate', form.plate)
      formData.append('issue', form.issue)
      formData.append('type', form.type)
      formData.append('location', form.location)
      formData.append('date', form.date)
      formData.append('serviceIds', JSON.stringify(form.services))
      if (form.image) formData.append('vehicleImage', form.image)

      await createRequestMutation.mutateAsync(formData)
      addToast('Service request created successfully!', 'success')
      setTab('requests')
    } catch (error) {
      addToast('Failed to create request', 'error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-full pointer-events-none" />
        
        {/* Progress Header */}
        <div className="mb-8 relative z-10">
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Create New Request</h2>
          <p className="text-sm text-text-muted">Tell us about your issue and we'll take care of the rest.</p>
          
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
            <span className={step >= 2 ? 'text-gold' : ''}>Services</span>
            <span className={step >= 3 ? 'text-gold' : ''}>Location & Date</span>
          </div>
        </div>

        {/* Step 1: Vehicle & Issue */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 relative z-10">
              
              {/* Smart Vehicle Selector */}
              <div className="relative">
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Select Existing Vehicle (Optional)</label>
                <button onClick={() => setShowVehicleSelect(!showVehicleSelect)} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white flex items-center justify-between hover:border-gold/30 transition-colors">
                  {form.plate ? `${form.brand} ${form.model} (${form.plate})` : 'Choose from your garage...'}
                  <FaChevronDown className={`text-text-muted transition-transform ${showVehicleSelect ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showVehicleSelect && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-full left-0 right-0 mt-2 bg-card border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden">
                      {vehicles.length === 0 ? (
                        <p className="p-4 text-xs text-text-muted text-center">No vehicles in your garage</p>
                      ) : vehicles.map(v => (
                        <button key={v.id} onClick={() => handleSelectVehicle(v)} className="w-full flex items-center gap-4 p-4 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0">
                          <div className="w-12 h-12 rounded-lg bg-soft-dark flex items-center justify-center text-white"><FaCar /></div>
                          <div><p className="text-sm font-bold text-white">{v.brand} {v.model}</p><p className="text-xs text-gold">{v.plate}</p></div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Brand</label>
                  <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" placeholder="e.g. Honda" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Model</label>
                  <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" placeholder="e.g. City" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Describe the Issue</label>
                <textarea rows={4} value={form.issue} onChange={e => setForm({...form, issue: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none" placeholder="Please describe the problem in detail..." />
              </div>

              <label className="flex flex-col items-center justify-center gap-2 p-6 bg-soft-dark border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-gold/50 transition-colors">
                <FaCloudUploadAlt className="text-3xl text-text-muted" />
                <span className="text-sm font-medium text-white">Click to upload vehicle image</span>
                <span className="text-xs text-text-muted">JPG, PNG up to 5MB (Optional)</span>
                <input type="file" className="hidden" accept="image/*" onChange={e => setForm({...form, image: e.target.files[0]})} />
              </label>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 relative z-10">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Select Required Services (Optional)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SERVICES.map(s => {
                  const isSelected = form.services.includes(s.id)
                  return (
                    <button key={s.id} onClick={() => {
                      const newS = isSelected ? form.services.filter(id => id !== s.id) : [...form.services, s.id]
                      setForm({...form, services: newS})
                    }} className={`p-4 rounded-xl border text-left transition-all ${isSelected ? 'bg-gold/10 border-gold shadow-[0_0_15px_rgba(200,155,60,0.2)]' : 'bg-soft-dark border-white/10 hover:border-white/30'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <s.icon className={`text-xl ${isSelected ? 'text-gold' : 'text-text-muted'}`} />
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-muted'}`}>{s.price}</span>
                      </div>
                      <p className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-text-muted'}`}>{s.title}</p>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 relative z-10">
              
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Service Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Home', 'Garage'].map(t => (
                    <button key={t} onClick={() => setForm({...form, type: t})} className={`py-4 rounded-xl border text-center transition-all ${form.type === t ? 'bg-gold/10 border-gold text-gold font-bold shadow-[0_0_15px_rgba(200,155,60,0.2)]' : 'bg-soft-dark border-white/10 text-text-muted hover:border-white/30'}`}>
                      {t} Service
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {form.type === 'Home' ? (
                  <motion.div key="home" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2">
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block">Service Address</label>
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                      <input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" placeholder="Enter full address" />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="garage" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-4 bg-soft-dark border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">AutoMend Premium Garage</p>
                      <p className="text-xs text-text-muted">123 Auto Street, Motor City</p>
                    </div>
                    <FaMapMarkerAlt className="text-gold text-xl drop-shadow-[0_0_5px_rgba(200,155,60,0.8)]" />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Preferred Date & Time</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full pl-11 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all [color-scheme:dark]" />
                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 relative z-10 pt-6 border-t border-white/5">
          <button onClick={() => setStep(step - 1)} className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white border border-white/10 hover:bg-white/5 transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            Back
          </button>
          
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} className="px-8 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
              Next Step
            </button>
          ) : (
            <button onClick={submitRequest} disabled={createRequestMutation.isPending} className="px-8 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(200,155,60,0.6)] hover:scale-105 transition-all disabled:opacity-50">
              {createRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
