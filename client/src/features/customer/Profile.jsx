import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCircle, FaExclamationTriangle, FaCamera, FaSave, FaTrash } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useProfile, useUpdateProfile, useDeleteAccount } from '../../hooks/useProfileHooks'

export default function Profile() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const { data: profileData, isLoading: isProfileLoading } = useProfile()
  const updateProfileMutation = useUpdateProfile()
  const deleteAccountMutation = useDeleteAccount()
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const fileInputRef = useRef(null)
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    age: '',
    dob: '', 
    address: '',
    profilePhoto: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    if (profileData) {
      setForm({
        name: profileData.name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        age: profileData.age || '',
        dob: profileData.dateOfBirth ? profileData.dateOfBirth.split('T')[0] : '',
        address: profileData.address || '',
        profilePhoto: profileData.profilePhoto || ''
      })
    }
  }, [profileData])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    try {
      const profileData = {
        fullName: form.name, // The backend uses fullName
        name: form.name,     // Keep name for legacy
        emailId: form.email,
        phone: form.phone,
        age: form.age,
        dateOfBirth: form.dob,
        address: form.address,
        profilePhoto: selectedFile, // Pass the file object directly
      }

      await updateProfileMutation.mutateAsync(profileData)
      addToast('Profile updated successfully!', 'success')
      setSelectedFile(null)
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update profile', 'error')
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAccountMutation.mutateAsync()
      addToast('Account deleted successfully.', 'success')
      setShowDeleteModal(false)
    } catch (error) {
      addToast('Failed to delete account', 'error')
    }
  }

  if (isProfileLoading) return <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-4xl pb-10">
      
      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Profile Picture Panel */}
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div 
              onClick={() => fileInputRef.current.click()}
              className="w-40 h-40 rounded-full bg-soft-dark border-4 border-gold/20 flex items-center justify-center text-6xl text-text-muted mb-4 shadow-[0_0_25px_rgba(200,155,60,0.15)] overflow-hidden cursor-pointer group relative"
            >
              {(previewUrl || form.profilePhoto) ? (
                <img src={previewUrl || form.profilePhoto} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <FaUserCircle />
              )}
              <div className="absolute inset-0 bg-deep-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-gold gap-2">
                <FaCamera className="text-2xl" />
                <span className="text-[10px] font-black uppercase tracking-widest">Change Photo</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <p className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Member Since {new Date(profileData?.createdAt).getFullYear()}</p>
          </div>

          {/* Form Fields */}
          <div className="w-full md:w-2/3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Full Name</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Age</label>
                  <input type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Date of Birth</label>
                  <input type="date" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all [color-scheme:dark]" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Phone Number</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Address</label>
              <textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none" placeholder="Enter your full address..." />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-white/5">
              <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 text-sm font-bold text-red-500/60 hover:text-red-500 transition-colors">
                <FaTrash className="text-xs" /> Delete Account
              </button>
              <button 
                onClick={handleSave} 
                disabled={updateProfileMutation.isPending}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? 'Saving...' : <><FaSave /> Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-deep-black/90 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-card border border-red-500/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(239,68,68,0.15)] text-center z-10">
              
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-3xl mx-auto mb-4 border border-red-500/20">
                <FaExclamationTriangle />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-2">Delete Account?</h3>
              <p className="text-sm text-text-muted mb-6">This action is irreversible. All your vehicles, requests, and history will be permanently deleted.</p>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDelete} 
                  disabled={deleteAccountMutation.isPending}
                  className="w-full py-3.5 bg-red-500 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {deleteAccountMutation.isPending ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full py-3.5 bg-soft-dark border border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/5 transition-colors">
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
