import { motion } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  return (
    <motion.div className="fixed inset-0 z-[200] bg-deep-black flex flex-col items-center justify-center overflow-hidden" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-warm-brown/20 rounded-full blur-[100px]" />
      </div>
      <div className="absolute top-[58%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative mb-12">
        <div className="animate-drift relative">
          <div className="absolute -left-6 top-4 w-4 h-4 rounded-full bg-white/10 blur-sm animate-smoke" />
          <div className="absolute -left-10 top-2 w-5 h-5 rounded-full bg-white/8 blur-md animate-smoke-d1" />
          <div className="absolute -left-14 top-6 w-6 h-6 rounded-full bg-white/5 blur-lg animate-smoke-d2" />
          <svg width="120" height="50" viewBox="0 0 120 50" fill="none">
            <path d="M20 30 L30 15 L50 10 L85 10 L100 20 L110 25 L110 35 L10 35 L10 30 Z" fill="url(#car-grad)" stroke="#C89B3C" strokeWidth="1" />
            <path d="M35 16 L48 12 L48 25 L32 25 Z" fill="#151515" stroke="#C89B3C" strokeWidth="0.5" opacity="0.8" />
            <path d="M52 12 L82 12 L95 22 L52 22 Z" fill="#151515" stroke="#C89B3C" strokeWidth="0.5" opacity="0.8" />
            <rect x="105" y="24" width="8" height="4" rx="1" fill="#E6B85C" opacity="0.9" />
            <circle cx="30" cy="37" r="8" fill="#0E0E0E" stroke="#C89B3C" strokeWidth="1.5" />
            <circle cx="30" cy="37" r="3" fill="#C89B3C" />
            <circle cx="90" cy="37" r="8" fill="#0E0E0E" stroke="#C89B3C" strokeWidth="1.5" />
            <circle cx="90" cy="37" r="3" fill="#C89B3C" />
            <defs><linearGradient id="car-grad" x1="0" y1="0" x2="120" y2="0"><stop offset="0%" stopColor="#1C1C1C" /><stop offset="50%" stopColor="#2A2A2A" /><stop offset="100%" stopColor="#1C1C1C" /></linearGradient></defs>
          </svg>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-10 relative z-10">
        <h1 className="text-3xl font-heading font-bold text-white tracking-tight mb-2">Auto<span className="text-gold">Mend</span></h1>
        <p className="text-text-muted text-sm font-body">Premium Garage Services</p>
      </motion.div>

      <div className="w-64 h-1 bg-card rounded-full overflow-hidden relative z-10">
        <motion.div className="h-full bg-gradient-to-r from-gold to-light-gold rounded-full animate-progress-bar shadow-[0_0_10px_rgba(200,155,60,0.5)]" onAnimationEnd={onComplete} />
      </div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="text-gold/50 text-xs font-body mt-4 tracking-widest uppercase relative z-10">Loading Experience</motion.p>
    </motion.div>
  )
}
