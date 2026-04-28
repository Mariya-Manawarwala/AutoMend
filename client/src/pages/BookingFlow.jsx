import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaCloudUploadAlt, FaMapMarkerAlt, FaCalendarAlt, FaCar, FaCheckCircle, FaCreditCard, FaArrowRight, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { SERVICES } from '../data/constants'

const STEPS = ['Describe Issue', 'Select Service', 'Schedule', 'Review & Pay']

export default function BookingFlow() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ issue: '', image: null, location: '', date: '', service: '', details: '' })
  const { addToast } = useToast()
  const navigate = useNavigate()

  const update = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const next = () => step < 3 && setStep(step + 1)
  const prev = () => step > 0 && setStep(step - 1)

  const submit = () => {
    addToast('Booking submitted successfully! A mechanic will be assigned shortly.', 'success')
    setTimeout(() => navigate('/dashboard'), 1500)
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
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
            <div className="bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl">

              {step === 0 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Describe Your Vehicle Issue</h3>
                  <div className="relative">
                    <FaCar className="absolute left-4 top-4 text-text-muted" />
                    <input type="text" placeholder="Vehicle make & model (e.g., 2024 BMW X5)" className="w-full pl-11 pr-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all" />
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
                <div className="flex flex-col gap-5">
                  <h3 className="text-xl font-heading font-bold text-white mb-2">Schedule & Location</h3>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                    <input type="text" value={form.location} onChange={e => update('location', e.target.value)} placeholder="Pickup / Service Location"
                      className="w-full pl-11 pr-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all" />
                  </div>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-sm" />
                    <input type="datetime-local" value={form.date} onChange={e => update('date', e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white focus:outline-none focus:border-gold/40 transition-all [color-scheme:dark]" />
                  </div>
                  <textarea value={form.details} onChange={e => update('details', e.target.value)} placeholder="Any additional notes or instructions..." rows={3}
                    className="w-full px-4 py-4 bg-soft-dark border border-white/5 rounded-xl text-sm font-body text-white placeholder:text-text-muted focus:outline-none focus:border-gold/40 transition-all resize-none" />
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl font-heading font-bold text-white mb-6">Review & Confirm</h3>
                  <div className="space-y-4 mb-8">
                    {[
                      { label: 'Issue', value: form.issue || 'Not specified' },
                      { label: 'Service', value: form.service || 'Not selected' },
                      { label: 'Location', value: form.location || 'Not specified' },
                      { label: 'Date', value: form.date || 'Not selected' },
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
            <button onClick={submit}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black font-heading font-bold text-sm rounded-xl hover:shadow-[0_0_25px_rgba(200,155,60,0.4)] hover:scale-105 active:scale-95 transition-all animate-glow-pulse">
              Confirm Booking <FaCheckCircle />
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
