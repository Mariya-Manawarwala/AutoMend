import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaWrench, FaCar, FaMoneyBillWave, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaBell, FaCalendarAlt, FaClipboardList, FaPlus, FaCheck } from 'react-icons/fa'
import { useAdminStats, useRevenueStats, useSystemHealth } from '../../hooks/useAdminHooks'
import { useAuth } from '../../context/AuthContext'
import PillSelector from '../../components/common/PillSelector'

export default function Overview({ setTab }) {
  const { user } = useAuth()
  const { data: stats, isLoading: statsLoading } = useAdminStats()
  const { data: revenueData, isLoading: revLoading } = useRevenueStats('6months')
  const { data: health, isLoading: healthLoading } = useSystemHealth()

  if (statsLoading) return <OverviewSkeleton />

  return (
    <div className="space-y-10 pb-10 max-w-[1400px] mx-auto">
      
      {/* ── GREETING HEADER ── */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-white italic uppercase tracking-tight leading-none">
          Hi, <span className="text-gold">{user?.name?.split(' ')[0] || 'Admin'}</span>!
        </h2>
        <h3 className="text-2xl md:text-3xl font-heading font-black text-white/40 italic uppercase tracking-tighter">
          What are your plans for today?
        </h3>
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mt-2 max-w-xl leading-relaxed">
          The AutoMend platform is designed to revolutionize the way you manage automotive services and track global performance in real-time.
        </p>
      </motion.div>

      {/* ── TOP SUMMARY CARDS (Matches Image Top Row) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Revenue Mastery', val: `₹${(stats?.stats?.totalRevenue?.value || 0).toLocaleString()}`, icon: FaMoneyBillWave, color: 'bg-gold', sub: 'Total earnings' },
          { label: 'Network Reach', val: stats?.stats?.totalCustomers?.value || 0, icon: FaUsers, color: 'bg-sierra', sub: 'Registered users' },
          { label: 'Partner Fleet', val: stats?.stats?.activeMechanics?.value || 0, icon: FaWrench, color: 'bg-emerald-500', sub: 'Verified mechanics' },
          { label: 'Live Operations', val: stats?.stats?.jobsInProgress?.value || 0, icon: FaCar, color: 'bg-blue-500', sub: 'Jobs in progress' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 group hover:border-gold/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className={`w-14 h-14 rounded-2xl ${c.color} flex items-center justify-center text-deep-black text-2xl shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
              <c.icon />
            </div>
            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{c.label}</p>
            <p className="text-3xl font-heading font-black text-white italic">{c.val}</p>
            <p className="text-[9px] font-black text-gold uppercase tracking-[0.2em] mt-3 opacity-0 group-hover:opacity-100 transition-opacity">{c.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── BENTO GRID (The Main Layout) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Notifications / Upcoming (Matches Left Widget) */}
        <div className="space-y-6">
          <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><FaBell className="text-gold" /> Notifications</h4>
              <button className="text-[10px] font-black text-text-muted hover:text-white transition-colors uppercase tracking-widest">Clear All</button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Emergency Roadside', time: '11:30 AM - 12:45 PM', date: 'Sat, 12 May', status: 'High' },
                { title: 'Mechanic Onboarding', time: '02:00 PM - 03:00 PM', date: 'Sat, 12 May', status: 'Routine' }
              ].map((n, i) => (
                <div key={i} className="p-5 rounded-[2rem] bg-soft-dark border border-white/5 group hover:bg-white/5 transition-all">
                   <p className="text-xs font-black text-white uppercase mb-2">{n.title}</p>
                   <div className="flex items-center gap-3 text-[10px] font-bold text-text-muted">
                     <FaCalendarAlt className="text-gold" /> {n.date}
                     <span className="w-1 h-1 rounded-full bg-white/20" />
                     {n.time}
                   </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5">
               <div className="p-5 rounded-[2rem] bg-gold/5 border border-gold/10 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-deep-black"><FaCheckCircle /></div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">Weekly Goal</p>
                    <p className="text-[10px] text-text-muted">You have 4 unread messages</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Today Tasks (Small Widget) */}
          <div className="bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5">
             <div className="flex items-center justify-between mb-6">
               <h4 className="text-sm font-black text-white uppercase tracking-widest">Today Tasks</h4>
               <button className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10"><FaPlus className="text-[10px]" /></button>
             </div>
             <div className="space-y-4">
               {['Review Payouts', 'Update Inventory'].map((t, i) => (
                 <div key={i} className="flex items-center gap-4 group">
                    <div className="w-5 h-5 rounded-md border border-gold/30 flex items-center justify-center transition-colors group-hover:bg-gold/10">
                       <FaCheck className="text-[8px] text-gold opacity-0 group-hover:opacity-100" />
                    </div>
                    <span className="text-xs font-bold text-text-muted uppercase tracking-widest group-hover:text-white">{t}</span>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* 2. Active Jobs / Assignments (Middle Widget) */}
        <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/5 shadow-2xl flex flex-col">
           <div className="flex items-center justify-between mb-8">
              <h4 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2"><FaClipboardList className="text-gold" /> Active Assignments</h4>
              <button className="text-[10px] font-black text-text-muted hover:text-white transition-colors uppercase tracking-widest">Edit Grid</button>
           </div>
           
           <div className="space-y-6 flex-1">
             {[
               { id: '#AM-2024', type: 'Engine Repair', name: 'Design Concept', label: 'High', color: 'bg-red-500/10 text-red-400' },
               { id: '#AM-2025', type: 'Full Service', name: 'Inspection Hub', label: 'Medium', color: 'bg-gold/10 text-gold' }
             ].map((a, i) => (
               <div key={i} className="p-6 rounded-[2.5rem] bg-soft-dark border border-white/5 group hover:border-gold/20 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{a.type}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${a.color}`}>{a.label}</span>
                  </div>
                  <h5 className="text-lg font-heading font-black text-white italic uppercase mb-4">{a.name}</h5>
                  <div className="flex items-center justify-between mt-4">
                     <div className="flex -space-x-2">
                        {[1,2,3].map(m => <div key={m} className="w-6 h-6 rounded-full bg-soft-dark border-2 border-card flex items-center justify-center text-[8px] font-black text-gold">M</div>)}
                     </div>
                     <span className="text-[10px] font-black text-text-muted uppercase">{a.id}</span>
                  </div>
               </div>
             ))}
             
             <button className="w-full py-5 rounded-2xl bg-white/5 border border-dashed border-white/10 text-[10px] font-black text-text-muted uppercase tracking-[0.2em] hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
               <FaPlus /> Add New Assignment
             </button>
           </div>
        </div>

        {/* 3. Calendar & Analytics (Right Column) */}
        <div className="space-y-8">
          {/* Monthly View (Matches Right Widget) */}
          <div className="bg-card/40 backdrop-blur-xl rounded-[3rem] p-8 border border-white/5">
             <div className="flex items-center justify-between mb-8">
                <h4 className="text-sm font-black text-white uppercase tracking-widest italic">May 2026</h4>
                <div className="flex gap-2">
                   <button className="w-6 h-6 rounded-lg bg-white/5 text-[10px] flex items-center justify-center hover:bg-white/10">{'<'}</button>
                   <button className="w-6 h-6 rounded-lg bg-white/5 text-[10px] flex items-center justify-center hover:bg-white/10">{'>'}</button>
                </div>
             </div>
             
             {/* Simple Calendar Strip */}
             <div className="grid grid-cols-7 gap-2 text-center mb-6">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <span key={d} className="text-[8px] font-black text-text-muted uppercase">{d}</span>)}
                {[11,12,13,14,15,16,17].map(d => (
                  <div key={d} className={`py-2 rounded-xl text-[10px] font-black transition-colors ${d === 12 ? 'bg-gold text-deep-black shadow-lg shadow-gold/20' : 'text-white/40 hover:bg-white/5'}`}>
                    {d}
                  </div>
                ))}
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                   <span className="text-[10px] font-black text-text-muted">04:30 - 05:00 PM</span>
                   <span className="text-xs font-black text-white italic uppercase tracking-tight">Staff Sync</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gold text-deep-black shadow-xl shadow-gold/10">
                   <span className="text-[10px] font-black opacity-60">11:30 - 12:30 PM</span>
                   <span className="text-xs font-black italic uppercase tracking-tight">VIP Client</span>
                </div>
             </div>
          </div>

          {/* Analytics Progress Cards (Bottom Right) */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-6 rounded-[2.5rem] bg-card/40 border border-white/5 text-center relative overflow-hidden group">
                <div className="relative w-16 h-16 mx-auto mb-4">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * 0.9)} className="text-gold" />
                   </svg>
                   <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">90%</span>
                </div>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Growth</p>
             </div>
             
             <div className="p-6 rounded-[2.5rem] bg-card/40 border border-white/5 text-center relative overflow-hidden group">
                <div className="relative w-16 h-16 mx-auto mb-4">
                   <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={176} strokeDashoffset={176 - (176 * 0.65)} className="text-sierra" />
                   </svg>
                   <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-white">65%</span>
                </div>
                <p className="text-[9px] font-black text-text-muted uppercase tracking-widest">Efficiency</p>
             </div>
          </div>

          {/* Go Premium / System Health CTA */}
          <div className="bg-gold rounded-[2.5rem] p-8 text-deep-black relative overflow-hidden shadow-2xl group cursor-pointer">
             <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-deep-black/10 rounded-full group-hover:scale-125 transition-transform" />
             <FaWrench className="text-3xl mb-4" />
             <h4 className="text-lg font-heading font-black italic uppercase leading-tight mb-2">Optimize Platform</h4>
             <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-6">Access advanced analytics and automated mechanic payouts.</p>
             <button className="px-6 py-2.5 bg-deep-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-deep-black/80 transition-colors">Upgrade Now</button>
          </div>
        </div>

      </div>
    </div>
  )
}

function OverviewSkeleton() {
  return (
    <div className="space-y-10 animate-pulse p-8">
      <div className="h-16 w-1/3 bg-card rounded-2xl" />
      <div className="grid grid-cols-4 gap-6">
        {[1,2,3,4].map(n => <div key={n} className="h-40 bg-card rounded-[2.5rem]" />)}
      </div>
      <div className="grid grid-cols-3 gap-8">
        <div className="h-[600px] bg-card rounded-[3rem]" />
        <div className="h-[600px] bg-card rounded-[3rem]" />
        <div className="h-[600px] bg-card rounded-[3rem]" />
      </div>
    </div>
  )
}

