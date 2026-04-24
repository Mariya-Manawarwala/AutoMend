import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { mockAdminStats, mockWeeklyData, mockRequests } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";

export default function AdminDashboard() {
  const s = mockAdminStats;
  const pending = mockRequests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-muted mt-1">Overview of your garage operations.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon="📋" label="Total Requests" value={s.totalRequests} trend={`${s.monthlyGrowth}% growth`} trendUp />
        <StatCard icon="⏳" label="Pending" value={s.pendingApproval} trend="Needs review" />
        <StatCard icon="💰" label="Revenue" value={formatCurrency(s.totalRevenue)} trend="This month" trendUp />
        <StatCard icon="⭐" label="Avg Rating" value={s.averageRating} trend={`${s.totalMechanics} mechanics`} trendUp />
      </div>

      <Card hover={false}>
        <h2 className="text-xl font-bold text-text-primary mb-4">Weekly Overview</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockWeeklyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "8px", color: "#F5F1E8" }} />
              <Bar dataKey="requests" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Requests" />
              <Bar dataKey="completed" fill="#51CF66" radius={[4, 4, 0, 0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card hover={false}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">Pending Approvals</h2>
          <Link to="/admin/requests" className="text-brand hover:text-brand text-sm font-semibold transition-colors">View All →</Link>
        </div>
        <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-soft">
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Customer</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Vehicle</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Service</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Status</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((r) => (
                <tr key={r.id} className="border-b border-soft hover:bg-soft transition-colors">
                  <td className="py-3 px-4 text-text-primary text-sm">{r.customerName}</td>
                  <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{r.vehicleName}</td>
                  <td className="py-3 px-4 text-text-secondary text-sm">{r.serviceName}</td>
                  <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="success" size="sm">Approve</Button>
                      <Button variant="danger" size="sm">Decline</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
