import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { mockRequests, mockUsers } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function CustomerDashboard() {
  const user = mockUsers.customer;
  const completed = mockRequests.filter((r) => r.status === "completed");
  const active = mockRequests.filter((r) => r.status !== "completed" && r.status !== "declined");
  const totalSpent = completed.reduce((sum, r) => sum + (r.finalCost || 0), 0);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          Welcome back, <span className="text-brand">{user.name.split(" ")[0]}</span> 👋
        </h1>
        <p className="text-text-muted mt-1">Here&apos;s an overview of your vehicle services.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon="📋" label="Total Requests" value={mockRequests.length} trend="2 this month" trendUp />
        <StatCard icon="🔧" label="Active" value={active.length} trend="In progress" />
        <StatCard icon="✅" label="Completed" value={completed.length} trend="100% success" trendUp />
        <StatCard icon="💰" label="Total Spent" value={formatCurrency(totalSpent)} trend="This year" />
      </div>

      {/* Recent Requests */}
      <Card hover={false}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl font-bold text-text-primary">Recent Requests</h2>
          <Link to="/requests" className="text-brand hover:text-brand text-sm font-semibold transition-colors">View All →</Link>
        </div>
        <div className="space-y-3">
          {mockRequests.slice(0, 4).map((req) => (
            <Link key={req.id} to={`/requests/${req.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-soft hover:bg-soft transition-colors gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-lg">🔧</div>
                <div>
                  <p className="text-text-primary font-semibold text-sm">{req.serviceName}</p>
                  <p className="text-text-muted text-xs">{req.vehicleName} • {formatDate(req.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:self-auto self-end">
                <span className="text-brand text-sm font-semibold">{req.estimatedCost ? formatCurrency(req.estimatedCost) : "TBD"}</span>
                <StatusBadge status={req.status} />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <Link to="/requests/create">
          <Card className="text-center hover:border-brand/50 cursor-pointer group">
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">➕</span>
            <p className="text-text-primary font-semibold">New Request</p>
            <p className="text-text-muted text-xs mt-1">Create a repair request</p>
          </Card>
        </Link>
        <Link to="/vehicles">
          <Card className="text-center hover:border-brand/50 cursor-pointer group">
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🚗</span>
            <p className="text-text-primary font-semibold">My Vehicles</p>
            <p className="text-text-muted text-xs mt-1">Manage your vehicles</p>
          </Card>
        </Link>
        <Link to="/chat">
          <Card className="text-center hover:border-brand/50 cursor-pointer group">
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">💬</span>
            <p className="text-text-primary font-semibold">AI Support</p>
            <p className="text-text-muted text-xs mt-1">Chat with our AI assistant</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
