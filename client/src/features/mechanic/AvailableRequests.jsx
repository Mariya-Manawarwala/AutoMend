import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaCarSide, FaClock,
  FaUser, FaPhone, FaMapMarkedAlt, FaSearchPlus, FaTimes,
  FaTools, FaExclamationTriangle, FaArrowRight, FaBolt
} from 'react-icons/fa'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { useRequests, useAcceptRequest } from '../../hooks/useRequestHooks'

/* ── ETA calculator (preserved exactly) ── */
const calculateETA = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 20
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2
  const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return Math.max(Math.round((distance / 25) * 60) + 5, 15)
}

export default function AvailableRequests({ setTab }) {
  const { addToast } = useToast()
  const { user } = useAuth()
  const [selectedRequest, setSelectedRequest] = useState(null)
  const isApproved = user?.status === 'approved'

  const { data: requests = [], isLoading, isError } = useRequests('mechanic')
  const acceptMutation = useAcceptRequest()

  /* ── Accept handler (preserved exactly) ── */
  const handleAccept = async (request) => {
    if (!isApproved) {
      addToast('Your account must be approved before you can accept jobs.', 'error')
      return
    }
    try {
      let mechanicLocation = null
      let eta = 20
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
          )
          mechanicLocation = { lat: position.coords.latitude, lng: position.coords.longitude }
          if (request.location?.lat && request.location?.lng) {
            eta = calculateETA(mechanicLocation.lat, mechanicLocation.lng, request.location.lat, request.location.lng)
          }
        } catch (geoErr) {
          console.warn('Geolocation failed, using default ETA', geoErr)
        }
      }
      const response = await acceptMutation.mutateAsync({ id: request._id, data: { mechanicLocation, eta } })
      const jobId = response.data?.job?._id || response.job?._id
      if (jobId) localStorage.setItem('activeJobId', jobId)
      addToast(`Job accepted! ETA: ${eta} mins.`, 'success')
      setSelectedRequest(null)
      setTab('jobs')
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to accept job', 'error')
    }
  }

  const openInMaps = (location) => {
    if (!location) return
    const url = location.lat && location.lng
      ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`
    window.open(url, '_blank')
  }

  /* ── Not approved ── */
  if (!isApproved) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <div className="w-20 h-20 card-gold rounded-full flex items-center justify-center mb-6">
          <FaClock className="text-3xl text-champagne" style={{ animation: 'breathe 3s ease-in-out infinite' }} />
        </div>
        <p className="text-label text-champagne mb-3">Verification In Progress</p>
        <h3 className="font-display text-3xl text-white font-300 mb-4">Account Under Review</h3>
        <p className="text-sm text-text-muted max-w-md leading-relaxed">
          Our team is verifying your credentials. You will be notified and able to accept jobs once the review is complete.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-10">

      {/* ── Status bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between card rounded-2xl px-5 py-3"
      >
        <p className="text-label text-text-muted">
          Live feed — first mechanic to accept wins the job
        </p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sage" style={{ animation: 'breathe 2.5s ease-in-out infinite' }} />
          <span className="text-label text-sage">System Active</span>
        </div>
      </motion.div>

      {/* ── Request count header ── */}
      {!isLoading && requests.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <p className="font-display text-2xl text-white font-300">
            {requests.length}
            <span className="text-gradient-gold italic"> available</span>
            <span className="text-white/40"> requests</span>
          </p>
        </motion.div>
      )}

      {/* ── Card grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(n => <div key={n} className="h-64 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {requests.map((r, i) => (
              <motion.div
                layout
                key={r._id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.22,1,0.36,1] }}
                className="card rounded-2xl overflow-hidden group hover:border-champagne/20 flex flex-col"
              >
                {/* Card top accent bar */}
                <div className="h-0.5 bg-gradient-to-r from-transparent via-champagne/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Card header */}
                <div className="flex items-start justify-between p-5 pb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-label text-champagne mb-1">
                      REQ-{r._id.slice(-6)}
                    </p>
                    <h4 className="font-heading font-700 text-white text-base truncate">
                      {r.vehicle?.brand} {r.vehicle?.model}
                    </h4>
                  </div>
                  <div className="w-11 h-11 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted group-hover:text-champagne group-hover:border-champagne/25 transition-all shrink-0 ml-3">
                    <FaCarSide className="text-base" />
                  </div>
                </div>

                {/* Description */}
                <div className="px-5 pb-4 flex-1">
                  <div className="p-3 rounded-xl bg-white/3 border border-white/5 mb-3">
                    <p className="text-label text-text-muted mb-1">
                      <FaTools className="inline mr-1 text-champagne" />
                      Issue Reported
                    </p>
                    <p className="text-sm text-white/80 line-clamp-2 italic">"{r.description}"</p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-label text-text-muted">
                      <FaMapMarkerAlt className="text-champagne text-[10px]" />
                      <span className="truncate">{r.location?.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-label text-text-muted">
                      <FaClock className="text-champagne text-[10px]" />
                      {new Date(r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    {r.estimatedCost && (
                      <div className="flex items-center gap-2 text-label text-champagne font-700">
                        <span>₹{r.estimatedCost.toLocaleString('en-IN')} est.</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 p-4 pt-0 border-t border-white/5">
                  <button
                    onClick={() => setSelectedRequest(r)}
                    className="btn-ghost flex-1 py-2.5 text-[10px]"
                  >
                    <FaSearchPlus className="text-[10px]" /> Details
                  </button>
                  <button
                    onClick={() => handleAccept(r)}
                    disabled={acceptMutation.isPending}
                    className="btn-primary flex-[2] py-2.5 text-[10px] disabled:opacity-50"
                  >
                    {acceptMutation.isPending
                      ? <span className="w-4 h-4 border-2 border-void border-t-transparent rounded-full animate-spin" />
                      : <><FaCheck className="text-[10px]" /> Accept Job</>
                    }
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state */}
          {!isLoading && requests.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center"
            >
              <div className="w-20 h-20 card rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="w-3 h-3 rounded-full bg-sage" style={{ animation: 'breathe 2s ease-in-out infinite' }} />
              </div>
              <p className="font-display text-2xl text-white/40 mb-2">Scanning for requests</p>
              <p className="text-label text-text-muted">You'll be notified the moment a new job matches your profile.</p>
            </motion.div>
          )}
        </div>
      )}

      {/* ══════════════════ DETAILS MODAL ══════════════════ */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="absolute inset-0 bg-void/85 backdrop-blur-luxury"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
              className="relative w-full max-w-2xl glass-strong rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10"
            >
              {/* Modal header */}
              <div className="bg-gradient-to-r from-champagne/8 to-transparent px-8 pt-8 pb-6 border-b border-white/6">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
                <span className="badge badge-gold mb-3">{selectedRequest.serviceType} Service</span>
                <h3 className="font-display text-3xl text-white font-300">
                  {selectedRequest.vehicle?.brand} {selectedRequest.vehicle?.model}
                </h3>
              </div>

              {/* Modal body */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left */}
                <div className="space-y-5">
                  <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                    <p className="text-label text-champagne mb-3">
                      <FaUser className="inline mr-1" /> Customer
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-champagne/15 border border-champagne/25 flex items-center justify-center text-champagne font-heading font-700">
                        {selectedRequest.customerId?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-600 text-white">{selectedRequest.customerId?.name}</p>
                        <p className="text-label text-text-muted">{selectedRequest.customerId?.phone}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                    <p className="text-label text-champagne mb-2">
                      <FaExclamationTriangle className="inline mr-1" /> Issue Reported
                    </p>
                    <p className="text-sm text-white/80 leading-relaxed italic">"{selectedRequest.description}"</p>
                  </div>
                </div>

                {/* Right */}
                <div className="space-y-5">
                  <div className="bg-white/4 rounded-xl p-4 border border-white/6">
                    <p className="text-label text-champagne mb-2">
                      <FaMapMarkedAlt className="inline mr-1" /> Service Location
                    </p>
                    <p className="text-sm text-white/80 mb-3 leading-relaxed">{selectedRequest.location?.address}</p>
                    <button
                      onClick={() => openInMaps(selectedRequest.location)}
                      className="btn-ghost w-full py-2 text-[10px]"
                    >
                      <FaMapMarkerAlt /> Open in Google Maps
                    </button>
                  </div>

                  {selectedRequest.estimatedCost && (
                    <div className="card-gold rounded-xl p-4">
                      <p className="text-label text-champagne mb-1">Estimated Revenue</p>
                      <p className="font-display text-3xl text-white font-300">
                        ₹{selectedRequest.estimatedCost.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-text-muted mt-1 font-heading">*Subject to additional parts/labor</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 pb-8 flex gap-3">
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="btn-ghost flex-1"
                >
                  Pass
                </button>
                <button
                  onClick={() => handleAccept(selectedRequest)}
                  disabled={acceptMutation.isPending}
                  className="btn-primary flex-[2] disabled:opacity-50"
                >
                  {acceptMutation.isPending
                    ? <span className="w-5 h-5 border-2 border-void border-t-transparent rounded-full animate-spin" />
                    : <><FaCheck /> Accept This Job</>
                  }
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
