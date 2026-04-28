import { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none w-full max-w-sm px-4">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 p-4 rounded-xl shadow-2xl pointer-events-auto border bg-card/90 backdrop-blur-md ${
                toast.type === 'success' ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
                toast.type === 'error' ? 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-gold/30 shadow-[0_0_15px_rgba(200,155,60,0.2)]'
              }`}>
              {toast.type === 'success' ? <FaCheckCircle className="text-emerald-400 shrink-0" /> :
               toast.type === 'error' ? <FaExclamationCircle className="text-red-400 shrink-0" /> :
               <FaInfoCircle className="text-gold shrink-0" />}
              <p className="text-sm font-body text-white flex-1">{toast.message}</p>
              <button onClick={() => removeToast(toast.id)} className="text-text-muted hover:text-white transition-colors shrink-0">
                <FaTimes />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
