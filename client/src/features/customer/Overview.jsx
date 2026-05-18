import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaCar, FaPlus, FaFileAlt, FaWrench,
  FaClock, FaArrowRight, FaTimes, FaMapMarkerAlt, FaCheckCircle
} from 'react-icons/fa'
import { useRequests } from '../../hooks/useRequestHooks'
import { useVehicles } from '../../hooks/useVehicleHooks'
import { useAuth } from '../../context/AuthContext'

/* ── Section header — Biscarrosse italic serif style ── */
function SectionHeader({ title, sub, action, onAction }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        {sub && <p className="text-label mb-1">{sub}</p>}
        <h3 className="font-heading italic font-500 text-2xl" style={{ color: 'var(--color-teal-deep)' }}>
          {title}
        </h3>
        <div className="section-rule mt-2" />
      </div>
      {action && (
        <button
          onClick={onAction}
          className="text-label font-600 flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ color: 'var(--color-teal)' }}
        >
          {action} <FaArrowRight className="text-[9px]" />
        </button>
      )}
    </div>
  )
}

/* ── Status pill ── */
function StatusPill({ status }) {
  const cfg = {
    InProgress:       { cls: 'badge-coral',  label: 'In Progress' },
    Approved:         { cls: 'badge-green',  label: 'Approved' },
    Pending:          { cls: 'badge-peach',  label: 'Pending' },
    Completed:        { cls: 'badge-green',  label: 'Completed' },
    awaiting_payment: { cls: 'badge-teal',   label: 'Awaiting Payment' },
    paid:             { cls: 'badge-green',  label: 'Paid' },
  }
  const { cls, label } = cfg[status] || { cls: 'badge-muted', label: status }
  return <span className={`badge ${cls}`}>{label}</span>
}

