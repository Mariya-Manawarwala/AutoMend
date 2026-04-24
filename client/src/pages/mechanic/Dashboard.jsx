import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import { mockJobs, mockUsers, mockReviews } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";
import StarRating from "../../components/StarRating";

export default function MechanicDashboard() {
  const user = mockUsers.mechanic;
  const activeJobs = mockJobs.filter((j) => j.status !== "completed");
  const completedJobs = mockJobs.filter((j) => j.status === "completed");
  const totalEarnings = completedJobs.reduce((s, j) => s + j.laborCost, 0);

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
          Hello, <span className="text-brand">{user.name.split(" ")[0]}</span> 🔧
        </h1>
        <p className="text-text-muted mt-1">Here&apos;s your work overview for today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard icon="🔧" label="Active Jobs" value={activeJobs.length} trend="1 urgent" />
        <StatCard icon="✅" label="Completed" value={completedJobs.length} trend="This month" trendUp />
        <StatCard icon="⭐" label="Rating" value={user.rating} trend={`${user.jobsCompleted} total jobs`} trendUp />
        <StatCard icon="💰" label="Earnings" value={formatCurrency(totalEarnings)} trend="Labor charges" />
      </div>

      <Card hover={false}>
        <h2 className="text-xl font-bold text-text-primary mb-4">Active Jobs</h2>
        <div className="space-y-3">
          {activeJobs.map((job) => (
            <Link key={job.id} to={`/mechanic/jobs/${job.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-soft hover:bg-soft transition-colors gap-2">
              <div>
                <p className="text-text-primary font-semibold text-sm">{job.serviceName}</p>
                <p className="text-text-muted text-xs">{job.customerName} • {job.vehicleName} • {job.licensePlate}</p>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-text-muted text-xs">{formatDate(job.startDate)}</span>
                <StatusBadge status={job.status} />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card hover={false}>
        <h2 className="text-xl font-bold text-text-primary mb-4">Recent Reviews</h2>
        <div className="space-y-3">
          {mockReviews.slice(0, 3).map((r) => (
            <div key={r.id} className="p-3 rounded-lg bg-soft">
              <div className="flex items-center justify-between mb-1">
                <p className="text-text-primary font-semibold text-sm">{r.customerName}</p>
                <StarRating rating={r.rating} size="sm" />
              </div>
              <p className="text-text-muted text-xs">{r.comment}</p>
              <p className="text-text-muted text-xs mt-1">{r.serviceName} • {formatDate(r.date)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
