import { useState } from 'react'
import { FaSave, FaWarehouse, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

export default function Settings() {
  const { addToast } = useToast()
  const [form, setForm] = useState({
    garageName: 'AutoMend Premium Auto Care',
    email: 'admin@automend.com',
    phone: '+1 800-123-4567',
    address: '123 Luxury Drive, Automotive District, Metro City',
    operatingHours: '08:00 AM - 08:00 PM',
    taxRate: '18',
    currency: 'INR (₹)'
  })

  const handleSave = () => {
    addToast('Global settings updated successfully.', 'success')
  }

  return (
    <div className="max-w-4xl pb-10">
      
      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-xl">
        <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3 mb-6 border-b border-white/5 pb-4"><FaWarehouse className="text-gold" /> Garage Identity</h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Garage Name</label>
              <div className="relative">
                <FaWarehouse className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={form.garageName} onChange={e => setForm({...form, garageName: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Contact Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Support Phone</label>
              <div className="relative">
                <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Operating Hours</label>
              <input value={form.operatingHours} onChange={e => setForm({...form, operatingHours: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Headquarters Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-4 text-text-muted" />
              <textarea rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all resize-none" />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-heading font-bold text-white flex items-center gap-3 mb-6 border-b border-white/5 pb-4 mt-10"><FaSave className="text-gold" /> System Preferences</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Tax Rate (%)</label>
            <input type="number" value={form.taxRate} onChange={e => setForm({...form, taxRate: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 block">Base Currency</label>
            <select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className="w-full px-4 py-3 bg-soft-dark border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all">
              <option>INR (₹)</option><option>USD ($)</option><option>EUR (€)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <button onClick={handleSave} className="px-8 py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(200,155,60,0.5)] hover:scale-105 transition-all flex items-center gap-2">
            <FaSave /> Save Global Settings
          </button>
        </div>

      </div>

    </div>
  )
}
