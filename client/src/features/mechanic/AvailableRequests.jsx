import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaCarSide } from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'

const LIVE_REQUESTS = [
  { id: 'REQ-1045', vehicle: '2023 Tesla Model 3', issue: 'Battery drain issue', type: 'Home Service', distance: '1.2 km away', date: 'Today, 2:00 PM' },
  { id: 'REQ-1046', vehicle: '2021 Toyota Fortuner', issue: 'Brake pad replacement', type: 'Garage Service', distance: 'In Garage', date: 'Today, 3:30 PM' },
  { id: 'REQ-1047', vehicle: '2022 Honda City', issue: 'Regular Maintenance', type: 'Home Service', distance: '4.5 km away', date: 'Tomorrow, 10:00 AM' },
]

import { useRequests, useAcceptRequest } from '../../hooks/useRequestHooks'

export default function AvailableRequests({ setTab }) {
  const { addToast } = useToast()
  const { data: requests = [], isLoading } = useRequests('mechanic')
  const acceptMutation = useAcceptRequest()

  const handleAccept = async (id) => {
    try {
      await acceptMutation.mutateAsync(id)
      addToast(`Job ${id} accepted successfully! Moved to My Jobs.`, 'success')
      setTab('jobs')
    } catch (error) {
      addToast('Failed to accept job', 'error')
    }
  }

  return (
    <div className="space-y-6 pb-10">
      
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-muted">Live feed of service requests. First to accept gets the job.</p>
        <span className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live System Active
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => (
            <div key={n} className="h-64 bg-card/50 rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {requests.map((r, i) => (
            <motion.div layout key={r.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} transition={{ duration: 0.3 }}
              className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-gold/30 shadow-[0_0_15px_rgba(200,155,60,0.1)] hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(200,155,60,0.2)] transition-all flex flex-col group">
              
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-bold text-gold mb-1">{r.id}</p>
                  <h4 className="text-lg font-heading font-bold text-white">{r.vehicle}</h4>
                </div>
                <div className="w-10 h-10 rounded-full bg-soft-dark border border-white/10 flex items-center justify-center text-text-muted group-hover:text-gold transition-colors">
                  <FaCarSide />
                </div>
              </div>

              <div className="flex-1 space-y-3 mb-6">
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Reported Issue</p>
                  <p className="text-sm font-medium text-white">{r.issue}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/5">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <FaMapMarkerAlt className="text-gold" /> {r.distance}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <FaCalendarAlt className="text-gold" /> {r.date}
                  </div>
                </div>
                <div className="text-xs font-bold text-white bg-soft-dark w-max px-2 py-1 rounded border border-white/5">{r.type}</div>
              </div>

              <button onClick={() => handleAccept(r.id)} className="w-full py-3 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(200,155,60,0.5)] transition-all flex items-center justify-center gap-2">
                <FaCheck /> Accept Job
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
        
        {(!isLoading && requests.length === 0) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-20 text-center text-text-muted bg-card/50 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 rounded-full bg-soft-dark border border-white/5 flex items-center justify-center mx-auto mb-4 opacity-50">
              <span className="w-4 h-4 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="font-heading text-lg text-white mb-1">Waiting for new requests...</p>
            <p>You'll be notified immediately when a job comes in.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
