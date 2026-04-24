import Card from "../../components/Card";
import Button from "../../components/Button";
import StatCard from "../../components/StatCard";
import { mockRequests } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function CustomerReports() {
  const completed = mockRequests.filter((r) => r.status === "completed");
  const totalSpent = completed.reduce((s, r) => s + (r.finalCost || r.estimatedCost), 0);
  const avgCost = completed.length ? Math.round(totalSpent / completed.length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Reports</h1>
        <Button variant="primary" size="sm">📥 Export CSV</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon="📋" label="Total Requests" value={mockRequests.length} />
        <StatCard icon="✅" label="Completed" value={completed.length} />
        <StatCard icon="💰" label="Total Spent" value={formatCurrency(totalSpent)} />
        <StatCard icon="📊" label="Avg. Cost" value={formatCurrency(avgCost)} />
      </div>

      <Card hover={false}>
        <h2 className="text-lg font-bold text-text-primary mb-4">Service Summary</h2>
        <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-soft">
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Service</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Vehicle</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Date</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Cost</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockRequests.map((r) => (
                <tr key={r.id} className="border-b border-soft hover:bg-soft transition-colors">
                  <td className="py-3 px-4 text-text-primary text-sm">{r.serviceName}</td>
                  <td className="py-3 px-4 text-text-muted text-sm">{r.vehicleName}</td>
                  <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{formatDate(r.createdAt)}</td>
                  <td className="py-3 px-4 text-brand font-semibold text-sm">{formatCurrency(r.finalCost || r.estimatedCost)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-bold ${r.status === "completed" ? "text-green-400" : r.status === "in-progress" ? "text-blue-400" : "text-text-muted"}`}>
                      {r.status.replace(/-/g, " ").toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card hover={false}>
        <h2 className="text-lg font-bold text-text-primary mb-4">Spending by Service</h2>
        <div className="space-y-3">
          {[
            { name: "Engine Repair", amount: 8000, pct: 55 },
            { name: "Tire Replacement", amount: 4000, pct: 27 },
            { name: "Oil Change", amount: 1500, pct: 10 },
            { name: "Brake Service", amount: 1200, pct: 8 },
          ].map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">{s.name}</span>
                <span className="text-brand font-semibold">{formatCurrency(s.amount)}</span>
              </div>
              <div className="w-full bg-soft rounded-full h-2">
                <div className="bg-brand h-2 rounded-full transition-all duration-500" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
