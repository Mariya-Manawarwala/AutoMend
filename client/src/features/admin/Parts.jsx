import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTools, FaPlus, FaSearch, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

const MOCK_PARTS = [
  { id: 'PRT-101', name: 'Synthetic Engine Oil (5W-30)', category: 'Fluids', price: '₹4,500', stock: 45, threshold: 10 },
  { id: 'PRT-102', name: 'Premium Oil Filter', category: 'Filters', price: '₹800', stock: 12, threshold: 15 },
  { id: 'PRT-103', name: 'Ceramic Brake Pads (Front)', category: 'Brakes', price: '₹3,500', stock: 5, threshold: 10 },
  { id: 'PRT-104', name: 'AGM Car Battery (12V)', category: 'Electrical', price: '₹8,500', stock: 20, threshold: 5 },
]

export default function Parts() {
  const { addToast } = useToast()
  const [parts, setParts] = useState(MOCK_PARTS)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', category: 'General', price: '', stock: '' })

  const filtered = parts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))

  const handleSave = () => {
    if (!form.name || !form.price) return addToast('Name and Price are required', 'error')
    setParts([...parts, { id: `PRT-${Date.now().toString().slice(-3)}`, ...form, threshold: 10 }])
    setShowModal(false)
    addToast('Part added to inventory', 'success')
  }

  const handleDelete = (id) => {
    setParts(parts.filter(p => p.id !== id))
    addToast('Part removed from inventory', 'info')
  }

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-lg">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..." className="w-full pl-10 pr-4 py-2.5 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
        </div>
        <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(200,155,60,0.3)] hover:scale-105 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
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
            {filtered.map((p, i) => (
              <motion.tr key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-soft-dark border border-white/10 flex items-center justify-center text-text-muted"><FaTools /></div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-text-muted">{p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span className="text-xs text-white bg-soft-dark px-2 py-1 rounded border border-white/5">{p.category}</span>
                </td>
                <td className="py-4">
                  <span className="text-sm font-bold text-gold">{p.price}</span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-soft-dark rounded-full overflow-hidden max-w-[100px]">
                      <div className={`h-full ${p.stock <= p.threshold ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }} />
                    </div>
                    <span className={`text-sm font-bold ${p.stock <= p.threshold ? 'text-red-400' : 'text-white'}`}>{p.stock}</span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-text-muted hover:text-white transition-colors bg-soft-dark rounded-lg"><FaEdit /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-2 text-text-muted hover:text-red-400 transition-colors bg-soft-dark rounded-lg"><FaTrash /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-12 text-center text-text-muted">No parts found.</div>}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-3xl p-8 shadow-2xl z-10">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">Add New Part</h3>
                <button onClick={() => setShowModal(false)} className="text-text-muted hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Part Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. Brake Pads" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Category</label>
                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50">
                      <option>Fluids</option><option>Filters</option><option>Brakes</option><option>Electrical</option><option>General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Stock Quantity</label>
                    <input type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Unit Price</label>
                  <input value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50" placeholder="e.g. ₹1500" />
                </div>

                <button onClick={handleSave} className="w-full py-3.5 mt-4 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
                  Save Part
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
