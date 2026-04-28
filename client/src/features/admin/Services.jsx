import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCogs, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { SERVICES } from '../../data/constants'
import { useToast } from '../../context/ToastContext'

export default function Services() {
  const { addToast } = useToast()
  const [services, setServices] = useState(SERVICES)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ title: '', desc: '', price: '', category: 'Maintenance' })

  const handleSave = () => {
    if (!form.title || !form.price) return addToast('Title and Price are required', 'error')
    setServices([...services, { id: `SRV-${Date.now()}`, ...form, icon: FaCogs }])
    setShowModal(false)
    addToast('Service added successfully', 'success')
  }

  const handleDelete = (id) => {
    setServices(services.filter(s => s.id !== id))
    addToast('Service removed', 'info')
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      <div className="flex justify-between items-center bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-white">Services Catalog</h2>
          <p className="text-xs text-text-muted">Manage the services offered to customers.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(200,155,60,0.3)] hover:scale-105 transition-all flex items-center gap-2">
          <FaPlus /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
              className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg group hover:-translate-y-1 transition-transform relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-soft-dark border border-white/10 flex items-center justify-center text-xl text-gold">
                  {s.icon ? <s.icon /> : <FaCogs />}
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-text-muted hover:text-white transition-colors bg-soft-dark rounded-lg"><FaEdit /></button>
                  <button onClick={() => handleDelete(s.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors bg-soft-dark rounded-lg"><FaTrash /></button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
              <p className="text-sm text-text-muted mb-4 line-clamp-2 h-10">{s.desc}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-white bg-soft-dark px-2 py-1 rounded">{s.category || 'General'}</span>
                <span className="text-xl font-heading font-bold text-gold">{s.price}</span>
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
                <h3 className="text-xl font-heading font-bold text-white">Add New Service</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Service Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. Engine Diagnostics" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50">
                    <option>Maintenance</option><option>Repair</option><option>Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Description</label>
                  <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} rows={3} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 resize-none" placeholder="Details about this service..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Price (Starting at)</label>
                  <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. $149" />
                </div>

                <button onClick={handleSave} className="w-full py-3.5 mt-4 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
                  Save Service
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
