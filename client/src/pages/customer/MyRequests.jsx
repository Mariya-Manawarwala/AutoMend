import { Link } from "react-router-dom";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import SearchBar from "../../components/SearchBar";
import { mockRequests } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function MyRequests() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Requests</h1>
        <Link to="/requests/create" className="bg-brand hover:bg-brand-hover text-[#0E0E0E] font-semibold px-4 py-2 rounded-lg text-sm transition-colors">➕ New Request</Link>
      </div>

      <SearchBar placeholder="Search requests..." className="max-w-md" />

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "In Progress", "Completed"].map((tab) => (
          <button key={tab} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${tab === "All" ? "bg-brand text-[#0E0E0E]" : "bg-soft text-text-muted hover:text-text-primary"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {mockRequests.map((req) => (
          <Link key={req.id} to={`/requests/${req.id}`}>
            <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-brand/40 cursor-pointer mb-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-xl shrink-0">🔧</div>
                <div>
                  <h3 className="text-text-primary font-semibold">{req.serviceName}</h3>
                  <p className="text-text-muted text-xs mt-0.5">{req.vehicleName} • {req.licensePlate}</p>
                  <p className="text-text-muted text-xs mt-0.5">{req.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 sm:self-auto self-end">
                <div className="text-right">
                  <p className="text-brand font-semibold text-sm">{formatCurrency(req.estimatedCost)}</p>
                  <p className="text-text-muted text-xs">{formatDate(req.createdAt)}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
