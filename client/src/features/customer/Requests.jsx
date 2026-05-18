import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaFilter, FaClock, FaCheckCircle, FaExclamationCircle, FaMapMarkerAlt, FaCar, FaTools, FaTimes, FaUser, FaWrench, FaMoneyBillWave, FaTrash, FaEdit, FaPhone } from 'react-icons/fa'
import { useRequests, useDeleteRequest } from '../../hooks/useRequestHooks'
import { useCreateOrder, useVerifyPayment } from '../../hooks/usePaymentHooks'
import { useToast } from '../../context/ToastContext'
import { useAddReview } from '../../hooks/useReviewHooks'
import { FaStar } from 'react-icons/fa'


const STATUS_BADGE = {
  Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
  Approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
  InProgress: 'bg-sierra/10 text-sierra border-sierra/20 shadow-[0_0_10px_rgba(169,120,95,0.2)]',
  Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
  Rejected: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  Billed: 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
  Accepted: 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
}

export default function Requests({ setTab, setEditingRequest }) {
  const { addToast } = useToast()
  const { data: requests = [], isLoading, isError } = useRequests('customer')
  const createOrderMutation = useCreateOrder()
  const verifyPaymentMutation = useVerifyPayment()
  const deleteRequestMutation = useDeleteRequest()
  
  const [filter, setFilter] = useState('all')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const addReviewMutation = useAddReview()
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewRequest, setReviewRequest] = useState(null)
  const [reviewForm, setReviewForm] = useState({
    garageRating: 5,
    garageComment: '',
    mechanicRating: 5,
    mechanicComment: ''
  })

  const handleOpenReview = (req) => {
    setReviewRequest(req)
    setReviewForm({
      garageRating: 5,
      garageComment: '',
      mechanicRating: 5,
      mechanicComment: ''
    })
    setShowReviewModal(true)
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewRequest?.jobId?._id) {
      addToast('No active job found to review.', 'error')
      return
    }

    try {
      await addReviewMutation.mutateAsync({
        jobId: reviewRequest.jobId._id,
        garageRating: reviewForm.garageRating,
        garageComment: reviewForm.garageComment,
        mechanicRating: reviewForm.mechanicRating,
        mechanicComment: reviewForm.mechanicComment
      })
      addToast('Review submitted successfully!', 'success')
      setShowReviewModal(false)
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to submit review', 'error')
    }
  }


  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this repair request?')) {
      try {
        await deleteRequestMutation.mutateAsync(id)
        addToast('Request deleted successfully', 'success')
      } catch (err) {
        addToast(err.response?.data?.message || 'Failed to delete request', 'error')
      }
    }
  }

  const handleEdit = (req) => {
    setEditingRequest(req)
    setTab('add-request')
  }

  const handlePayment = async (requestId) => {
    try {
      const order = await createOrderMutation.mutateAsync({ requestId })
      const options = {
        key: order.key || import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "AutoMend",
        description: "Service Payment",
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await verifyPaymentMutation.mutateAsync({
              requestId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
            addToast('Payment successful!', 'success')
          } catch (err) {
            addToast('Payment verification failed', 'error')
          }
        },
        theme: { color: "#C89B3C" }
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to initialize payment', 'error')
    }
  }

  const handleViewDetails = (req) => {
    setSelectedRequest(req)
    setShowDetails(true)
  }

  const filteredRequests = filter === 'all' 
    ? requests 
    : requests.filter(r => r.status.toLowerCase() === filter.toLowerCase())

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex p-1 bg-soft-dark border border-white/5 rounded-xl w-full sm:w-auto overflow-x-auto custom-scrollbar">
          {['all', 'Pending', 'Approved', 'InProgress', 'Billed', 'Completed', 'Rejected'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm font-bold rounded-lg capitalize transition-all whitespace-nowrap ${filter === f ? 'bg-card text-gold shadow-lg border border-white/10' : 'text-text-muted hover:text-white'}`}>
              {f.replace('InProgress', 'In Progress')}
            </button>
          ))}
        </div>
        
        <button onClick={() => setTab('add-request')} className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-black uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all flex items-center justify-center gap-2 group">
          <FaPlus className="group-hover:rotate-90 transition-transform" /> Add Request
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-64 bg-card/50 rounded-2xl animate-pulse border border-white/5" />)}
        </div>
      ) : isError ? (
        <div className="py-20 text-center bg-card/30 rounded-3xl border border-dashed border-red-500/20">
          <FaExclamationCircle className="text-4xl text-red-500/20 mx-auto mb-4" />
          <p className="text-red-400">Failed to load requests. Please try again later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((r, i) => (
              <motion.div layout key={r._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.2 }}
                className="bg-card/80 backdrop-blur-md rounded-2xl p-6 border border-white/5 shadow-lg hover:-translate-y-1 hover:border-white/10 transition-all flex flex-col group">
                
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-black text-gold mb-1 uppercase tracking-widest">ID: {r._id.slice(-6)}</p>
                    <h4 className="text-lg font-heading font-bold text-white group-hover:text-gold transition-colors">{r.vehicle?.brand} {r.vehicle?.model}</h4>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-widest ${STATUS_BADGE[r.status] || STATUS_BADGE.Pending}`}>
                      {r.status.replace('InProgress', 'In Progress')}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${r.jobId?.paymentStatus === 'paid' || r.status === 'Completed' || r.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {r.jobId?.paymentStatus === 'paid' || r.status === 'Completed' || r.status === 'paid' ? 'PAID' : 'UNPAID'}
                    </span>
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-6">
                  <div>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Issue Reported</p>
                    <p className="text-sm font-medium text-text-gray line-clamp-2 italic">"{r.description}"</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Service Type</p>
                      <p className="text-xs font-bold text-white capitalize flex items-center gap-2"><FaMapMarkerAlt className="text-gold" /> {r.serviceType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Scheduled</p>
                      <p className="text-xs font-bold text-white flex items-center gap-2"><FaClock className="text-gold" /> {new Date(r.scheduledDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => handleViewDetails(r)} className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all">Details</button>
                  {(r.status === 'Pending' || r.status === 'Approved') && (
                    <>
                      <button onClick={() => handleEdit(r)} className="p-2.5 bg-white/5 hover:bg-emerald-500/10 border border-white/10 rounded-xl text-emerald-400 hover:border-emerald-500/30 transition-all"><FaEdit /></button>
                      <button onClick={() => handleDelete(r._id)} className="p-2.5 bg-white/5 hover:bg-red-500/10 border border-white/10 rounded-xl text-red-400 hover:border-red-500/30 transition-all"><FaTrash /></button>
                    </>
                  )}
                  {r.status === 'Billed' && (
                    <button onClick={() => handlePayment(r._id)} disabled={createOrderMutation.isPending} className="flex-[2] py-2.5 bg-emerald-500 text-deep-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50">
                      {createOrderMutation.isPending ? 'Processing...' : 'Pay Now'}
                    </button>
                  )}
                  {r.status === 'Completed' && r.assignedMechanicId && (
                    <button 
                      onClick={() => handleOpenReview(r)}
                      disabled={r.isReviewed}
                      className={`flex-[2] py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${r.isReviewed ? 'bg-white/5 text-text-muted cursor-not-allowed border border-white/5' : 'bg-gold text-deep-black hover:shadow-[0_0_20px_rgba(200,155,60,0.4)]'}`}
                    >
                      {r.isReviewed ? 'Reviewed' : 'Review Mechanic'}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredRequests.length === 0 && (
            <div className="col-span-full py-20 text-center text-text-muted bg-card/30 rounded-3xl border border-dashed border-white/10">
              <div className="w-16 h-16 rounded-full bg-soft-dark border border-white/5 flex items-center justify-center mx-auto mb-4 opacity-50"><FaFilter className="text-2xl" /></div>
              <p className="font-medium">No requests found in this category.</p>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && selectedRequest && (
          <div className="fixed inset-0 z-[999] flex justify-center items-start overflow-y-auto pt-[100px] pb-[40px] px-4 no-scrollbar">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-deep-black/95 backdrop-blur-xl" 
              onClick={() => setShowDetails(false)} 
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-[95vw] md:max-w-[90vw] lg:max-w-[1100px] bg-card border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5),0_0_40px_rgba(200,155,60,0.05)] z-10 overflow-hidden"
            >
              {/* Internal CSS to hide scrollbars */}
              <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
              `}</style>

              {/* Top Gradient Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
              
              {/* Close Button */}
              <button 
                onClick={() => setShowDetails(false)} 
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-20 border border-white/5"
              >
                <FaTimes />
              </button>

              <div className="p-8 sm:p-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-gold/20 to-transparent flex items-center justify-center text-gold border border-gold/20 shadow-[0_0_30px_rgba(200,155,60,0.1)]">
                      <FaCar className="text-4xl" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight">{selectedRequest.vehicle?.brand} {selectedRequest.vehicle?.model}</h2>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-widest ${STATUS_BADGE[selectedRequest.status]}`}>
                          {selectedRequest.status}
                        </span>
                      </div>
                      <p className="text-xs font-black text-gold/60 uppercase tracking-[0.3em]">Reference ID: {selectedRequest._id}</p>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left Column: Details & Description (7 cols) */}
                  <div className="lg:col-span-7 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-soft-dark/30 p-6 rounded-3xl border border-white/5 hover:border-gold/20 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><FaWrench /></div>
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Service Type</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${selectedRequest.jobId?.paymentStatus === 'paid' || selectedRequest.status === 'Completed' || selectedRequest.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            {selectedRequest.jobId?.paymentStatus === 'paid' || selectedRequest.status === 'Completed' || selectedRequest.status === 'paid' ? 'PAID' : 'UNPAID'}
                          </span>
                        </div>
                        <p className="text-lg font-bold text-white capitalize">{selectedRequest.serviceType} Service</p>
                      </div>
                      <div className="bg-soft-dark/30 p-6 rounded-3xl border border-white/5 hover:border-gold/20 transition-all group">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform"><FaClock /></div>
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Scheduled For</span>
                        </div>
                        <p className="text-lg font-bold text-white">{new Date(selectedRequest.scheduledDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>

                    <div className="bg-soft-dark/20 p-8 rounded-[2rem] border border-white/5">
                      <h5 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <div className="w-1 h-4 bg-gold rounded-full" /> Detailed Issue Description
                      </h5>
                      <p className="text-base text-text-gray leading-relaxed italic">"{selectedRequest.description}"</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <h5 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Services</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.serviceIds?.length > 0 ? selectedRequest.serviceIds.map(s => (
                            <div key={s._id} className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-xs text-text-gray font-medium">
                              {s.name}
                            </div>
                          )) : <p className="text-xs text-text-muted italic">No specific services selected.</p>}
                        </div>
                      </div>
                      <div>
                        <h5 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Parts</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.partIds?.length > 0 ? selectedRequest.partIds.map(p => (
                            <div key={p._id} className="px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-xs text-emerald-400/70 font-medium">
                              {p.name}
                            </div>
                          )) : <p className="text-xs text-text-muted italic">No specific parts selected.</p>}
                        </div>
                      </div>
                    </div>

                    {/* Mechanic Tracking (If Accepted) */}
                    {selectedRequest.status === 'InProgress' && selectedRequest.assignedMechanicId && (
                      <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2rem] space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <div className="w-1 h-4 bg-emerald-500 rounded-full" /> Mechanic On The Way
                          </h5>
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full animate-pulse">Live</span>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl text-white">
                            <FaUser />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-white">{selectedRequest.assignedMechanicId.name}</p>
                            <p className="text-xs text-text-muted">Pro Mechanic • {selectedRequest.assignedMechanicId.phone}</p>
                          </div>
                          <a href={`tel:${selectedRequest.assignedMechanicId.phone}`} className="ml-auto w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-deep-black hover:scale-105 transition-all">
                             <FaPhone />
                          </a>
                        </div>

                        {selectedRequest.mechanicLocation && (
                           <button 
                             onClick={() => window.open(`https://www.google.com/maps?q=${selectedRequest.mechanicLocation.lat},${selectedRequest.mechanicLocation.lng}`, '_blank')}
                             className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                           >
                             <FaMapMarkerAlt className="text-gold" /> Track Mechanic Location
                           </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Billing & Mechanic (5 cols) */}
                  <div className="lg:col-span-5 space-y-8">
                    {/* Location Card */}
                    <div className="bg-soft-dark/30 p-6 rounded-3xl border border-white/5 group hover:border-gold/20 transition-all">
                      <h5 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Location</h5>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20 group-hover:shadow-[0_0_15px_rgba(200,155,60,0.2)] transition-all">
                          <FaMapMarkerAlt />
                        </div>
                        <p className="text-sm text-text-gray leading-relaxed italic font-medium pt-1">
                          {selectedRequest.location?.address || 'Standard Garage Pickup'}
                        </p>
                      </div>
                    </div>

                    {/* Billing Summary Card */}
                    <div className="bg-gradient-to-br from-gold/10 via-soft-dark/50 to-transparent p-8 rounded-[2rem] border border-gold/20 shadow-[0_0_40px_rgba(200,155,60,0.05)]">
                      <h5 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-6">
                        {selectedRequest.status === 'Billed' || selectedRequest.status === 'Completed' ? 'Billing Summary' : 'Cost Estimate'}
                      </h5>
                      <div className="space-y-4">
                        {selectedRequest.jobId ? (
                          <>
                            <div className="flex justify-between items-center text-sm font-medium">
                              <span className="text-text-muted italic">Subtotal</span>
                              <span className="text-white">₹{selectedRequest.jobId.subtotal?.toLocaleString()}</span>
                            </div>
                            {selectedRequest.jobId.discountAmount > 0 && (
                              <div className="flex justify-between items-center text-sm font-medium">
                                <span className="text-emerald-400 italic font-bold tracking-tight">Discount Applied</span>
                                <span className="text-emerald-400">-₹{selectedRequest.jobId.discountAmount?.toLocaleString()}</span>
                              </div>
                            )}
                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                              <div className="space-y-1">
                                <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Total Payable</p>
                                <span className="text-lg font-heading font-bold text-gold">Final Bill</span>
                              </div>
                              <span className="text-4xl font-heading font-black text-white leading-none shadow-[0_0_20px_rgba(255,255,255,0.05)]">₹{selectedRequest.jobId.totalCost?.toLocaleString()}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-[10px] text-text-muted uppercase font-black tracking-widest">Estimated cost</p>
                              <p className="text-lg font-heading font-bold text-gold">Base Estimate</p>
                            </div>
                            <span className="text-4xl font-heading font-black text-white leading-none">₹{selectedRequest.estimatedCost?.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>


                    {/* Mechanic Profile */}
                    {selectedRequest.assignedMechanicId && (
                      <div className="p-6 bg-gradient-to-r from-gold/10 to-transparent border border-gold/20 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {selectedRequest.assignedMechanicId.profilePhoto ? (
                            <img src={selectedRequest.assignedMechanicId.profilePhoto} alt={selectedRequest.assignedMechanicId.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20 shadow-lg" />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-gold text-deep-black flex items-center justify-center font-black text-2xl shadow-lg border-2 border-white/20">
                              {selectedRequest.assignedMechanicId.name?.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-black text-white tracking-tight">{selectedRequest.assignedMechanicId.name}</p>
                            <p className="text-[10px] text-gold font-bold uppercase tracking-[0.2em]">Service Engineer</p>
                          </div>
                        </div>
                        <Link 
                          to={`/mechanic/${selectedRequest.assignedMechanicId._id}`}
                          className="w-10 h-10 rounded-full bg-gold/10 text-gold flex items-center justify-center hover:bg-gold hover:text-deep-black transition-all border border-gold/20"
                        >
                          <FaUser className="text-sm" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && reviewRequest && (
          <div className="fixed inset-0 z-[999] flex justify-center items-center overflow-y-auto px-4 py-8 no-scrollbar">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-deep-black/95 backdrop-blur-xl" 
              onClick={() => setShowReviewModal(false)} 
            />

            {/* Modal Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-[550px] bg-card border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.5),0_0_40px_rgba(200,155,60,0.05)] z-10 overflow-hidden"
            >
              {/* Top Gradient Bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
              
              {/* Close Button */}
              <button 
                onClick={() => setShowReviewModal(false)} 
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all z-20 border border-white/5"
              >
                <FaTimes />
              </button>

              <form onSubmit={handleReviewSubmit} className="p-8 sm:p-10 space-y-6">
                <div>
                  <h3 className="text-2xl font-heading font-black text-white tracking-tight">Rate Your Experience</h3>
                  <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">Job ID: {reviewRequest._id?.slice(-6)} • Mechanic: {reviewRequest.assignedMechanicId?.name}</p>
                </div>

                {/* Mechanic Rating */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-black text-gold uppercase tracking-widest block">Mechanic Performance</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, mechanicRating: star })} 
                        className="text-2xl hover:scale-110 active:scale-95 transition-transform font-bold text-left"
                      >
                        <FaStar className={star <= reviewForm.mechanicRating ? 'text-gold drop-shadow-[0_0_8px_rgba(200,155,60,0.6)]' : 'text-white/10'} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    rows={2} 
                    value={reviewForm.mechanicComment} 
                    onChange={(e) => setReviewForm({ ...reviewForm, mechanicComment: e.target.value })} 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-all resize-none" 
                    placeholder="Tell us how the mechanic handled the work..."
                  />
                </div>

                {/* Garage Rating */}
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <label className="text-xs font-black text-gold uppercase tracking-widest block">Garage & Service Quality</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, garageRating: star })} 
                        className="text-2xl hover:scale-110 active:scale-95 transition-transform font-bold text-left"
                      >
                        <FaStar className={star <= reviewForm.garageRating ? 'text-gold drop-shadow-[0_0_8px_rgba(200,155,60,0.6)]' : 'text-white/10'} />
                      </button>
                    ))}
                  </div>
                  <textarea 
                    rows={2} 
                    value={reviewForm.garageComment} 
                    onChange={(e) => setReviewForm({ ...reviewForm, garageComment: e.target.value })} 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-gold/50 transition-all resize-none" 
                    placeholder="Tell us about the booking experience and platform..."
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={addReviewMutation.isPending}
                  className="w-full py-3.5 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-xl font-bold uppercase tracking-widest text-xs hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all disabled:opacity-50"
                >
                  {addReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

