import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { mockAdminStats, mockMonthlyRevenue, mockWeeklyData } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";

const tooltipStyle = { backgroundColor: "#1F2937", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "8px", color: "#F5F1E8" };

export default function Reports() {
  const s = mockAdminStats;
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Reports</h1>
        <button className="bg-brand hover:bg-brand-hover text-[#0E0E0E] font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">📥 Export CSV</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon="📋" label="Total Requests" value={s.totalRequests} />
        <StatCard icon="✅" label="Completed" value={s.completed} />
        <StatCard icon="💰" label="Total Revenue" value={formatCurrency(s.totalRevenue)} />
        <StatCard icon="⭐" label="Avg Rating" value={s.averageRating} />
      </div>

      <Card hover={false}>
        <h2 className="text-lg font-bold text-text-primary mb-4">Monthly Revenue Report</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockMonthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#D4AF37" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card hover={false}>
        <h2 className="text-lg font-bold text-text-primary mb-4">Summary Table</h2>
        <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-soft">
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Day</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Requests</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Completed</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {mockWeeklyData.map((d) => (
                <tr key={d.day} className="border-b border-soft hover:bg-soft transition-colors">
                  <td className="py-3 px-4 text-text-primary text-sm">{d.day}</td>
                  <td className="py-3 px-4 text-text-secondary text-sm">{d.requests}</td>
                  <td className="py-3 px-4 text-green-400 text-sm">{d.completed}</td>
                  <td className="py-3 px-4 text-brand font-semibold text-sm">{formatCurrency(d.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
