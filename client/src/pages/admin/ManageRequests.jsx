import Card from "../../components/Card";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import SearchBar from "../../components/SearchBar";
import { mockRequests, mockMechanics } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function ManageRequests() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Manage Requests</h1>
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar placeholder="Search requests..." className="flex-1 max-w-md" />
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "In Progress", "Completed"].map((tab) => (
            <button key={tab} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${tab === "All" ? "bg-brand text-[#0E0E0E]" : "bg-soft text-text-muted hover:text-text-primary"}`}>{tab}</button>
          ))}
        </div>
      </div>
      <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-soft">
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">#</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Customer</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Vehicle</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Service</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Cost</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden lg:table-cell">Mechanic</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockRequests.map((r) => (
              <tr key={r.id} className="border-b border-soft hover:bg-soft transition-colors">
                <td className="py-3 px-4 text-text-muted text-sm">#{r.id}</td>
                <td className="py-3 px-4 text-text-primary text-sm">{r.customerName}</td>
                <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{r.vehicleName}</td>
                <td className="py-3 px-4 text-text-secondary text-sm">{r.serviceName}</td>
                <td className="py-3 px-4 text-brand font-semibold text-sm">{formatCurrency(r.estimatedCost)}</td>
                <td className="py-3 px-4"><StatusBadge status={r.status} /></td>
                <td className="py-3 px-4 text-text-muted text-sm hidden lg:table-cell">{r.assignedMechanic || "—"}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    {!r.assignedMechanic && <Button variant="primary" size="sm">Assign</Button>}
                    <Button variant="ghost" size="sm">View</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
