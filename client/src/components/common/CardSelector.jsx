import { motion } from 'framer-motion'

export default function CardSelector({ value, onChange, options, className = "" }) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 ${className}`}>
      {options.map((opt) => {
        const isActive = value === opt.value
        const Icon = opt.icon
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 group ${
              isActive 
              ? 'bg-gold/10 border-gold shadow-[0_0_20px_rgba(200,155,60,0.1)]' 
              : 'bg-soft-dark/50 border-white/5 hover:border-white/20 hover:bg-white/5'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-2 transition-colors ${
              isActive ? 'text-gold' : 'text-text-muted group-hover:text-white'
            }`}>
              {Icon && <Icon />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${
              isActive ? 'text-white' : 'text-text-muted group-hover:text-text-muted'
            }`}>
              {opt.label}
            </span>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-4 h-4 bg-gold rounded-full flex items-center justify-center"
              >
                <div className="w-1.5 h-1.5 bg-deep-black rounded-full" />
              </motion.div>
            )}
          </button>
        )
      })}
    </div>
  )
}
