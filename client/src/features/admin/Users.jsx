import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUserCircle, FaSearch, FaBan, FaCheck, FaEllipsisV, FaClock, FaUndo, FaFilter, FaSortAmountDown } from 'react-icons/fa'
import { useAdminUsers, useUpdateUserAccountStatus } from '../../hooks/useDashboardHooks'
import { useToast } from '../../context/ToastContext'
import LuxurySelect from '../../components/common/LuxurySelect'
import PillSelector from '../../components/common/PillSelector'

export default function Users() {
  const { addToast } = useToast()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('customer')
  const [statusFilter, setStatusFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  
  const { data: users = [], isLoading } = useAdminUsers({ search, role: roleFilter, accountStatus: statusFilter })
  const statusMutation = useUpdateUserAccountStatus()

  const handleUpdateStatus = async (userId, accountStatus, durationWeeks = 0) => {
    try {
      await statusMutation.mutateAsync({ userId, accountStatus, durationWeeks })
      addToast(`User status updated to ${accountStatus}`, 'success')
    } catch (error) {
      addToast('Failed to update status', 'error')
    }
  }

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
    if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'status') return a.accountStatus.localeCompare(b.accountStatus)
    return 0
  })

  return (
    <div className="space-y-6 pb-10 max-w-7xl">
      
      {/* Search and Filters */}
      <div className="bg-card/80 backdrop-blur-md p-6 rounded-[2rem] border border-white/5 shadow-xl flex flex-col lg:flex-row gap-4 items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
        
        <div className="relative w-full lg:max-w-md z-10">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search name, email, or phone..." 
            className="w-full pl-11 pr-4 py-3.5 bg-soft-dark border border-white/10 rounded-2xl text-sm text-white focus:outline-none focus:border-gold/50 transition-all shadow-inner" 
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-auto z-10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">User Role</p>
            <PillSelector 
              value={roleFilter} 
              onChange={setRoleFilter}
              options={[
                { value: 'customer', label: 'Customers' },
                { value: 'mechanic', label: 'Mechanics' }
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2">Account Status</p>
            <PillSelector 
              value={statusFilter} 
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All' },
                { value: 'active', label: 'Active' },
                { value: 'banned', label: 'Banned' },
                { value: 'deactivated', label: 'Deactivated' }
              ]}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-text-muted ml-2 min-w-max">Sort By</p>
            <LuxurySelect 
              value={sortBy} 
              onChange={setSortBy}
              icon={FaSortAmountDown}
              options={[
                { value: 'newest', label: 'Newest First' },
                { value: 'oldest', label: 'Oldest First' },
                { value: 'name', label: 'Name A-Z' },
                { value: 'status', label: 'Account Status' }
              ]}
              className="w-44"
            />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card/80 backdrop-blur-md rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                <th className="py-6 pl-10">User Identity</th>
                <th className="py-6">Account Status</th>
                <th className="py-6">Join Date</th>
                <th className="py-6 pr-10 text-right">Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [1,2,3,4].map(n => (
                  <tr key={n} className="border-b border-white/5"><td colSpan={4} className="py-8 px-10"><div className="h-10 w-full bg-white/5 animate-pulse rounded-xl" /></td></tr>
                ))
              ) : sortedUsers.map((u, i) => (
                <motion.tr 
                  key={u._id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-all group"
                >
                  <td className="py-6 pl-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-soft-dark border border-white/10 flex items-center justify-center text-text-muted text-2xl relative overflow-hidden group-hover:scale-110 transition-transform">
                        {u.profilePhoto ? <img src={u.profilePhoto} className="w-full h-full object-cover" /> : <FaUserCircle />}
                        {u.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-card rounded-full" />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-white italic uppercase tracking-tight">{u.name}</p>
                        <p className="text-[10px] text-text-muted font-bold tracking-widest">{u.email}</p>
                        <p className="text-[10px] text-gold font-black uppercase mt-1">{u.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center w-fit gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        u.accountStatus === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        u.accountStatus === 'banned' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${u.accountStatus === 'active' ? 'bg-emerald-400' : 'bg-current'}`} />
                        {u.accountStatus}
                      </span>
                      {u.accountStatus === 'deactivated' && u.deactivatedUntil && (
                        <p className="text-[9px] text-text-muted italic">Until {new Date(u.deactivatedUntil).toLocaleDateString()}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-6 text-[11px] font-bold text-text-muted italic">
                    {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-6 pr-10">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      {u.accountStatus !== 'active' && (
                        <button 
                          onClick={() => handleUpdateStatus(u._id, 'active')}
                          title="Activate User"
                          className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-deep-black transition-all"
                        >
                          <FaCheck />
                        </button>
                      )}
                      
                      {u.accountStatus === 'active' && (
                        <>
                          <button 
                            onClick={() => handleUpdateStatus(u._id, 'deactivated', 2)}
                            title="Deactivate 2 Weeks"
                            className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center hover:bg-amber-500 hover:text-deep-black transition-all"
                          >
                            <FaClock />
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(u._id, 'banned')}
                            title="Ban User"
                            className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center hover:bg-red-500 hover:text-deep-black transition-all"
                          >
                            <FaBan />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && sortedUsers.length === 0 && (
          <div className="py-20 text-center text-text-muted">
            <FaUserCircle className="text-5xl opacity-10 mx-auto mb-4" />
            <p className="text-lg font-heading font-black italic uppercase">No users matched your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

