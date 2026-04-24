import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { mockRequests } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function ServiceHistory() {
  const completed = mockRequests.filter((r) => r.status === "completed");
  const totalSpent = completed.reduce((s, r) => s + (r.finalCost || r.estimatedCost), 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Service History</h1>
        <div className="bg-secondary border border-soft rounded-lg px-4 py-2 text-sm">
          <span className="text-text-muted">Total Spent: </span>
          <span className="text-brand font-bold">{formatCurrency(totalSpent)}</span>
        </div>
      </div>
      {completed.length === 0 ? (
        <Card className="text-center py-12">
          <span className="text-4xl mb-3 block">📜</span>
          <p className="text-text-muted">No completed services yet.</p>
        </Card>
      ) : (
        <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-soft">
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Service</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Vehicle</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Date</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Cost</th>
                <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {completed.map((r) => (
                <tr key={r.id} className="border-b border-soft hover:bg-soft transition-colors">
                  <td className="py-3 px-4 text-text-primary text-sm">{r.serviceName}</td>
                  <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{r.vehicleName}</td>
                  <td className="py-3 px-4 text-text-muted text-sm">{formatDate(r.updatedAt)}</td>
                  <td className="py-3 px-4 text-brand font-semibold text-sm">{formatCurrency(r.finalCost || r.estimatedCost)}</td>
                  <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
