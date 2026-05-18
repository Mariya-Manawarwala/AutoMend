import { motion } from 'framer-motion'

export default function PillSelector({ value, onChange, options, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-2 p-1.5 bg-soft-dark/50 rounded-2xl border border-white/5 ${className}`}>
      {options.map((opt) => {
        const isActive = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`relative px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
              isActive ? 'text-deep-black' : 'text-text-muted hover:text-white'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="pill-bg"
                className="absolute inset-0 bg-gold rounded-xl shadow-[0_0_15px_rgba(200,155,60,0.3)]"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {opt.label}
              {opt.count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-md text-[8px] ${isActive ? 'bg-deep-black/20' : 'bg-white/10'}`}>
                  {opt.count}
                </span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
