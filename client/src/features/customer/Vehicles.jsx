import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaCar, FaGasPump, FaTimes, FaCloudUploadAlt, FaTrash, FaEdit, FaCalendarAlt, FaBolt, FaLeaf, FaBurn } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { useVehicles, useAddVehicle, useDeleteVehicle, useUpdateVehicle } from '../../hooks/useVehicleHooks'
import LuxurySelect from '../../components/common/LuxurySelect'
import CardSelector from '../../components/common/CardSelector'

export default function Vehicles() {
  const { addToast } = useToast()
  const { data: vehicles = [], isLoading, isError } = useVehicles()
  const addVehicleMutation = useAddVehicle()
  const updateVehicleMutation = useUpdateVehicle()
  const deleteVehicleMutation = useDeleteVehicle()
  
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ brand: '', model: '', plate: '', fuel: 'Petrol', yearBought: new Date().getFullYear() })
  const [selectedFile, setSelectedFile] = useState(null)

  const handleEdit = (v) => {
    setEditingId(v._id)
    setForm({ 
      brand: v.brand, 
      model: v.model, 
      plate: v.numberPlate || v.plate, 
      fuel: v.fuelType || v.fuel || 'Petrol',
      yearBought: v.yearBought || new Date().getFullYear(),
      image: v.image
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingId(null)
    setForm({ brand: '', model: '', plate: '', fuel: 'Petrol', yearBought: new Date().getFullYear(), image: null })
    setSelectedFile(null)
  }

  const handleSave = async () => {
    if (!form.brand || !form.model || !form.plate) return addToast('Please fill all fields', 'error')
    
    try {
      // We use FormData if there's an image, or just JSON if not. 
      // But update might also need FormData if image is changed.
      const formData = new FormData()
      formData.append('brand', form.brand)
      formData.append('model', form.model)
      formData.append('numberPlate', form.plate)
      formData.append('fuelType', form.fuel)
      formData.append('yearBought', form.yearBought)
      if (selectedFile) {
        formData.append('vehicleImage', selectedFile)
      } else if (!form.image) {
        formData.append('removeImage', 'true')
      }

      if (editingId) {
        await updateVehicleMutation.mutateAsync({ id: editingId, vehicleData: formData })
        addToast('Vehicle updated successfully!', 'success')
      } else {
        await addVehicleMutation.mutateAsync(formData)
        addToast('Vehicle added to your garage!', 'success')
      }
      
      handleClose()
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to save vehicle', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      try {
        await deleteVehicleMutation.mutateAsync(id)
        addToast('Vehicle removed', 'success')
      } catch (error) {
        addToast('Failed to remove vehicle', 'error')
      }
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-white">Your Garage</h2>
          <p className="text-xs text-text-muted">Manage your vehicles and service history</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-5 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all flex items-center gap-2">
          <FaPlus /> Add Vehicle
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-48 bg-card/50 rounded-2xl animate-pulse border border-white/5" />)}
        </div>
      ) : isError ? (
        <div className="py-20 text-center bg-card/30 rounded-3xl border border-dashed border-red-500/20">
          <p className="text-red-400">Failed to load vehicles. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {vehicles.map((v, i) => (
              <motion.div key={v._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.1 }}
                className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg relative overflow-hidden group hover:-translate-y-1 transition-transform">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="w-16 h-16 rounded-xl bg-soft-dark border border-white/10 flex items-center justify-center text-2xl text-gold group-hover:scale-110 transition-transform overflow-hidden shadow-inner">
                    {v.image ? <img src={v.image} alt={v.brand} className="w-full h-full object-cover" /> : <FaCar />}
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(v)} className="p-2 text-text-muted hover:text-gold transition-colors">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(v._id)} className="p-2 text-text-muted hover:text-red-500 transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-heading font-bold text-white">{v.brand} {v.model}</h3>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-black text-gold tracking-widest uppercase">{v.numberPlate || v.plate}</p>
                  <p className="text-[10px] text-text-muted flex items-center gap-1"><FaCalendarAlt className="text-[8px]" /> {v.yearBought}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="text-xs font-black uppercase tracking-widest text-text-muted">{v.type || 'Standard'}</span>
                  <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-white bg-soft-dark px-3 py-1 rounded-full border border-white/5"><FaGasPump className="text-gold" /> {v.fuelType || v.fuel || 'Petrol'}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {vehicles.length === 0 && (
            <div className="col-span-full py-20 text-center bg-card/30 rounded-3xl border border-dashed border-white/10">
              <FaCar className="text-4xl text-text-muted mx-auto mb-4 opacity-20" />
              <p className="text-text-muted">Your garage is empty. Add your first vehicle!</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClose} className="absolute inset-0 bg-deep-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-card border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto custom-scrollbar">
              
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-heading font-bold text-white">{editingId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                <button onClick={handleClose} className="text-text-muted hover:text-white transition-colors text-xl">&times;</button>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  {(selectedFile || form.image) ? (
                    <div className="relative w-full h-40 rounded-2xl overflow-hidden border border-white/10 bg-soft-dark shadow-inner group/preview">
                      <img 
                        src={selectedFile ? URL.createObjectURL(selectedFile) : form.image} 
                        alt="Vehicle" 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                        <button 
                          onClick={() => {
                            setSelectedFile(null);
                            setForm(prev => ({ ...prev, image: null }));
                          }} 
                          className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-3 p-8 bg-soft-dark border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-gold/50 hover:bg-gold/5 transition-all group">
                      <FaCloudUploadAlt className="text-3xl text-text-muted group-hover:text-gold transition-colors" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Upload Vehicle Image</span>
                      <input type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files[0])} accept="image/*" />
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Brand</label>
                    <input value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner" placeholder="e.g. Honda" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Model</label>
                    <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner" placeholder="e.g. City" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Number Plate</label>
                    <input value={form.plate} onChange={e => setForm({...form, plate: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all uppercase shadow-inner" placeholder="MH-01-AB-1234" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Year Bought</label>
                    <input type="number" value={form.yearBought} onChange={e => setForm({...form, yearBought: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner" placeholder="2024" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-3 block">Select Fuel Type</label>
                  <CardSelector 
                    value={form.fuel} 
                    onChange={val => setForm({...form, fuel: val})}
                    options={[
                      { value: 'Petrol', label: 'Petrol', icon: FaGasPump },
                      { value: 'Diesel', label: 'Diesel', icon: FaBurn },
                      { value: 'CNG', label: 'CNG', icon: FaLeaf },
                      { value: 'EV', label: 'Electric', icon: FaBolt },
                      { value: 'Hybrid', label: 'Hybrid', icon: FaLeaf }
                    ]}
                  />
                </div>

                <button 
                  onClick={handleSave} 
                  disabled={addVehicleMutation.isPending || updateVehicleMutation.isPending}
                  className="w-full py-4 mt-4 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-xs font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(200,155,60,0.5)] hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {addVehicleMutation.isPending || updateVehicleMutation.isPending ? 'Saving...' : editingId ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
