import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCheckCircle, FaClock, FaCreditCard, FaWallet, FaMobileAlt,
  FaTimes, FaFileDownload, FaReceipt, FaTools, FaWrench,
  FaUser, FaCar, FaShieldAlt, FaArrowRight
} from 'react-icons/fa'
import { useMyPayments, usePaymentBreakdown, useCreateOrder, useVerifyPayment } from '../../hooks/usePaymentHooks'
import { downloadInvoice } from '../../api/payments.api'
import { useToast } from '../../context/ToastContext'

/* ── All original logic preserved exactly ── */
export default function Payments() {
  const { addToast } = useToast()
  const [filter, setFilter] = useState('all')
  const { data: rawPayments = [], isLoading } = useMyPayments()
  const [breakdownId, setBreakdownId] = useState(null)
  const [isDownloading, setIsDownloading] = useState(false)
  
  // Custom Gateway States
  const [showGateway, setShowGateway] = useState(false)
  const [activePayment, setActivePayment] = useState(null)
  const [paymentStep, setPaymentStep] = useState(1) // 1: Method, 2: Details, 3: Processing
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [paymentForm, setPaymentForm] = useState({ upi: '', cardNumber: '', cardHolder: '', expiry: '', cvv: '', bank: '' })

  const createOrderMutation = useCreateOrder()
  const verifyPaymentMutation = useVerifyPayment()

  const handlePayNow = (payment) => {
    setActivePayment(payment)
    setShowGateway(true)
    setPaymentStep(1)
  }

  const proceedToDetails = (method) => {
    setSelectedMethod(method)
    setPaymentStep(2)
  }

  const finishRealPayment = async () => {
    if (!activePayment) return
    
    setPaymentStep(4) // Show "Opening Gateway..."
    try {
      // 1. Create Real Razorpay Order on Backend
      const orderData = await createOrderMutation.mutateAsync({ 
        jobId: activePayment.jobId?._id || activePayment.jobId 
      })

      const options = {
        key: orderData.key || import.meta.env.VITE_RAZORPAY_KEY, 
        amount: orderData.amount,
        currency: orderData.currency,
        name: "AutoMend",
        description: "Premium Garage Service Payment",
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            setPaymentStep(5) // Show "Verifying..."
            await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            
            setPaymentStep(6) // Success Screen
          } catch (err) {
            console.error(err)
            addToast('Verification failed. Please contact support.', 'error')
            setPaymentStep(2)
          }
        },
        prefill: {
          name: "", 
          email: "",
          contact: ""
        },
        theme: { color: "#C9A84C" },
        modal: {
          ondismiss: () => {
            setPaymentStep(2)
            addToast('Payment cancelled', 'info')
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
      
    } catch (error) {
      console.error(error)
      addToast(error.response?.data?.message || 'Failed to initialize secure checkout', 'error')
      setPaymentStep(2)
    }
  }

  const payments = filter === 'all'
    ? rawPayments
    : rawPayments.filter(p => {
        const status = p.paymentStatus.toLowerCase();
        if (filter === 'pending') return status === 'pending' || status === 'created';
        return status === filter;
      })

  const handleDownload = async (id) => {
    try {
      setIsDownloading(true)
      addToast('Generating your invoice...', 'info')
      const blob = await downloadInvoice(id)
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice_${id.slice(-8)}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.parentNode.removeChild(link)
      addToast('Invoice downloaded successfully!', 'success')
    } catch (error) {
      addToast('Failed to download invoice', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="space-y-8 pb-10">

      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-label text-text-muted mb-1">Financial Records</p>
        <h2 className="font-display text-4xl text-white font-300">
          Payment<span className="text-gradient-gold italic"> History</span>
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Payment List (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Filter pills */}
          <div className="flex gap-2">
            {['all', 'completed', 'pending'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-label transition-all ${
                  filter === f
                    ? 'bg-champagne text-void font-700'
                    : 'bg-surface border border-border text-text-muted hover:text-white hover:border-white/15'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Skeleton */}
          {isLoading && (
            <div className="space-y-4">
              {[1,2,3].map(n => <div key={n} className="h-28 skeleton rounded-2xl" />)}
            </div>
          )}

          {/* Payment cards */}
          <div className="space-y-4">
            {!isLoading && payments.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22,1,0.36,1] }}
                className={`card rounded-2xl overflow-hidden ${
                  ['pending', 'created'].includes(p.paymentStatus.toLowerCase()) ? 'border-l-2 border-l-champagne/60' : ''
                }`}
              >
                {/* Card body */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-5">
                  {/* Left: icon + info */}
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      p.paymentStatus.toLowerCase() === 'completed'
                        ? 'bg-sage/10 text-sage'
                        : 'bg-champagne/10 text-champagne'
                    }`}>
                      {p.paymentStatus.toLowerCase() === 'completed' ? <FaCheckCircle className="text-lg" /> : <FaClock className="text-lg" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-heading font-700 text-white text-sm">
                          #{p._id.slice(-8).toUpperCase()}
                        </p>
                        <span className="text-text-muted text-xs">•</span>
                        <p className="text-label text-text-muted">
                          REF-{p.requestId?.slice(-6).toUpperCase() || '—'}
                        </p>
                      </div>
                      <p className="text-label text-text-muted">
                        {new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Right: amount + status */}
                  <div className="text-right">
                    <p className="font-display text-2xl text-white font-400 leading-none">
                      ₹{p.amount.toLocaleString('en-IN')}
                    </p>
                    <span className={`badge mt-1 ${p.paymentStatus.toLowerCase() === 'completed' ? 'badge-green' : 'badge-gold'}`}>
                      {p.paymentStatus.toLowerCase() === 'completed'
                        ? <><FaCheckCircle className="text-[9px]" /> Paid</>
                        : <><FaClock className="text-[9px]" /> Pending</>
                      }
                    </span>
                  </div>
                </div>

                {/* Action row */}
                <div className="flex gap-3 px-5 pb-5">
                  {p.paymentStatus.toLowerCase() === 'completed' && (
                    <button
                      onClick={() => setBreakdownId(p._id)}
                      className="btn-ghost flex-1 py-2.5 text-[10px]"
                    >
                      <FaReceipt className="text-[10px]" /> View Bill
                    </button>
                  )}
                  {['pending', 'created'].includes(p.paymentStatus.toLowerCase()) && (
                    <button
                      onClick={() => handlePayNow(p)}
                      disabled={createOrderMutation.isPending}
                      className="btn-primary flex-[2] py-2.5 text-[10px] disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #5A8A72 0%, #6BBF95 100%)' }}
                    >
                      <FaCreditCard className="text-[10px]" />
                      {createOrderMutation.isPending ? 'Processing…' : 'Pay Now'}
                    </button>
                  )}
                  {p.paymentStatus.toLowerCase() === 'completed' && (
                    <button
                      onClick={() => handleDownload(p._id)}
                      disabled={isDownloading}
                      className="btn-primary flex-1 py-2.5 text-[10px] disabled:opacity-50"
                    >
                      <FaFileDownload className="text-[10px]" />
                      {isDownloading ? 'Downloading…' : 'Invoice'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}

            {!isLoading && payments.length === 0 && (
              <div className="py-20 text-center card rounded-2xl border-dashed">
                <FaReceipt className="text-3xl text-white/10 mx-auto mb-3" />
                <p className="font-display text-xl text-white/40 mb-2">No transactions found</p>
                <p className="text-label text-text-muted">
                  {filter !== 'all' ? 'Try switching the filter above.' : 'Your payment history will appear here.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar (1/3) ── */}
        <div className="space-y-5">
          {/* Payment methods */}
          <div className="card rounded-2xl p-5">
            <p className="text-label text-champagne mb-4">Accepted Methods</p>
            <div className="space-y-3">
              {[
                { label: 'Credit / Debit Card', icon: FaCreditCard },
                { label: 'UPI Apps',             icon: FaMobileAlt  },
                { label: 'Net Banking',           icon: FaWallet     },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-border hover:border-champagne/20 hover:bg-champagne/4 transition-all group">
                  <m.icon className="text-text-muted group-hover:text-champagne transition-colors text-sm" />
                  <p className="text-sm text-text-muted group-hover:text-white transition-colors">{m.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security badge */}
          <div className="card-gold rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <FaShieldAlt className="text-champagne text-lg" />
              <p className="font-heading font-700 text-champagne text-sm">Secure Payments</p>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              All transactions are secured with 256-bit encryption via Razorpay. We never store your card details.
            </p>
          </div>

          {/* Summary */}
          {rawPayments.length > 0 && (
            <div className="card rounded-2xl p-5">
              <p className="text-label text-text-muted mb-4">Summary</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Total Transactions</span>
                  <span className="font-600 text-white">{rawPayments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Paid</span>
                  <span className="font-600 text-sage">{rawPayments.filter(p => p.paymentStatus.toLowerCase() === 'completed').length}</span>
                </div>
                <div className="section-rule my-2" />
                <div className="flex justify-between">
                  <span className="text-label text-text-muted">Total Spent</span>
                  <span className="font-display text-xl text-champagne font-400">
                    ₹{rawPayments
                        .filter(p => p.paymentStatus.toLowerCase() === 'completed')
                        .reduce((a, p) => a + p.amount, 0)
                        .toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bill Breakdown Modal ── */}
      <AnimatePresence>
        {breakdownId && (
          <BillBreakdownModal id={breakdownId} onClose={() => setBreakdownId(null)} />
        )}
      </AnimatePresence>

      {/* ── Bespoke Payment Gateway Modal ── */}
      <AnimatePresence>
        {showGateway && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGateway(false)} className="absolute inset-0 bg-void/90 backdrop-blur-xl" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative w-full max-w-lg glass-strong rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/5 bg-gradient-to-r from-champagne/10 to-transparent">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-black text-gold uppercase tracking-[0.3em]">Secure Checkout</p>
                  <button onClick={() => setShowGateway(false)} className="text-text-muted hover:text-white"><FaTimes /></button>
                </div>
                <h3 className="text-2xl font-display text-white">AutoMend <span className="text-gold italic">Gateway</span></h3>
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                  <FaShieldAlt className="text-red-400 shrink-0" />
                  <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">
                    CRITICAL: DO NOT PAY CASH TO THE MECHANIC. All payments must be processed online via this portal.
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="p-8">
                {paymentStep === 1 && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Select Payment Method</p>
                    {[
                      { id: 'card', label: 'Credit / Debit Card', icon: FaCreditCard },
                      { id: 'upi',  label: 'UPI (GPay, PhonePe, etc.)', icon: FaMobileAlt }
                    ].map(m => (
                      <button 
                        key={m.id} 
                        onClick={() => proceedToDetails(m.id)}
                        className="w-full p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-gold/5 flex items-center justify-between transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                            <m.icon />
                          </div>
                          <span className="text-sm font-bold text-white group-hover:text-gold transition-colors">{m.label}</span>
                        </div>
                        <FaArrowRight className="text-text-muted group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                )}

                {paymentStep === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                       <button onClick={() => setPaymentStep(1)} className="text-[10px] font-black text-gold uppercase tracking-widest hover:underline">← Change Method</button>
                    </div>

                    {selectedMethod === 'upi' && (
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Enter UPI ID</p>
                        <input 
                          type="text" 
                          placeholder="e.g. name@okaxis" 
                          value={paymentForm.upi}
                          onChange={e => setPaymentForm({...paymentForm, upi: e.target.value})}
                          className="w-full bg-soft-dark border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-gold transition-all"
                        />
                      </div>
                    )}

                    {selectedMethod === 'card' && (
                      <div className="space-y-4">
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Card Details</p>
                        <input 
                          type="text" 
                          placeholder="Cardholder Name" 
                          value={paymentForm.cardHolder}
                          onChange={e => setPaymentForm({...paymentForm, cardHolder: e.target.value})}
                          className="w-full bg-soft-dark border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-gold transition-all mb-3"
                        />
                        <input 
                          type="text" 
                          placeholder="Card Number (XXXX XXXX XXXX XXXX)" 
                          value={paymentForm.cardNumber}
                          onChange={e => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                          className="w-full bg-soft-dark border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-gold transition-all"
                        />
                        <div className="grid grid-cols-2 gap-4">
                           <input type="text" placeholder="MM/YY" className="bg-soft-dark border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-gold transition-all" />
                           <input type="text" placeholder="CVV" className="bg-soft-dark border border-white/10 p-4 rounded-2xl text-white focus:outline-none focus:border-gold transition-all" />
                        </div>
                      </div>
                    )}

                    <button 
                      onClick={() => setPaymentStep(3)}
                      className="w-full py-5 bg-gold text-deep-black font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-gold/20"
                    >
                      Confirm Details
                    </button>
                  </div>
                )}

                {paymentStep === 3 && (
                  <div className="text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                      <FaShieldAlt className="text-red-500 text-3xl" />
                    </div>
                    <h4 className="text-xl font-display text-white">Payment Security Protocol</h4>
                    <p className="text-sm text-text-muted leading-relaxed">
                      To ensure your repair warranty remains valid, you must process this payment online. 
                      <span className="block mt-4 text-red-400 font-bold uppercase tracking-widest">Do not pay cash to the mechanic.</span>
                    </p>
                    <button 
                      onClick={finishRealPayment}
                      className="w-full py-5 bg-sage text-void font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:scale-105 transition-transform shadow-lg shadow-sage/20"
                    >
                      Initialize Secure Payment
                    </button>
                    <button onClick={() => setPaymentStep(2)} className="text-[10px] text-text-muted uppercase tracking-widest hover:text-white transition-colors">Go Back</button>
                  </div>
                )}

                {(paymentStep === 4 || paymentStep === 5) && (
                  <div className="py-12 flex flex-col items-center text-center">
                    <div className="w-20 h-20 border-4 border-gold border-t-transparent rounded-full animate-spin mb-8" />
                    <h4 className="text-xl font-display text-white mb-2">
                      {paymentStep === 4 ? "Connecting to Bank..." : "Verifying Transaction..."}
                    </h4>
                    <p className="text-xs text-text-muted uppercase tracking-widest leading-relaxed">
                      Please do not close this window or press back.
                    </p>
                  </div>
                )}

                {paymentStep === 6 && (
                  <div className="py-8 text-center space-y-6">
                    <div className="w-24 h-24 bg-sage/20 rounded-full flex items-center justify-center mx-auto">
                      <FaCheckCircle className="text-sage text-5xl" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-display text-white mb-1">Payment Successful</h4>
                      <p className="text-sm text-text-muted">Transaction ID: #{activePayment?.orderId?.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Amount Paid</span>
                        <span className="text-white font-700">₹{activePayment?.amount?.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Status</span>
                        <span className="text-sage font-700">Completed</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setShowGateway(false);
                        setPaymentStep(1);
                      }}
                      className="w-full py-5 bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-white/20 transition-all"
                    >
                      Close Checkout
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ══════════════════════════════════════════════
   BillBreakdownModal — all data logic preserved
══════════════════════════════════════════════ */
function BillBreakdownModal({ id, onClose }) {
  const { data, isLoading } = usePaymentBreakdown(id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-void/85 backdrop-blur-luxury"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
        className="relative w-full max-w-2xl glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10 flex flex-col max-h-[90vh]"
      >
        {/* Modal header */}
        <div className="bg-gradient-to-r from-champagne/8 to-transparent px-8 pt-7 pb-5 border-b border-white/6 flex items-center justify-between shrink-0">
          <div>
            <p className="text-label text-champagne mb-1">Detailed Bill</p>
            <h3 className="font-display text-2xl text-white font-300">Service Invoice</h3>
            <p className="text-label text-text-muted mt-0.5">Ref: #{id?.slice(-8).toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1,2,3].map(n => <div key={n} className="h-20 skeleton rounded-xl" />)}
            </div>
          ) : data?.payment ? (
            <>
              {/* Status + Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                  <p className="text-label text-text-muted mb-2">Payment Status</p>
                  <span className={`badge ${data.payment.paymentStatus === 'Completed' ? 'badge-green' : 'badge-gold'}`}>
                    {data.payment.paymentStatus === 'Completed' ? 'Verified & Paid' : 'Awaiting Payment'}
                  </span>
                </div>
                <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                  <p className="text-label text-text-muted mb-2">Date</p>
                  <p className="text-sm font-600 text-white">
                    {new Date(data.payment.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Vehicle & Mechanic */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                  <p className="text-label text-champagne mb-2">
                    <FaCar className="inline mr-1" /> Vehicle
                  </p>
                  <p className="text-sm font-600 text-white">{data.job?.vehicleId?.brand} {data.job?.vehicleId?.model}</p>
                  <p className="text-label text-text-muted mt-1 font-mono">{data.job?.vehicleId?.numberPlate}</p>
                </div>
                <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                  <p className="text-label text-champagne mb-2">
                    <FaUser className="inline mr-1" /> Mechanic
                  </p>
                  <p className="text-sm font-600 text-white">{data.payment.mechanicId?.name}</p>
                  <p className="text-label text-text-muted mt-1">Certified Partner</p>
                </div>
              </div>

              {/* Services */}
              {data.job?.servicesUsed?.length > 0 && (
                <div>
                  <p className="text-label text-text-muted mb-3">
                    <FaWrench className="inline mr-1 text-champagne" /> Services Performed
                  </p>
                  <div className="space-y-2">
                    {data.job.servicesUsed.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-border">
                        <span className="text-sm text-white">{s.name}</span>
                        <span className="text-sm font-600 text-champagne">₹{s.price?.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Parts */}
              {data.job?.partsUsed?.length > 0 && (
                <div>
                  <p className="text-label text-text-muted mb-3">
                    <FaTools className="inline mr-1 text-sage" /> Parts & Components
                  </p>
                  <div className="space-y-2">
                    {data.job.partsUsed.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/3 border border-border">
                        <div>
                          <p className="text-sm text-white">{p.name}</p>
                          <p className="text-label text-text-muted">Qty: {p.quantity} × ₹{p.price?.toLocaleString('en-IN')}</p>
                        </div>
                        <span className="text-sm font-600 text-sage">₹{(p.price * p.quantity).toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total summary */}
              <div className="card-gold rounded-2xl p-6">
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-muted">Services & Parts Subtotal</span>
                    <span className="text-white font-600">₹{data.payment.amount.toLocaleString('en-IN')}</span>
                  </div>
                  {data.job?.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-sage">Discount Applied</span>
                      <span className="text-sage font-600">-₹{data.job.discountAmount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                </div>
                <div className="section-rule mb-5" />
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-label text-champagne mb-1">Total Amount</p>
                    <p className="font-display text-4xl text-white font-300">
                      ₹{data.payment.amount.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-label text-text-muted mb-1">Processed via</p>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg"
                      alt="Razorpay"
                      className="h-4 brightness-0 invert opacity-40"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-16 text-center">
              <FaReceipt className="text-3xl text-white/10 mx-auto mb-3" />
              <p className="text-label text-text-muted">Failed to load breakdown. Please try again.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border text-center shrink-0">
          <p className="text-label text-text-muted">© 2026 AutoMend Premium Garage Services · Computer-generated bill</p>
        </div>
      </motion.div>
    </div>
  )
}