export default function Overview({ setTab }) {
  const { user } = useAuth()
  const { data: requests = [], isLoading: isReqLoading } = useRequests('customer')
  const { data: vehicles = [], isLoading: isVehLoading } = useVehicles()
  const [showDetails, setShowDetails] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  /* ── Derived data — same logic, preserved ── */
  const activeRequest  = requests.find(r => ['InProgress', 'Pending', 'Approved', 'awaiting_payment'].includes(r.status))
  const completedCount = requests.filter(r => r.status === 'Completed').length
  const totalSpent     = requests
    .filter(r => ['Completed', 'paid'].includes(r.status))
    .reduce((a, c) => a + (c.finalCost || c.estimatedCost || 0), 0)

  const handleViewDetails = (req) => { setSelectedRequest(req); setShowDetails(true) }

  /* ── Loading ── */
  if (isReqLoading || isVehLoading) {
    return (
      <div className="max-w-5xl space-y-8 pb-10">
        <div className="h-10 skeleton rounded w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(n => <div key={n} className="h-24 skeleton rounded-lg" />)}
        </div>
        <div className="h-64 skeleton rounded-lg" />
      </div>
    )
  }

  /* ── Stat data ── */
  const stats = [
    { label: 'Total Requests', value: requests.length,                   color: 'var(--color-teal-deep)',  bg: 'var(--color-teal-faint)' },
    { label: 'Completed',      value: completedCount,                     color: '#2D8A6A',                  bg: 'rgba(45,138,106,0.07)' },
    { label: 'My Vehicles',    value: vehicles.length,                    color: 'var(--color-teal)',        bg: 'var(--color-teal-faint)' },
    { label: 'Total Spent',    value: `₹${totalSpent.toLocaleString()}`,  color: 'var(--color-coral)',       bg: 'var(--color-coral-faint)' },
  ]

  /* ── Recent history (last 3 non-active) ── */
  const recent = requests.filter(r => !['InProgress', 'Pending', 'Approved', 'awaiting_payment'].includes(r.status)).slice(0, 3)

  return (
    <div className="max-w-5xl space-y-10 pb-12">

      {/* ── Greeting ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-label mb-1">Your Dashboard</p>
        <h2 className="font-heading italic font-500 text-3xl" style={{ color: 'var(--color-teal-deep)' }}>
          Welcome, {user?.name?.split(' ')[0] || 'Customer'}
        </h2>
        <div className="section-rule mt-2" />
      </motion.div>

      {/* ══════ STAT STRIP — 4 tiles like Biscarrosse icon blocks ══════ */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
              className="stat-card text-center"
            >
              <div
                className="w-10 h-10 rounded mx-auto mb-3 flex items-center justify-center"
                style={{ background: s.bg }}
              >
                <FaCar style={{ color: s.color, fontSize: '1rem' }} />
              </div>
              <p className="font-heading font-600 text-2xl leading-none mb-1" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-label">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════ ACTIVE REQUEST — editorial card ══════ */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SectionHeader
          title="Current Service"
          sub="Active request"
          action={activeRequest ? "Full details" : undefined}
          onAction={() => activeRequest && handleViewDetails(activeRequest)}
        />

        {activeRequest ? (
          <div className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Vehicle image */}
              <div
                className="sm:w-56 shrink-0 flex items-center justify-center"
                style={{ background: 'var(--color-teal)', minHeight: '160px' }}
              >
                {activeRequest.vehicle?.image
                  ? <img src={activeRequest.vehicle.image} alt="Vehicle" className="w-full h-full object-cover" style={{ minHeight: '160px' }} />
                  : (
                    <div className="text-center p-6">
                      <FaCar className="text-white/40 text-4xl mx-auto mb-2" />
                      <p className="text-white/70 text-sm font-500">
                        {activeRequest.vehicle?.brand} {activeRequest.vehicle?.model}
                      </p>
                    </div>
                  )
                }
              </div>

              {/* Info */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-label mb-1">REQ-{activeRequest._id.slice(-6).toUpperCase()}</p>
                    <h4 className="font-heading font-500 text-xl" style={{ color: 'var(--color-teal-deep)' }}>
                      {activeRequest.vehicle?.brand} {activeRequest.vehicle?.model}
                    </h4>
                  </div>
                  <StatusPill status={activeRequest.status} />
                </div>

                <p className="text-sm mb-4 flex items-start gap-2" style={{ color: 'var(--color-text-gray)', lineHeight: 1.6 }}>
                  <FaWrench className="mt-0.5 shrink-0" style={{ color: 'var(--color-teal)', fontSize: '11px' }} />
                  {activeRequest.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-label mb-1"><FaClock className="inline mr-1" style={{ color: 'var(--color-teal)' }} />Scheduled</p>
                    <p className="text-sm font-500" style={{ color: 'var(--color-text-light)' }}>
                      {new Date(activeRequest.scheduledDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-label mb-1">Mechanic</p>
                    {activeRequest.assignedMechanicId ? (
                      <p className="text-sm font-500" style={{ color: 'var(--color-text-light)' }}>
                        {activeRequest.assignedMechanicId.name}
                      </p>
                    ) : (
                      <p className="text-sm italic" style={{ color: 'var(--color-text-muted)' }}>Awaiting assignment…</p>
                    )}
                  </div>
                </div>

                <button onClick={() => handleViewDetails(activeRequest)} className="btn-primary text-sm">
                  View Details <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Empty — Biscarrosse-style colored block empty state */
          <div
            className="rounded-lg p-10 text-center"
            style={{ background: 'var(--color-teal-faint)', border: '1px dashed rgba(45,126,126,0.2)' }}
          >
            <FaCar className="text-3xl mx-auto mb-3" style={{ color: 'var(--color-teal-pale)' }} />
            <p className="font-heading italic font-500 text-lg mb-2" style={{ color: 'var(--color-teal-deep)' }}>
              No active request
            </p>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Book a service and track your vehicle repair in real time.
            </p>
            <button onClick={() => setTab('add-request')} className="btn-primary">
              <FaPlus className="text-xs" /> Book a Service
            </button>
          </div>
        )}
      </motion.section>

      {/* ══════ QUICK ACTIONS — Biscarrosse teal/coral/peach block grid ══════ */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <SectionHeader title="Quick actions" sub="What would you like to do?" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Book new — teal block (like Biscarrosse's teal cards) */}
          <button
            onClick={() => setTab('add-request')}
            className="card-teal p-6 text-left group"
          >
            <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaPlus className="text-white text-sm" />
            </div>
            <p className="font-heading font-500 text-base text-white mb-1">Book New Service</p>
            <p className="text-sm text-white/70">Schedule a mechanic visit</p>
          </button>

          {/* My vehicles — coral block */}
          <button
            onClick={() => setTab('vehicles')}
            className="card-coral p-6 text-left group"
          >
            <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaCar className="text-white text-sm" />
            </div>
            <p className="font-heading font-500 text-base text-white mb-1">My Vehicles</p>
            <p className="text-sm text-white/70">Manage your garage</p>
          </button>

          {/* History — peach block */}
          <button
            onClick={() => setTab('requests')}
            className="card-peach p-6 text-left group"
          >
            <div className="w-10 h-10 rounded flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              style={{ background: 'rgba(58,48,32,0.1)' }}>
              <FaFileAlt className="text-sm" style={{ color: '#5A4A2A' }} />
            </div>
            <p className="font-heading font-500 text-base mb-1" style={{ color: '#3A3020' }}>Service History</p>
            <p className="text-sm" style={{ color: '#6A5A40' }}>View past repairs</p>
          </button>
        </div>
      </motion.section>

      {/* ══════ RECENT HISTORY — like Biscarrosse "À vos agendas" row ══════ */}
      {recent.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <SectionHeader
            title="Recent services"
            sub="Completed jobs"
            action="View all"
            onAction={() => setTab('requests')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {recent.map((r, i) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.4 }}
                className="card overflow-hidden cursor-pointer group"
                onClick={() => handleViewDetails(r)}
              >
                {/* Top image or colored block */}
                <div
                  className="h-28 flex items-center justify-center"
                  style={{
                    background: [
                      'var(--color-teal)',
                      'var(--color-coral)',
                      'var(--color-peach-deep)'
                    ][i % 3]
                  }}
                >
                  {r.vehicle?.image
                    ? <img src={r.vehicle.image} alt="" className="w-full h-full object-cover" />
                    : <FaCar className="text-3xl text-white/40" />
                  }
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-heading font-500 text-sm" style={{ color: 'var(--color-teal-deep)' }}>
                      {r.vehicle?.brand} {r.vehicle?.model}
                    </p>
                    <StatusPill status={r.status} />
                  </div>
                  <p className="text-label">
                    {new Date(r.scheduledDate || r.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ══════ DETAILS MODAL ══════ */}
      <AnimatePresence>
        {showDetails && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 glass-overlay"
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.22,1,0.36,1] }}
              className="relative w-full max-w-xl card z-10 overflow-hidden"
            >
              {/* Modal top — teal band */}
              <div className="px-6 py-5 flex items-start justify-between"
                style={{ background: 'var(--color-teal)' }}>
                <div>
                  <p className="text-white/70 text-xs font-600 uppercase tracking-wider mb-1">
                    REQ-{selectedRequest._id.slice(-6).toUpperCase()}
                  </p>
                  <h3 className="font-heading italic font-500 text-xl text-white">
                    {selectedRequest.vehicle?.brand} {selectedRequest.vehicle?.model}
                  </h3>
                </div>
                <button
                  onClick={() => setShowDetails(false)}
                  className="w-7 h-7 rounded bg-white/15 hover:bg-white/25 flex items-center justify-center text-white text-xs transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg p-4 border" style={{ background: 'var(--color-teal-faint)', borderColor: 'rgba(45,126,126,0.12)' }}>
                    <p className="text-label mb-2">Status</p>
                    <StatusPill status={selectedRequest.status} />
                  </div>
                  <div className="rounded-lg p-4 border" style={{ background: 'var(--color-teal-faint)', borderColor: 'rgba(45,126,126,0.12)' }}>
                    <p className="text-label mb-2">Service Type</p>
                    <p className="text-sm font-500 capitalize" style={{ color: 'var(--color-teal-deep)' }}>{selectedRequest.serviceType}</p>
                  </div>
                </div>

                {selectedRequest.assignedMechanicId && (
                  <div className="rounded-lg p-4 border flex items-center gap-3"
                    style={{ background: 'var(--color-teal-faint)', borderColor: 'rgba(45,126,126,0.12)' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-700 text-white"
                      style={{ background: 'var(--color-teal)' }}>
                      {selectedRequest.assignedMechanicId.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-600">{selectedRequest.assignedMechanicId.name}</p>
                      <p className="text-label">Assigned Mechanic</p>
                    </div>
                  </div>
                )}

                <div className="rounded-lg p-4 border" style={{ background: 'var(--color-teal-faint)', borderColor: 'rgba(45,126,126,0.12)' }}>
                  <p className="text-label mb-2">
                    <FaMapMarkerAlt className="inline mr-1" style={{ color: 'var(--color-teal)' }} />
                    Description
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-gray)' }}>
                    {selectedRequest.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
