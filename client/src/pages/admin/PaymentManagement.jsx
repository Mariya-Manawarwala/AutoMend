import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import SearchBar from "../../components/SearchBar";
import { mockPayments } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function PaymentManagement() {
  const total = mockPayments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Payments</h1>
        <div className="bg-secondary border border-soft rounded-lg px-4 py-2 text-sm">
          <span className="text-text-muted">Total Collected: </span>
          <span className="text-brand font-bold">{formatCurrency(total)}</span>
        </div>
      </div>
      <SearchBar placeholder="Search payments..." className="max-w-md" />
      <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-soft">
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">ID</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Customer</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Service</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Amount</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Method</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden lg:table-cell">Date</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockPayments.map((p) => (
              <tr key={p.id} className="border-b border-soft hover:bg-soft transition-colors">
                <td className="py-3 px-4 text-text-muted text-sm">#{p.id}</td>
                <td className="py-3 px-4 text-text-primary text-sm">{p.customerName}</td>
                <td className="py-3 px-4 text-text-secondary text-sm">{p.serviceName}</td>
                <td className="py-3 px-4 text-brand font-semibold text-sm">{formatCurrency(p.amount)}</td>
                <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{p.paymentMethod || "—"}</td>
                <td className="py-3 px-4 text-text-muted text-sm hidden lg:table-cell">{p.date ? formatDate(p.date) : "—"}</td>
                <td className="py-3 px-4"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
