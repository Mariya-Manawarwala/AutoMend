import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheck, FaBell, FaCheckDouble } from 'react-icons/fa'

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'Your request REQ-1024 has been accepted by James R.', time: '2 min ago', read: false },
  { id: 2, text: 'Your payment of ₹6,850 was successful.', time: '1 hour ago', read: false },
  { id: 3, text: 'Your request REQ-1022 has been completed.', time: '3 hours ago', read: true },
  { id: 4, text: 'New coupon WELCOME10 is available for you!', time: '1 day ago', read: true },
  { id: 5, text: 'Your review has been submitted successfully.', time: '2 days ago', read: true },
]

import { useNotifications, useMarkRead } from '../../hooks/useNotificationHooks'

export default function Notifications() {
  const { data: notifications = [], isLoading } = useNotifications()
  const markReadMutation = useMarkRead()

  const handleMarkAsRead = (id) => {
    markReadMutation.mutate(id)
  }

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markReadMutation.mutate(n.id)
    })
  }

  return (
    <div className="max-w-3xl space-y-6 pb-10">
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-text-muted">Stay updated with your latest activities.</p>
        <button onClick={markAllAsRead} className="text-sm font-bold text-gold hover:text-light-gold flex items-center gap-2">
          <FaCheckDouble /> Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {isLoading ? (
            [1,2,3].map(n => <div key={n} className="h-16 bg-card/50 rounded-2xl animate-pulse border border-white/5" />)
          ) : notifications.map((n, i) => (
            <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => handleMarkAsRead(n.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${n.read ? 'bg-transparent border-white/5' : 'bg-card/80 border-gold/20 shadow-[0_0_15px_rgba(200,155,60,0.1)]'}`}>
              
              <div className="mt-1 relative">
                <FaBell className={n.read ? 'text-white/20' : 'text-gold'} />
                {!n.read && <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-card shadow-[0_0_5px_rgba(239,68,68,0.8)]" />}
              </div>

              <div className="flex-1">
                <p className={`text-sm font-medium ${n.read ? 'text-text-muted' : 'text-white'}`}>{n.text}</p>
                <p className="text-xs text-white/30 mt-1">{n.time}</p>
              </div>

              {!n.read && (
                <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xs shrink-0">
                  <FaCheck />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
