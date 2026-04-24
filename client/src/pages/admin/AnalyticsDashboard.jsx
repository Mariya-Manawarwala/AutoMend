import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import Card from "../../components/Card";
import StatCard from "../../components/StatCard";
import { mockAdminStats, mockMonthlyRevenue, mockServiceDistribution, mockWeeklyData, mockMechanics } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";
import StarRating from "../../components/StarRating";

const tooltipStyle = { backgroundColor: "#1F2937", border: "1px solid rgba(217,119,6,0.2)", borderRadius: "8px", color: "#F5F1E8" };

export default function AnalyticsDashboard() {
  const s = mockAdminStats;
  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon="🔧" label="In Progress" value={s.inProgress} />
        <StatCard icon="✅" label="Completed" value={s.completed} trend="66% rate" trendUp />
        <StatCard icon="⏱️" label="Avg Job Time" value={s.avgJobTime} />
        <StatCard icon="👥" label="Customers" value={s.totalCustomers} trend="Growing" trendUp />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false}>
          <h2 className="text-lg font-bold text-text-primary mb-4">Monthly Revenue</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockMonthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={2} dot={{ fill: "#D4AF37" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card hover={false}>
          <h2 className="text-lg font-bold text-text-primary mb-4">Service Distribution</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mockServiceDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {mockServiceDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card hover={false}>
        <h2 className="text-lg font-bold text-text-primary mb-4">Revenue by Day</h2>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="#D4A574" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card hover={false}>
        <h2 className="text-lg font-bold text-text-primary mb-4">Mechanic Performance</h2>
        <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-soft">
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Mechanic</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Jobs Done</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Rating</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockMechanics.map((m) => (
                <tr key={m.id} className="border-b border-soft hover:bg-soft transition-colors">
                  <td className="py-3 px-4 text-text-primary text-sm">{m.name}</td>
                  <td className="py-3 px-4 text-text-secondary text-sm">{m.jobsCompleted}</td>
                  <td className="py-3 px-4"><StarRating rating={Math.round(m.rating)} size="sm" /></td>
                  <td className="py-3 px-4"><span className={`text-xs font-bold ${m.availability === "Available" ? "text-green-400" : "text-yellow-400"}`}>{m.availability}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
