import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronDown } from 'react-icons/fa'

export default function LuxurySelect({ value, onChange, options, icon: Icon, className = "" }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-soft-dark/50 px-3 py-2 rounded-xl border border-white/10 hover:border-gold/30 hover:bg-white/5 transition-all w-full text-left"
      >
        {Icon && <Icon className="text-[10px] text-gold" />}
        <span className="text-white text-[9px] font-black uppercase tracking-widest flex-1">
          {selectedOption?.label}
        </span>
        <FaChevronDown className={`text-[8px] text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[9999] mt-2 w-full min-w-[140px] bg-[#1a1a1a] backdrop-blur-2xl border border-white/15 rounded-xl p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all mb-0.5 last:mb-0 ${
                    value === opt.value 
                    ? 'bg-gold text-deep-black' 
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
