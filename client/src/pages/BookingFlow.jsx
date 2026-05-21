import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaCloudUploadAlt, FaMapMarkerAlt, FaCalendarAlt, FaCar, FaCheckCircle, FaCreditCard, FaArrowRight, FaArrowLeft, FaClock, FaExclamationTriangle } from 'react-icons/fa'
import { useNavigate, useLocation } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { SERVICES } from '../data/constants'
import { createRequest } from '../api/requests.api'

const STEPS = ['Describe Issue', 'Select Service', 'Schedule', 'Review & Pay']

export default function BookingFlow() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ 
    vehicleModel: '',
    issue: '', 
    image: null, 
    location: '', 
    date: '', 
    service: '', 
    details: '' 
  })
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  // State-of-the-art interactive picker states
  const [isUrgent, setIsUrgent] = useState(false)
  const [selectedQuickDate, setSelectedQuickDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [isCustomDate, setIsCustomDate] = useState(false)
  const [serviceTypeSelection, setServiceTypeSelection] = useState('home')

  // Generate next 6 days for the elegant Quick Selector
  const generateQuickDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 6; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      
      const weekdayStr = d.toLocaleDateString('en-US', { weekday: 'short' })
      const dayStr = d.toLocaleDateString('en-US', { day: 'numeric' })
      const monthStr = d.toLocaleDateString('en-US', { month: 'short' })
      
      dates.push({
        iso: `${year}-${month}-${day}`,
        weekday: weekdayStr,
        day: dayStr,
        month: monthStr,
        label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : weekdayStr
      })
    }
    return dates
  }

  const TIME_SLOTS = [
    { label: 'Morning', time: '09:00', display: '09:00 AM - 12:00 PM', icon: '🌅' },
    { label: 'Afternoon', time: '12:00', display: '12:00 PM - 03:00 PM', icon: '☀️' },
    { label: 'Late Afternoon', time: '15:00', display: '03:00 PM - 06:00 PM', icon: '🌆' },
    { label: 'Evening', time: '18:00', display: '06:00 PM - 09:00 PM', icon: '🌃' }
  ]

  useEffect(() => {
    if (location.state) {
      const { serviceType, location: loc, date, time, issue } = location.state
      setForm(prev => ({
        ...prev,
        location: loc || '',
        service: serviceType === 'repair' ? 'Repair' : serviceType === 'inspection' ? 'Inspection' : '',
        issue: issue || prev.issue
      }))
      
      if (date) {
        setSelectedQuickDate(date)
        setIsCustomDate(false)
        if (time) {
          setSelectedTimeSlot(time)
        }
      }
    }
  }, [location.state])

  // Automatically compute and sync form.date based on quick-picker inputs
  useEffect(() => {
    if (isUrgent) {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const formatted = `${year}-${month}-${day}T${hours}:${minutes}`
      update('date', formatted)
    } else if (!isCustomDate) {
      if (selectedQuickDate && selectedTimeSlot) {
        update('date', `${selectedQuickDate}T${selectedTimeSlot}`)
      } else {
        update('date', '')
      }
    }
  }, [isUrgent, selectedQuickDate, selectedTimeSlot, isCustomDate])

  const getFormattedDateDisplay = () => {
    if (isUrgent) return '🚨 URGENT - ASAP Dispatch'
    if (!form.date) return 'Not selected'
    try {
      const d = new Date(form.date)
      return d.toLocaleString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      })
    } catch {
      return form.date
    }
  }

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const next = () => {
    if (step === 0 && (!form.vehicleModel.trim() || !form.issue.trim())) {
      addToast('Please enter your vehicle model and describe the issue.', 'error')
      return
    }
    if (step === 1 && !form.service) {
      addToast('Please select a service.', 'error')
      return
    }
    if (step === 2) {
      if (serviceTypeSelection === 'home' && !form.location.trim()) {
        addToast('Please provide your service location address.', 'error')
        return
      }
      if (!form.date) {
        addToast('Please select your preferred date and time.', 'error')
        return
      }
    }
    if (step < 3) setStep(step + 1)
  }
  const prev = () => step > 0 && setStep(step - 1)

  const submit = async () => {
    try {
      if (!form.service || (serviceTypeSelection === 'home' && !form.location.trim())) {
        addToast('Please ensure service and location are provided', 'error')
        return
      }

      setIsLoading(true)
      const brandName = form.vehicleModel.split(' ')[0] || 'Generic'
      const modelName = form.vehicleModel.split(' ').slice(1).join(' ') || 'Vehicle'

      const requestData = {
        brand: brandName,
        model: modelName,
        vehicle: {
          brand: brandName,
          model: modelName
        },
        description: `[Service: ${form.service}] ${form.issue}`,
        location: {
          address: serviceTypeSelection === 'garage' ? 'AutoMend Premium Garage, 123 Auto Street' : form.location,
          type: 'Point',
          coordinates: [0, 0]
        },
        scheduledDate: form.date,
        serviceType: serviceTypeSelection,
        priority: isUrgent ? 'urgent' : 'normal'
      }

      await createRequest(requestData)
      addToast('Booking submitted successfully! A mechanic will be assigned shortly.', 'success')
      setTimeout(() => navigate('/dashboard/customer'), 1500)
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit booking', 'error')
      setIsLoading(false)
    }
  }

  return (
    <main className="pt-24 pb-20 min-h-screen bg-deep-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-deep-black via-warm-brown/10 to-deep-black pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[200px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">Book a <span className="text-gold">Service</span></h1>
          <p className="text-text-muted font-body text-sm">Complete the steps below to book your service</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 relative">
          <div className="absolute top-5 left-0 right-0 h-[2px] bg-card" />
          <div className="absolute top-5 left-0 h-[2px] bg-gradient-to-r from-gold to-light-gold transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          {STEPS.map((s, i) => (
            <div key={s} className="relative z-10 flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-heading font-bold transition-all duration-300 ${i <= step ? 'bg-gradient-to-br from-gold to-light-gold text-deep-black shadow-[0_0_15px_rgba(200,155,60,0.3)]' : 'bg-card border border-white/10 text-text-muted'}`}>
                {i < step ? <FaCheckCircle /> : i + 1}
              </div>
              <span className={`text-xs font-body mt-2 whitespace-nowrap hidden sm:block ${i <= step ? 'text-gold' : 'text-text-muted'}`}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">

              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Describe Your Vehicle Issue</h3>
                  <div className="relative">
                    <FaCar className="absolute left-4 top-4 text-text-muted" />
                    <input 
                      type="text" 
                      value={form.vehicleModel}
                      onChange={e => update('vehicleModel', e.target.value)}
                      placeholder="Vehicle make & model (e.g., 2024 BMW X5)" 
                      className="w-full pl-11 pr-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all" 
                    />
                  </div>
                  <div className="relative">
                    <FaSearch className="absolute left-4 top-4 text-text-muted" />
                    <textarea value={form.issue} onChange={e => update('issue', e.target.value)} placeholder="Describe the issue with your vehicle..." rows={4}
                      className="w-full pl-11 pr-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all resize-none" />
                  </div>
                  <label className="flex items-center gap-3 px-4 py-5 bg-soft-dark border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:border-gold/30 transition-all group">
                    <FaCloudUploadAlt className="text-xl text-text-muted group-hover:text-gold transition-colors" />
                    <div>
                      <span className="text-sm font-body text-text-light block">Upload Vehicle Image</span>
                      <span className="text-xs font-body text-text-muted">PNG, JPG up to 10MB</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={e => update('image', e.target.files[0])} />
                  </label>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-white mb-6">Select a Service</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Primary options from Home page */}
                    {['Repair', 'Inspection'].map(title => (
                       <button key={title} onClick={() => update('service', title)}
                       className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${form.service === title ? 'bg-gold/10 border-gold/40 shadow-[0_0_15px_rgba(200,155,60,0.15)]' : 'bg-soft-dark border-white/5 hover:border-white/10'}`}>
                       <FaCar className={`text-xl shrink-0 ${form.service === title ? 'text-gold' : 'text-text-muted'}`} />
                       <div>
                         <p className={`text-sm font-body font-medium ${form.service === title ? 'text-gold' : 'text-white'}`}>{title}</p>
                         <p className="text-text-muted text-xs font-body line-clamp-1">Professional {title.toLowerCase()} services.</p>
                       </div>
                     </button>
                    ))}

                    <div className="col-span-full border-t border-white/5 my-2 pt-4">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Or choose a specific package</p>
                    </div>

                    {SERVICES.map(svc => (
                      <button key={svc.id} onClick={() => update('service', svc.title)}
                        className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${form.service === svc.title ? 'bg-gold/10 border-gold/40 shadow-[0_0_15px_rgba(200,155,60,0.15)]' : 'bg-soft-dark border-white/5 hover:border-white/10'}`}>
                        <svc.icon className={`text-xl shrink-0 ${form.service === svc.title ? 'text-gold' : 'text-text-muted'}`} />
                        <div>
                          <p className={`text-sm font-body font-medium ${form.service === svc.title ? 'text-gold' : 'text-white'}`}>{svc.title}</p>
                          <p className="text-text-muted text-xs font-body line-clamp-1">{svc.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-xl font-heading font-bold text-white mb-1">Schedule & Location</h3>
                    <p className="text-text-muted text-xs">Specify your service coordinates and pick a convenient timing slot</p>
                  </div>

                  {/* 1. Service Type Selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => { setServiceTypeSelection('home'); update('location', '') }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${serviceTypeSelection === 'home' ? 'bg-gold/10 border-gold/50 shadow-[0_0_15px_rgba(200,155,60,0.15)] text-gold' : 'bg-soft-dark border-white/5 text-text-muted hover:text-white'}`}
                    >
                      <span className="text-2xl">🏠</span>
                      <div>
                        <p className="text-sm font-bold text-white">Home Service</p>
                        <p className="text-[10px] text-text-muted">Mechanic dispatches to you</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setServiceTypeSelection('garage'); update('location', 'AutoMend Premium Garage, 123 Auto Street') }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all ${serviceTypeSelection === 'garage' ? 'bg-gold/10 border-gold/50 shadow-[0_0_15px_rgba(200,155,60,0.15)] text-gold' : 'bg-soft-dark border-white/5 text-text-muted hover:text-white'}`}
                    >
                      <span className="text-2xl">🏢</span>
                      <div>
                        <p className="text-sm font-bold text-white">Garage Station</p>
                        <p className="text-[10px] text-text-muted">Bring it to our premium shop</p>
                      </div>
                    </button>
                  </div>

                  {/* Location Address Input (only if Home Service is selected) */}
                  {serviceTypeSelection === 'home' ? (
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                      <input 
                        type="text" 
                        value={form.location} 
                        onChange={e => update('location', e.target.value)} 
                        placeholder="Enter your address (e.g. 742 Evergreen Terrace)"
                        className="w-full pl-11 pr-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all" 
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-soft-dark border border-white/5 rounded-xl flex items-center gap-3">
                      <span className="text-lg">🏢</span>
                      <div>
                        <p className="text-xs font-bold text-white">AutoMend Premium Garage Address</p>
                        <p className="text-[11px] text-text-muted font-body">AutoMend Premium Garage, 123 Auto Street</p>
                      </div>
                    </div>
                  )}

                  {/* 2. Urgent / ASAP Request Option */}
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = !isUrgent
                      setIsUrgent(nextVal)
                      if (nextVal) {
                        setSelectedQuickDate('')
                        setSelectedTimeSlot('')
                        setIsCustomDate(false)
                      }
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${isUrgent ? 'bg-red-500/10 border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-soft-dark border-white/5 hover:border-red-500/20'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl animate-pulse">🚨</span>
                      <div>
                        <p className="text-sm font-bold text-white">Emergency / Urgent Service (ASAP)</p>
                        <p className="text-xs text-text-muted">Dispatches nearest certified mechanic right away</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${isUrgent ? 'border-red-500 bg-red-500 text-white' : 'border-white/20'}`}>
                      {isUrgent && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>

                  {/* 3. Interactive Date & Time Slots (Alternative to old boring calendar) */}
                  {!isUrgent && (
                    <div className="space-y-4">
                      {/* Interactive Days Row */}
                      <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Select Preferred Date</p>
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                          {generateQuickDates().map(d => (
                            <button
                              key={d.iso}
                              type="button"
                              onClick={() => { setSelectedQuickDate(d.iso); setIsCustomDate(false) }}
                              className={`flex-1 min-w-[85px] flex flex-col items-center py-2 px-3 rounded-xl border transition-all ${selectedQuickDate === d.iso && !isCustomDate ? 'bg-gold/10 border-gold/50 text-gold shadow-[0_0_10px_rgba(200,155,60,0.1)]' : 'bg-soft-dark border-white/5 text-text-muted hover:text-white hover:border-white/10'}`}
                            >
                              <span className="text-[10px] uppercase font-bold">{d.label}</span>
                              <span className="text-lg font-extrabold my-0.5">{d.day}</span>
                              <span className="text-[9px] uppercase">{d.month}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Interactive Time Slots Grid */}
                      {selectedQuickDate && !isCustomDate && (
                        <div>
                          <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Select Preferred Time Window</p>
                          <div className="grid grid-cols-2 gap-2">
                            {TIME_SLOTS.map(t => (
                              <button
                                key={t.time}
                                type="button"
                                onClick={() => setSelectedTimeSlot(t.time)}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${selectedTimeSlot === t.time ? 'bg-gold/10 border-gold/50 text-gold shadow-[0_0_10px_rgba(200,155,60,0.1)]' : 'bg-soft-dark border-white/5 text-text-muted hover:text-white hover:border-white/10'}`}
                              >
                                <span className="text-lg">{t.icon}</span>
                                <div>
                                  <p className="text-xs font-bold text-white">{t.label}</p>
                                  <p className="text-[10px] text-text-muted">{t.display}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Or Custom Date Switcher Link */}
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomDate(!isCustomDate)
                            if (!isCustomDate) {
                              setSelectedQuickDate('')
                              setSelectedTimeSlot('')
                            }
                          }}
                          className="text-xs text-gold/70 hover:text-gold transition-colors underline underline-offset-4"
                        >
                          {isCustomDate ? "← Use interactive quick slots" : "Or choose a specific custom date & time"}
                        </button>
                      </div>

                      {/* Custom DateTime picker input shown smoothly */}
                      {isCustomDate && (
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                          <input 
                            type="datetime-local" 
                            value={form.date} 
                            onChange={e => update('date', e.target.value)}
                            className="w-full pl-11 pr-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white focus:outline-none focus:border-gold/40 transition-all [color-scheme:dark]" 
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Additional notes/instructions input */}
                  <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Additional Instructions</p>
                    <textarea 
                      value={form.details} 
                      onChange={e => update('details', e.target.value)} 
                      placeholder="Any specific requests or descriptions for our mechanic..." 
                      rows={3}
                      className="w-full px-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all resize-none" 
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-white mb-6">Review & Confirm</h3>
                  <div className="space-y-4 mb-8">
                    {[
                      { label: 'Vehicle', value: form.vehicleModel || 'Not specified' },
                      { label: 'Issue', value: form.issue || 'Not specified' },
                      { label: 'Service', value: form.service || 'Not selected' },
                      { label: 'Service Type', value: serviceTypeSelection === 'garage' ? '🏢 Garage Station' : '🏠 Home Service' },
                      { label: 'Location', value: serviceTypeSelection === 'garage' ? 'AutoMend Premium Garage, 123 Auto Street' : (form.location || 'Not specified') },
                      { label: 'Preferred Schedule', value: getFormattedDateDisplay() },
                      { label: 'Notes', value: form.details || 'None' },
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-start py-3 border-b border-white/5 last:border-0">
                        <span className="text-text-muted text-sm font-body">{item.label}</span>
                        <span className="text-white text-sm font-body font-medium text-right max-w-[60%]">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-soft-dark border border-white/5 rounded-xl p-5 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <FaCreditCard className="text-gold" />
                      <span className="text-white font-body font-medium text-sm">Payment via Credits</span>
                    </div>
                    <p className="text-text-muted text-xs font-body">Exact cost will be confirmed after the mechanic reviews your request and sends an estimate. Payment will be deducted from your credit balance upon approval.</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={prev} disabled={step === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-body font-medium transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-card border border-white/5 text-text-light hover:text-white hover:border-white/10'}`}>
            <FaArrowLeft className="text-xs" /> Back
          </button>
          {step < 3 ? (
            <button onClick={next}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black font-heading font-bold text-sm rounded-xl hover:shadow-[0_0_25px_rgba(200,155,60,0.4)] hover:scale-105 active:scale-95 transition-all">
              Continue <FaArrowRight className="text-xs" />
            </button>
          ) : (
            <button onClick={submit} disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black font-heading font-bold text-sm rounded-xl hover:shadow-[0_0_25px_rgba(200,155,60,0.4)] hover:scale-105 active:scale-95 transition-all animate-glow-pulse disabled:opacity-50">
              {isLoading ? 'Submitting...' : <><FaCheckCircle /> Confirm Booking</>}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
