import { motion } from 'framer-motion'
import { FaCar, FaWrench, FaStar, FaMapMarkerAlt, FaClock, FaArrowRight, FaBolt } from 'react-icons/fa'
import { useMechanicEarnings, useJobs } from '../../hooks/useJobHooks'
import { useRequests } from '../../hooks/useRequestHooks'
import { useAuth } from '../../context/AuthContext'

/* ── Section header (Biscarrosse italic serif) ── */
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
          className="text-label font-600 flex items-center gap-1 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-teal)' }}
        >
          {action} <FaArrowRight className="text-[9px]" />
        </button>
      )}
    </div>
  )
}

export default function Overview({ setTab }) {
  const { user } = useAuth()
  const { data: earningsData } = useMechanicEarnings()
  const { data: activeJobs = [], isLoading: jobsLoading } = useJobs('active')
  const { data: availableRequests = [] } = useRequests('mechanic')

  const stats = earningsData?.stats || {}
  const activeJob = activeJobs[0]

  const handleNavigate = (location) => {
    if (!location) return
    const url = location.lat && location.lng
      ? `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`
    window.open(url, '_blank')
  }

  const kpis = [
    { label: 'Active Jobs',  value: activeJobs.length,                         color: 'var(--color-coral)',       bg: 'var(--color-coral-faint)' },
    { label: 'Completed',    value: stats.completed || 0,                       color: '#2D8A6A',                  bg: 'rgba(45,138,106,0.07)'    },
    { label: 'This Month',   value: `₹${(stats.month || 0).toLocaleString()}`, color: 'var(--color-teal-deep)',   bg: 'var(--color-teal-faint)'  },
    { label: 'Rating',       value: '4.9 ★',                                   color: 'var(--color-peach-deep)',  bg: 'var(--color-peach-faint)' },
  ]

  return (
    <div className="max-w-5xl space-y-10 pb-12">

      {/* ── Greeting ── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-label mb-1">Mechanic Dashboard</p>
        <h2 className="font-heading italic font-500 text-3xl" style={{ color: 'var(--color-teal-deep)' }}>
          Good day, {user?.name?.split(' ')[0] || 'Mechanic'}
        </h2>
        <div className="section-rule mt-2" />
      </motion.div>

      {/* ══════ KPI STRIP ══════ */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.1, duration: 0.4 }}
              className="stat-card text-center"
            >
              <div
                className="w-10 h-10 rounded mx-auto mb-3 flex items-center justify-center"
                style={{ background: k.bg }}
              >
                <FaBolt style={{ color: k.color, fontSize: '0.9rem' }} />
              </div>
              <p className="font-heading font-600 text-2xl leading-none mb-1" style={{ color: k.color }}>
                {k.value}
              </p>
              <p className="text-label">{k.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════ ACTIVE JOB ══════ */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <SectionHeader
          title="Current active job"
          sub="Operational center"
        />

        {activeJob ? (
          <div className="card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              {/* Vehicle block — teal colored (Biscarrosse style) */}
              <div
                className="sm:w-56 shrink-0 flex items-center justify-center"
                style={{ background: 'var(--color-teal)', minHeight: '170px' }}
              >
                {activeJob.requestId?.vehicle?.image
                  ? <img src={activeJob.requestId.vehicle.image} alt="Vehicle" className="w-full h-full object-cover" style={{ minHeight: '170px' }} />
                  : (
                    <div className="text-center p-6">
                      <FaCar className="text-white/40 text-4xl mx-auto mb-2" />
                      <p className="text-white/60 text-sm font-500">
                        {activeJob.requestId?.vehicle?.brand} {activeJob.requestId?.vehicle?.model}
                      </p>
                    </div>
                  )
                }
              </div>

              {/* Info */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-label mb-1">REQ-{activeJob._id.slice(-6).toUpperCase()}</p>
                    <h4 className="font-heading font-500 text-xl" style={{ color: 'var(--color-teal-deep)' }}>
                      {activeJob.requestId?.vehicle?.brand} {activeJob.requestId?.vehicle?.model}
                    </h4>
                  </div>
                  <span className="badge badge-coral">
                    <span className="w-1.5 h-1.5 rounded-full bg-current" style={{ animation: 'breathe 2s ease-in-out infinite' }} />
                    {activeJob.jobStatus === 'InProgress' ? 'In Progress' : activeJob.jobStatus}
                  </span>
                </div>

                <p className="text-sm mb-4 flex items-start gap-2" style={{ color: 'var(--color-text-gray)', lineHeight: 1.6 }}>
                  <FaWrench className="mt-0.5 shrink-0 text-xs" style={{ color: 'var(--color-teal)' }} />
                  {activeJob.requestId?.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="text-label mb-1">
                      <FaClock className="inline mr-1" style={{ color: 'var(--color-teal)' }} /> Assigned
                    </p>
                    <p className="text-sm font-500" style={{ color: 'var(--color-text-light)' }}>
                      {new Date(activeJob.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-label mb-1">
                      <FaMapMarkerAlt className="inline mr-1" style={{ color: 'var(--color-teal)' }} /> Location
                    </p>
                    <p className="text-sm font-500 truncate" style={{ color: 'var(--color-text-light)' }}>
                      {activeJob.requestId?.location?.address || 'On-site'}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => { localStorage.setItem('activeJobId', activeJob._id); setTab('jobs') }}
                    className="btn-primary flex-1"
                  >
                    Work Panel <FaArrowRight className="text-xs" />
                  </button>
                  <button
                    onClick={() => { handleNavigate(activeJob.requestId?.location); setTab('jobs') }}
                    className="btn-ghost flex-1"
                  >
                    <FaMapMarkerAlt className="text-xs" /> Navigate
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="rounded-lg p-10 text-center"
            style={{ background: 'var(--color-teal-faint)', border: '1px dashed rgba(45,126,126,0.2)' }}
          >
            <FaWrench className="text-3xl mx-auto mb-3" style={{ color: 'var(--color-teal-pale)' }} />
            <p className="font-heading italic font-500 text-lg mb-2" style={{ color: 'var(--color-teal-deep)' }}>
              No active assignment
            </p>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Browse live requests to pick up a job and start earning.
            </p>
            <button onClick={() => setTab('requests')} className="btn-primary">
              Browse Requests <FaArrowRight className="text-xs" />
            </button>
          </div>
        )}
      </motion.section>

      {/* ══════ QUICK LINKS — teal/coral/peach blocks (Biscarrosse pattern) ══════ */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <SectionHeader title="Quick links" sub="Navigate your workspace" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Live requests — teal with badge */}
          <button
            onClick={() => setTab('requests')}
            className="card-teal p-6 text-left group relative"
          >
            {availableRequests.length > 0 && (
              <span className="absolute top-4 right-4 w-5 h-5 rounded-full bg-white text-teal-deep text-[10px] font-700 flex items-center justify-center">
                {availableRequests.length}
              </span>
            )}
            <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaCar className="text-white text-sm" />
            </div>
            <p className="font-heading font-500 text-base text-white mb-1">Live Requests</p>
            <p className="text-sm text-white/70">
              {availableRequests.length > 0
                ? `${availableRequests.length} available now`
                : 'No requests right now'}
            </p>
          </button>

          {/* Earnings — coral */}
          <button
            onClick={() => setTab('earnings')}
            className="card-coral p-6 text-left group"
          >
            <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FaStar className="text-white text-sm" />
            </div>
            <p className="font-heading font-500 text-base text-white mb-1">My Earnings</p>
            <p className="text-sm text-white/70">₹{(stats.month || 0).toLocaleString()} this month</p>
          </button>

          {/* History — peach */}
          <button
            onClick={() => setTab('history')}
            className="card-peach p-6 text-left group"
          >
            <div
              className="w-10 h-10 rounded flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
              style={{ background: 'rgba(58,48,32,0.1)' }}
            >
              <FaStar className="text-sm" style={{ color: '#5A4A2A' }} />
            </div>
            <p className="font-heading font-500 text-base mb-1" style={{ color: '#3A3020' }}>Service History</p>
            <p className="text-sm" style={{ color: '#6A5A40' }}>{stats.completed || 0} jobs completed</p>
          </button>
        </div>
      </motion.section>
    </div>
  )
}
