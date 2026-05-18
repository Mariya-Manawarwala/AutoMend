import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTools, FaPlus, FaSearch, FaEdit, FaTrash, FaTimes, FaGasPump, FaFilter, FaCarSide, FaBolt, FaBoxOpen } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import CardSelector from '../../components/common/CardSelector'
import { useParts, useAddPart, useUpdatePart, useDeletePart } from '../../hooks/usePartHooks'

export default function Parts() {
  const { addToast } = useToast()
  
  const { data: parts = [], isLoading } = useParts()
  const addPartMut = useAddPart()
  const updatePartMut = useUpdatePart()
  const deletePartMut = useDeletePart()

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'General', unitPrice: '', stockQuantity: '' })

  const filtered = parts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleEditClick = (part) => {
    setEditingId(part._id)
    setForm({
      name: part.name,
      category: part.category || 'General',
      unitPrice: part.unitPrice,
      stockQuantity: part.stockQuantity
    })
    setShowModal(true)
  }

  const handleAddClick = () => {
    setEditingId(null)
    setForm({ name: '', category: 'General', unitPrice: '', stockQuantity: '' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name || form.unitPrice === '') return addToast('Name and Price are required', 'error')
    
    if (editingId) {
      updatePartMut.mutate({ id: editingId, data: form }, {
        onSuccess: () => {
          setShowModal(false)
          addToast('Part updated successfully', 'success')
        },
        onError: () => addToast('Failed to update part', 'error')
      })
    } else {
      addPartMut.mutate(form, {
        onSuccess: () => {
          setShowModal(false)
          addToast('Part added to inventory', 'success')
        },
        onError: () => addToast('Failed to add part', 'error')
      })
    }
  }

  const handleDelete = (id) => {
    deletePartMut.mutate(id, {
      onSuccess: () => addToast('Part removed from inventory', 'info'),
      onError: () => addToast('Failed to delete part', 'error')
    })
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2.5 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
        </div>
        <button onClick={handleAddClick} className="px-5 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(200,155,60,0.3)] hover:scale-105 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
          <FaPlus /> Add Part
        </button>
      </div>

      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-sm text-text-muted uppercase tracking-wider">
              <th className="pb-4 pl-4 font-semibold">Part Details</th>
              <th className="pb-4 font-semibold">Category</th>
              <th className="pb-4 font-semibold">Price</th>
              <th className="pb-4 font-semibold">Stock Level</th>
              <th className="pb-4 pr-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
               [1,2,3].map(n => <tr key={n}><td colSpan={5} className="py-4"><div className="h-12 bg-white/5 rounded-xl animate-pulse" /></td></tr>)
            )}
            {!isLoading && filtered.map((p, i) => (
              <motion.tr key={p._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-soft-dark border border-white/10 flex items-center justify-center text-text-muted"><FaTools /></div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-text-muted">{p._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-xs text-white bg-soft-dark px-2 py-1 rounded border border-white/5">{p.category || 'General'}</span>
                </td>
                <td className="py-4">
                  <span className="text-sm font-bold text-gold">₹{p.unitPrice?.toLocaleString()}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-soft-dark rounded-full overflow-hidden max-w-[100px]">
                      <div className={`h-full ${p.stockQuantity <= 10 ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (p.stockQuantity / 50) * 100)}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${p.stockQuantity <= 10 ? 'text-red-400' : 'text-white'}`}>{p.stockQuantity}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditClick(p)} className="p-2 text-text-muted hover:text-white transition-colors bg-soft-dark rounded-lg"><FaEdit /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-2 text-text-muted hover:text-red-400 transition-colors bg-soft-dark rounded-lg"><FaTrash /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {!isLoading && filtered.length === 0 && <div className="py-12 text-center text-text-muted">No parts found.</div>}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl z-10">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">{editingId ? 'Edit Part' : 'Add New Part'}</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Part Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. Brake Pads" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 block">Part Category</label>
                    <CardSelector 
                      value={form.category} 
                      onChange={val => setForm({...form, category: val})}
                      options={[
                        { value: 'Fluids', label: 'Fluids', icon: FaGasPump },
                        { value: 'Filters', label: 'Filters', icon: FaFilter },
                        { value: 'Brakes', label: 'Brakes', icon: FaCarSide },
                        { value: 'Electrical', label: 'Electrical', icon: FaBolt },
                        { value: 'General', label: 'General', icon: FaBoxOpen }
                      ]}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Stock Quantity</label>
                    <input type="number" value={form.stockQuantity} onChange={e => setForm({...form, stockQuantity: Number(e.target.value)})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Unit Price</label>
                  <input type="number" value={form.unitPrice} onChange={e => setForm({...form, unitPrice: Number(e.target.value)})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. 1500" />
                </div>

                <button onClick={handleSave} disabled={addPartMut.isPending || updatePartMut.isPending} className="w-full py-3.5 mt-4 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all disabled:opacity-50">
                  {editingId ? 'Save Changes' : 'Save Part'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
