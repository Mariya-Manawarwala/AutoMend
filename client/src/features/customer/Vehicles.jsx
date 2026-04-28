import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaCar, FaGasPump, FaTimes, FaCloudUploadAlt } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { MOCK_VEHICLES } from '../../data/constants'

export default function Vehicles() {
  const { addToast } = useToast()
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ brand: '', model: '', plate: '', fuel: 'Petrol' })

  const handleSave = () => {
    if (!form.brand || !form.model || !form.plate) return addToast('Please fill all fields', 'error')
    
    setVehicles([...vehicles, { ...form, id: Date.now(), type: 'Standard' }])
    setShowModal(false)
    addToast('Vehicle added to your garage!', 'success')
    setForm({ brand: '', model: '', plate: '', fuel: 'Petrol' })
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-bold text-white">Your Garage ({vehicles.length})</h2>
        <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-soft-dark border border-white/10 rounded-xl text-sm font-bold text-white hover:border-gold/50 hover:bg-white/5 transition-all flex items-center gap-2">
          <FaPlus className="text-gold" /> Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {vehicles.map((v, i) => (
            <motion.div key={v.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="w-16 h-16 rounded-xl bg-soft-dark border border-white/10 flex items-center justify-center text-2xl text-gold mb-4 group-hover:scale-110 transition-transform">
                <FaCar />
              </div>
              <h3 className="text-lg font-heading font-bold text-white">{v.brand} {v.model}</h3>
              <p className="text-xs font-bold text-gold tracking-widest uppercase mb-4">{v.plate}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-sm font-medium text-text-muted">{v.type || 'Standard'}</span>
                <span className="flex items-center gap-1 text-xs font-bold text-white bg-soft-dark px-2.5 py-1 rounded-full"><FaGasPump className="text-gold" /> {v.fuel || 'Petrol'}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl z-10">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">Add New Vehicle</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center gap-2 p-6 bg-soft-dark border border-dashed border-white/20 rounded-xl cursor-pointer hover:border-gold/50 transition-colors">
                  <FaCloudUploadAlt className="text-2xl text-text-muted" />
                  <span className="text-xs text-text-muted">Upload Vehicle Image (Optional)</span>
                </label>

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
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Number Plate</label>
                  <input value={form.plate} onChange={e => setForm({...form, plate: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all uppercase" placeholder="MH-01-AB-1234" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Fuel Type</label>
                  <select value={form.fuel} onChange={e => setForm({...form, fuel: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all appearance-none">
                    {['Petrol', 'Diesel', 'CNG', 'EV', 'Hybrid'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>

                <button onClick={handleSave} className="w-full py-3.5 mt-2 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
                  Save Vehicle
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
