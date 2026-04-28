import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaCalendarAlt, FaTimes, FaRobot } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="fixed bottom-[30px] right-[30px] z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="bg-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] min-w-[200px]">
            <p className="text-xs text-text-muted font-body mb-3 uppercase tracking-wider">Quick Actions</p>
            <button onClick={() => { navigate('/booking'); setOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-white hover:bg-white/5 transition-all text-left">
              <FaCalendarAlt className="text-gold" /> Book Service
            </button>
            <button onClick={() => { navigate('/services'); setOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-white hover:bg-white/5 transition-all text-left">
              <FaPlus className="text-gold" /> View Services
            </button>
            <button onClick={() => { navigate('/ai-assistant'); setOpen(false) }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-white hover:bg-white/5 transition-all text-left">
              <FaRobot className="text-gold" /> AI Assistant
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-r from-gold to-light-gold flex items-center justify-center shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all">
        <motion.div animate={{ rotate: open ? 45 : 0 }}>
          {open ? <FaTimes className="text-deep-black text-lg" /> : <FaPlus className="text-deep-black text-lg" />}
        </motion.div>
      </motion.button>
    </div>
  )
}
