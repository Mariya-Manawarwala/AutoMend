import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCircle, FaExclamationTriangle } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Profile() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [form, setForm] = useState({ 
    name: user?.name || 'Riya Sharma', 
    email: user?.email || 'riya.sharma@email.com', 
    phone: '+91 98765-43210', 
    dob: '1998-06-12', 
    language: 'English', 
    address: '123, Green Park, Mumbai, Maharashtra, 400001',
    avatar: user?.avatar || ''
  })

  const handleSave = () => {
    addToast('Profile updated successfully!', 'success')
  }

  const handleDelete = () => {
    addToast('Profile deleted successfully.', 'success')
    setShowDeleteModal(false)
  }

  return (
    <div className="max-w-4xl pb-10">
      
      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Profile Picture Panel */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-soft-dark border-2 border-gold/30 flex items-center justify-center text-5xl text-text-muted mb-4 shadow-[0_0_15px_rgba(200,155,60,0.2)] overflow-hidden">
              {form.avatar ? <img src={form.avatar} alt="Profile" className="w-full h-full object-cover" /> : <FaUserCircle />}
            </div>
            <div className="w-full mt-2">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block text-center">Profile Image URL (Cloudinary)</label>
              <input value={form.avatar || ''} onChange={e => setForm({...form, avatar: e.target.value})} placeholder="https://res.cloudinary.com/..." className="w-full px-3 py-2 bg-soft-dark border border-white/10 rounded-lg text-xs text-white focus:outline-none focus:border-gold/50 transition-all text-center" />
            </div>
          </div>

          {/* Form Fields */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Preferred Language</label>
                <select value={form.language} onChange={e => setForm({...form, language: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all appearance-none">
                  <option>English</option><option>Hindi</option><option>Marathi</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Phone Number</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Address</label>
              <textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none" />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button onClick={() => setShowDeleteModal(true)} className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">
                Delete Profile
              </button>
              <button onClick={handleSave} className="px-8 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-deep-black/90 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-card border border-red-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(239,68,68,0.15)] text-center">
              
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-3xl mx-auto mb-4 border border-red-500/20">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">Delete Profile?</h3>
              <p className="text-sm text-text-muted mb-6">Are you sure you want to delete your profile? This action cannot be undone and all your data will be permanently removed.</p>

              <div className="flex flex-col gap-3">
                <button onClick={handleDelete} className="w-full py-3 bg-red-500 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-colors">
                  Yes, Delete My Profile
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full py-3 bg-soft-dark border border-white/10 text-white rounded-xl font-bold hover:bg-white/5 transition-colors">
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
