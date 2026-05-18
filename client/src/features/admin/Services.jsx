import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCogs, FaPlus, FaEdit, FaTrash, FaTimes, FaWrench, FaSearch, FaTools } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import CardSelector from '../../components/common/CardSelector'
import { useServices, useAddService, useUpdateService, useDeleteService } from '../../hooks/useServiceHooks'

export default function Services() {
  const { addToast } = useToast()
  
  const { data: services = [], isLoading } = useServices()
  const addServiceMut = useAddService()
  const updateServiceMut = useUpdateService()
  const deleteServiceMut = useDeleteService()

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ title: '', desc: '', price: '', category: 'Maintenance' })

  const handleEditClick = (service) => {
    setEditingId(service._id)
    setForm({
      title: service.title,
      desc: service.desc || service.description || '',
      price: service.price || service.basePrice,
      category: service.category || 'Maintenance'
    })
    setShowModal(true)
  }

  const handleAddClick = () => {
    setEditingId(null)
    setForm({ title: '', desc: '', price: '', category: 'Maintenance' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.title || !form.price) return addToast('Title and Price are required', 'error')
    
    // Remap desc -> description and price -> basePrice if needed based on backend schema
    const dataToSave = {
      title: form.title,
      description: form.desc,
      basePrice: form.price,
      category: form.category
    }

    if (editingId) {
      updateServiceMut.mutate({ id: editingId, data: dataToSave }, {
        onSuccess: () => {
          setShowModal(false)
          addToast('Service updated successfully', 'success')
        },
        onError: () => addToast('Failed to update service', 'error')
      })
    } else {
      addServiceMut.mutate(dataToSave, {
        onSuccess: () => {
          setShowModal(false)
          addToast('Service added successfully', 'success')
        },
        onError: () => addToast('Failed to add service', 'error')
      })
    }
  }

  const handleDelete = (id) => {
    deleteServiceMut.mutate(id, {
      onSuccess: () => addToast('Service removed', 'info'),
      onError: () => addToast('Failed to remove service', 'error')
    })
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      <div className="flex justify-between items-center bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div>
          <h2 className="text-lg font-bold text-white">Services Catalog</h2>
          <p className="text-xs text-text-muted">Manage the services offered to customers.</p>
        </div>
        <button onClick={handleAddClick} className="px-5 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(200,155,60,0.3)] hover:scale-105 transition-all flex items-center gap-2">
          <FaPlus /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {isLoading && [1,2,3].map(n => <div key={n} className="h-40 bg-white/5 animate-pulse rounded-2xl" />)}
          {!isLoading && services.map((s, i) => (
            <motion.div key={s._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.05 }}
              className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg group hover:-translate-y-1 transition-transform relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none" />
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-xl bg-soft-dark border border-white/10 flex items-center justify-center text-xl text-gold">
                    <FaCogs />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                    <button onClick={() => handleEditClick(s)} className="p-2 text-text-muted hover:text-white transition-colors bg-soft-dark rounded-lg"><FaEdit /></button>
                    <button onClick={() => handleDelete(s._id)} className="p-2 text-text-muted hover:text-red-400 transition-colors bg-soft-dark rounded-lg"><FaTrash /></button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2 h-10">{s.description}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <span className="text-xs font-bold text-white bg-soft-dark px-2 py-1 rounded">{s.category || 'General'}</span>
                <span className="text-xl font-heading font-bold text-gold">₹{s.basePrice?.toLocaleString()}</span>
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
                <h3 className="text-xl font-heading font-bold text-white">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Service Title</label>
                  <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. Engine Diagnostics" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 block">Service Category</label>
                  <CardSelector 
                    value={form.category} 
                    onChange={val => setForm({...form, category: val})}
                    options={[
                      { value: 'Maintenance', label: 'Maintenance', icon: FaWrench },
                      { value: 'Repair', label: 'Repair', icon: FaTools },
                      { value: 'Inspection', label: 'Inspection', icon: FaSearch }
                    ]}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Description</label>
                  <textarea value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} rows={3} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 resize-none" placeholder="Details about this service..." />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Base Price</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: Number(e.target.value)})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. 1500" />
                </div>

                <button onClick={handleSave} disabled={addServiceMut.isPending || updateServiceMut.isPending} className="w-full py-3.5 mt-4 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all disabled:opacity-50">
                  {editingId ? 'Save Changes' : 'Save Service'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
