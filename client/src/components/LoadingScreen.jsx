import { motion } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  return (
    <motion.div className="fixed inset-0 z-[200] bg-deep-black flex flex-col items-center justify-center overflow-hidden" exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <style>{`
        @keyframes spin-wheel {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes aero-flow {
          0% { stroke-dashoffset: 240; }
          100% { stroke-dashoffset: -240; }
        }
        @keyframes travel-screen {
          0% { transform: translateX(-260px); }
          100% { transform: translateX(100vw); }
        }
        @keyframes speed-line {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-250px); }
        }
        @keyframes gentle-drift {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes laser-sweep {
          0% { opacity: 0.3; }
          50% { opacity: 0.7; }
          100% { opacity: 0.3; }
        }
        .animate-spin-wheel {
          animation: spin-wheel 0.35s linear infinite;
        }
        .animate-travel {
          animation: travel-screen 3.2s linear infinite;
        }
        .animate-speed-line-1 {
          animation: speed-line 1.6s linear infinite;
        }
        .animate-speed-line-2 {
          animation: speed-line 2s linear infinite 0.4s;
        }
        .animate-speed-line-3 {
          animation: speed-line 1.2s linear infinite 0.8s;
        }
        .animate-aero-flow {
          animation: aero-flow 1.8s linear infinite;
        }
        .animate-aero-flow-fast {
          animation: aero-flow 1.2s linear infinite 0.4s;
        }
        .animate-gentle-drift {
          animation: gentle-drift 3s ease-in-out infinite;
        }
        .animate-laser-sweep {
          animation: laser-sweep 2s ease-in-out infinite;
        }
      `}</style>

      {/* Cinematic Studio Backdrop lighting */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 left-1/3 w-[350px] h-[350px] bg-warm-brown/10 rounded-full blur-[120px]" />
      </div>

      {/* Screen-wide horizontal speed lines */}
      <div className="absolute top-[50%] bottom-[42%] left-0 right-0 overflow-hidden pointer-events-none opacity-20 z-0">
        <div className="w-24 h-[1px] bg-gold/50 rounded-full animate-speed-line-1 absolute top-[10%]" />
        <div className="w-36 h-[1.5px] bg-gold/30 rounded-full animate-speed-line-2 absolute top-[45%]" />
        <div className="w-16 h-[1px] bg-gold/60 rounded-full animate-speed-line-3 absolute top-[75%]" />
      </div>

      {/* Studio stage horizon light bar */}
      <div className="absolute top-[56%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold/15 to-transparent z-0" />

      {/* Travelling Supercar Chassis */}
      <div className="absolute top-[43%] left-0 w-full overflow-visible pointer-events-none z-10">
        <div className="absolute left-0 animate-travel flex flex-col items-center justify-center">
          <div className="relative animate-gentle-drift flex items-center justify-center">
            {/* Soft, photorealistic floor contact shadow */}
            <div className="absolute bottom-[20px] w-[190px] h-[5px] bg-black/95 rounded-full blur-[4px]" />

            <svg width="240" height="90" viewBox="0 0 240 90" fill="none" className="relative drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]">
              {/* Cyberpunk Wind Tunnel Aerodynamic Flow Streams (Gold Laser Beams) */}
              <path d="M 15 22 Q 90 2, 168 22 T 225 50" 
                    stroke="url(#aero-stream-grad)" 
                    strokeWidth="1.2" 
                    strokeDasharray="30, 210" 
                    strokeDashoffset="0" 
                    fill="none" 
                    className="animate-aero-flow" 
              />
              <path d="M 5 28 Q 80 8, 158 28 T 215 56" 
                    stroke="url(#aero-stream-grad)" 
                    strokeWidth="0.8" 
                    strokeDasharray="40, 200" 
                    strokeDashoffset="80" 
                    fill="none" 
                    className="animate-aero-flow-fast" 
              />

              {/* 3D Speckled Shadow base outline under chassis */}
              <path d="M 22 59 C 50 60, 190 60, 212 59" stroke="#000" strokeWidth="3" opacity="0.6" blur="2" />

              {/* Supercar Main Chassis Body (Liquid Titanium/Metallic Carbon Finish) */}
              <path d="M 35 55 
                       C 42 40, 60 25, 88 20 
                       C 118 15, 150 16, 168 25
                       C 182 32, 195 46, 203 52 
                       C 212 55, 218 60, 220 63
                       L 212 64
                       C 207 61, 198 59, 188 59
                       L 174 59
                       C 170 48, 156 48, 151 59
                       L 95 59
                       C 91 48, 77 48, 72 59
                       L 32 59
                       C 22 59, 14 55, 17 50 
                       C 20 45, 28 48, 35 55 Z" 
                    fill="url(#liquid-titanium-grad)" 
                    stroke="url(#luxury-gold-stroke)" 
                    strokeWidth="1" 
              />

              {/* Realistic Specular Panel Line Creases */}
              <path d="M 88 20 C 118 15, 148 18, 168 25" stroke="#111" strokeWidth="0.5" />
              <path d="M 124 23 L 124 59" stroke="#121212" strokeWidth="0.75" />
              <path d="M 68 59 C 68 45, 78 45, 78 59" stroke="#181818" strokeWidth="1" />
              <path d="M 152 59 C 152 45, 162 45, 162 59" stroke="#181818" strokeWidth="1" />

              {/* Premium Smoked Glass Cabin Windows */}
              <path d="M 90 23 
                       C 114 19, 140 19, 152 25
                       C 162 30, 170 38, 174 43
                       L 140 43
                       C 140 43, 138 31, 127 31
                       C 117 31, 100 43, 100 43
                       Z" 
                    fill="url(#glass-gradient)" 
                    stroke="#2a2a2a" 
                    strokeWidth="0.5" 
              />
              <path d="M 86 25
                       L 96 43
                       L 64 43
                       C 68 35, 76 28, 86 25 Z"
                    fill="url(#glass-gradient)"
                    stroke="#2a2a2a"
                    strokeWidth="0.5"
              />

              {/* Specular White Highlights on Glass (Creates high-end realistic gloss reflection) */}
              <path d="M 112 21 L 100 42 M 132 21 L 120 42" stroke="#FFF" strokeWidth="0.75" opacity="0.15" />

              {/* Performance Matte Black Rear GT Spoiler Wing */}
              <path d="M 23 37 L 13 35 L 15 42 L 27 43 Z" fill="#0D0D0D" stroke="#222" strokeWidth="0.5" />
              <path d="M 18 42 L 18 50" stroke="#0D0D0D" strokeWidth="1" />

              {/* Premium LED Taillight Strip (Crimson Red) */}
              <path d="M 14 50 L 11 52 L 12 55 L 17 53 Z" fill="#EF4444" className="animate-laser-sweep" />
              <circle cx="12" cy="52" r="2.5" fill="#FF4444" opacity="0.9" className="blur-[1px] animate-laser-sweep" />

              {/* Laser Headlight Cluster (Ultra White/Gold) */}
              <path d="M 215 52 C 217 52, 221 54, 221 56 C 221 58, 217 60, 215 60 Z" fill="#FFF" />
              <circle cx="218" cy="56" r="3" fill="#FFE5A3" opacity="0.95" className="blur-[1px]" />

              {/* Ambient Warm Golden Chassis Under-Glow (Subtle luxury wash, not solid) */}
              <path d="M 52 61 L 182 61" stroke="url(#underglow-gradient)" strokeWidth="3" strokeLinecap="round" opacity="0.5" className="blur-[3px] animate-laser-sweep" />

              {/* Photorealistic High-Performance Alloy Wheels */}
              {/* Static Golden Performance Brake Calipers (Brakes stay static while rims rotate!) */}
              <path d="M 73.5 54 A 10 10 0 0 1 81.5 49" stroke="#C89B3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 152.5 54 A 10 10 0 0 1 160.5 49" stroke="#C89B3C" strokeWidth="2.5" strokeLinecap="round" fill="none" />

              {/* FRONT ROTATING WHEEL */}
              <g className="animate-spin-wheel" style={{ transformOrigin: '83.5px 59px' }}>
                <circle cx="83.5" cy="59" r="15" fill="#050505" stroke="#1A1A1A" strokeWidth="2" />
                <circle cx="83.5" cy="59" r="12" fill="#121212" stroke="#2D2D2D" strokeWidth="0.75" />
                {/* Split Star Alloy Spokes */}
                <path d="M 83.5 59 L 83.5 46 
                         M 83.5 59 L 95.5 51 
                         M 83.5 59 L 91.0 70 
                         M 83.5 59 L 76.0 70 
                         M 83.5 59 L 71.5 51" 
                      stroke="url(#wheel-spoke-grad)" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                />
                {/* Center Lock Cap */}
                <circle cx="83.5" cy="59" r="3" fill="#0D0D0D" stroke="#C89B3C" strokeWidth="0.75" />
              </g>

              {/* REAR ROTATING WHEEL */}
              <g className="animate-spin-wheel" style={{ transformOrigin: '162.5px 59px' }}>
                <circle cx="162.5" cy="59" r="15" fill="#050505" stroke="#1A1A1A" strokeWidth="2" />
                <circle cx="162.5" cy="59" r="12" fill="#121212" stroke="#2D2D2D" strokeWidth="0.75" />
                {/* Split Star Alloy Spokes */}
                <path d="M 162.5 59 L 162.5 46 
                         M 162.5 59 L 174.5 51 
                         M 162.5 59 L 170.0 70 
                         M 162.5 59 L 155.0 70 
                         M 162.5 59 L 150.5 51" 
                      stroke="url(#wheel-spoke-grad)" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                />
                {/* Center Lock Cap */}
                <circle cx="162.5" cy="59" r="3" fill="#0D0D0D" stroke="#C89B3C" strokeWidth="0.75" />
              </g>

              {/* High-Fidelity Professional Rendering Definitions */}
              <defs>
                {/* Liquid Gold/Bronze Metallic Body Gradients */}
                <linearGradient id="liquid-titanium-grad" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2E1C05" />
                  <stop offset="20%" stopColor="#734E1B" />
                  <stop offset="40%" stopColor="#C89B3C" />
                  <stop offset="50%" stopColor="#FFE5A3" />
                  <stop offset="65%" stopColor="#C89B3C" />
                  <stop offset="85%" stopColor="#734E1B" />
                  <stop offset="100%" stopColor="#2E1C05" />
                </linearGradient>
                
                {/* Executive luxury gold pinstripe */}
                <linearGradient id="luxury-gold-stroke" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C89B3C" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#FFE5A3" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#C89B3C" stopOpacity="0.4" />
                </linearGradient>

                {/* Premium wheel spokes metal gradient */}
                <linearGradient id="wheel-spoke-grad" x1="0" y1="0" x2="20" y2="20" gradientTransform="rotate(45)">
                  <stop offset="0%" stopColor="#888" />
                  <stop offset="50%" stopColor="#FFE5A3" />
                  <stop offset="100%" stopColor="#222" />
                </linearGradient>

                {/* Aerodynamic Flow lasers */}
                <linearGradient id="aero-stream-grad" x1="0" y1="0" x2="240" y2="0" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C89B3C" stopOpacity="0" />
                  <stop offset="30%" stopColor="#FFE5A3" stopOpacity="0.8" />
                  <stop offset="70%" stopColor="#C89B3C" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#C89B3C" stopOpacity="0" />
                </linearGradient>

                {/* Smoked glass tint */}
                <linearGradient id="glass-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#121212" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#040404" stopOpacity="0.85" />
                </linearGradient>

                {/* Underglow wash */}
                <linearGradient id="underglow-gradient" x1="52" y1="61" x2="182" y2="61" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#C89B3C" stopOpacity="0" />
                  <stop offset="50%" stopColor="#C89B3C" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#C89B3C" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
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
