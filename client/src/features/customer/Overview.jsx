import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaCar, FaPlus, FaCreditCard, FaFileAlt, FaCog } from 'react-icons/fa'

export default function Overview({ setTab }) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="space-y-8 pb-10">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { l: 'Total Requests', v: '8', sub: 'All time', color: 'text-white', border: 'hover:border-white/20' },
          { l: 'Completed Jobs', v: '6', sub: 'All time', color: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
          { l: 'Active Requests', v: '2', sub: 'Currently', color: 'text-sierra', border: 'hover:border-sierra/30' },
          { l: 'Total Spent', v: '₹28,450', sub: 'All time', color: 'text-gold', border: 'hover:border-gold/30' }
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 transition-all duration-300 hover:-translate-y-1 shadow-lg ${s.border}`}>
            <p className="text-sm font-body text-text-muted mb-2">{s.l}</p>
            <div className="flex items-end justify-between">
              <p className={`text-4xl font-heading font-bold ${s.color}`}>{s.v}</p>
              <span className="text-xs text-text-muted mb-1">{s.sub}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Active Request Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="text-xl font-heading font-bold text-white">Active Request</h3>
            <span className="px-3 py-1 rounded-full text-xs font-bold border bg-sierra/10 text-sierra border-sierra/20 shadow-[0_0_10px_rgba(169,120,95,0.2)]">In Progress</span>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-full md:w-1/3 aspect-video rounded-xl bg-soft-dark border border-white/5 overflow-hidden flex items-center justify-center">
              <img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80" alt="Vehicle" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="w-full md:w-2/3 space-y-4">
              <div>
                <p className="text-sm text-gold font-bold mb-1">REQ-1023</p>
                <h4 className="text-2xl font-heading font-bold text-white">2024 BMW X5</h4>
                <p className="text-sm text-text-muted flex items-center gap-2 mt-1"><FaCog className="text-xs" /> Engine making weird noise</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                  <p className="text-xs text-text-muted mb-1">Schedule</p>
                  <p className="text-sm text-white font-medium">May 22, 2026 • 10:30 AM</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Location</p>
                  <p className="text-sm text-white font-medium">Home Service</p>
                </div>
              </div>
              <div className="pt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-soft-dark border border-gold/30 flex items-center justify-center text-xs font-bold text-gold">JR</div>
                  <div className="text-sm"><p className="text-white font-medium">James R.</p><p className="text-text-muted text-xs">Mechanic</p></div>
                </div>
                <button onClick={() => setShowDetails(true)} className="px-6 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold hover:shadow-[0_0_15px_rgba(200,155,60,0.4)] hover:scale-105 transition-all">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-deep-black/90 backdrop-blur-sm" onClick={() => setShowDetails(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-2xl bg-card border border-white/10 rounded-3xl p-8 shadow-2xl">
              <button onClick={() => setShowDetails(false)} className="absolute top-4 right-4 text-text-muted hover:text-white text-xl">&times;</button>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Request REQ-1023</h2>
              <p className="text-sm text-text-muted mb-6">Detailed view of your active service request.</p>
              
              <div className="space-y-6">
                <div className="bg-soft-dark border border-white/5 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-card flex items-center justify-center overflow-hidden"><img src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80" alt="Car" className="w-full h-full object-cover" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-white">2024 BMW X5</h4>
                    <p className="text-sm text-gold">Engine Diagnosis</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-soft-dark border border-white/5 p-4 rounded-xl">
                    <p className="text-xs text-text-muted mb-1">Assigned Mechanic</p>
                    <p className="text-sm font-bold text-white">James Rodriguez</p>
                  </div>
                  <div className="bg-soft-dark border border-white/5 p-4 rounded-xl">
                    <p className="text-xs text-text-muted mb-1">Status</p>
                    <p className="text-sm font-bold text-sierra">In Progress</p>
                  </div>
                </div>

                <div className="bg-soft-dark border border-white/5 p-4 rounded-xl">
                  <p className="text-xs text-text-muted mb-2">Customer Notes</p>
                  <p className="text-sm text-white">"Engine is making a weird rattling noise when I accelerate past 40 mph. It started yesterday."</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Booking Shortcuts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-xl flex flex-col">
          <h3 className="text-lg font-heading font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4 flex-1">
            <button onClick={() => setTab('add-request')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-soft-dark border border-white/5 hover:border-gold/30 hover:bg-gold/5 transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><FaPlus /></div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-gold transition-colors">Book New Service</p>
                <p className="text-xs text-text-muted">Create a new service request</p>
              </div>
            </button>
            <button onClick={() => setTab('vehicles')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-soft-dark border border-white/5 hover:border-white/20 transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform"><FaCar /></div>
              <div>
                <p className="text-sm font-bold text-white">My Vehicles</p>
                <p className="text-xs text-text-muted">Manage your vehicles</p>
              </div>
            </button>
            <button onClick={() => setTab('requests')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-soft-dark border border-white/5 hover:border-white/20 transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform"><FaFileAlt /></div>
              <div>
                <p className="text-sm font-bold text-white">Track Requests</p>
                <p className="text-xs text-text-muted">Check request status</p>
              </div>
            </button>
            <button onClick={() => setTab('payments')} className="w-full flex items-center gap-4 p-4 rounded-xl bg-soft-dark border border-white/5 hover:border-white/20 transition-all group text-left">
              <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform"><FaCreditCard /></div>
              <div>
                <p className="text-sm font-bold text-white">Payment History</p>
                <p className="text-xs text-text-muted">View your payments</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
