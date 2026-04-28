import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaUserCircle, FaSearch, FaBan, FaCheck, FaEllipsisV } from 'react-icons/fa'

const MOCK_USERS = [
  { id: 'USR-101', name: 'Alex Johnson', email: 'alex@example.com', joinDate: 'Jan 15, 2026', totalJobs: 4, status: 'active' },
  { id: 'USR-102', name: 'Samantha Lee', email: 'sam@example.com', joinDate: 'Feb 22, 2026', totalJobs: 1, status: 'active' },
  { id: 'USR-103', name: 'Michael Brown', email: 'mike@example.com', joinDate: 'Mar 05, 2026', totalJobs: 0, status: 'banned' },
  { id: 'USR-104', name: 'Emily Davis', email: 'emily@example.com', joinDate: 'Apr 10, 2026', totalJobs: 2, status: 'active' },
]

export default function Users() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6 pb-10 max-w-6xl">
      
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..." className="w-full pl-10 pr-4 py-3 bg-card border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-gold/50 shadow-lg" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select className="bg-card border border-white/10 text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-gold/30 flex-1 sm:flex-none">
            <option>All Status</option><option>Active</option><option>Banned</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card/80 backdrop-blur-md rounded-3xl p-6 border border-white/5 shadow-lg overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-white/10 text-sm text-text-muted uppercase tracking-wider">
              <th className="pb-4 pl-4 font-semibold">User Details</th>
              <th className="pb-4 font-semibold">Joined Date</th>
              <th className="pb-4 font-semibold">Total Bookings</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 pr-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u, i) => (
              <motion.tr key={u.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors group">
                <td className="py-4 pl-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-soft-dark border border-white/10 flex items-center justify-center text-text-muted text-xl"><FaUserCircle /></div>
                    <div>
                      <p className="text-sm font-bold text-white">{u.name}</p>
                      <p className="text-xs text-text-muted">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 text-sm text-text-muted">{u.joinDate}</td>
                <td className="py-4 text-sm text-white font-medium">{u.totalJobs} jobs</td>
                <td className="py-4">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${u.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                    {u.status}
                  </span>
                </td>
                <td className="py-4 pr-4 text-right">
                  <button className="p-2 text-text-muted hover:text-white transition-colors"><FaEllipsisV /></button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        
        {filtered.length === 0 && <div className="py-12 text-center text-text-muted">No users found.</div>}
      </div>
    </div>
  )
}
