import { Link } from "react-router-dom";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import SearchBar from "../../components/SearchBar";
import { mockJobs } from "../../utils/mockData";
import { formatDate } from "../../utils/helpers";

export default function AssignedJobs() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Assigned Jobs</h1>
      <SearchBar placeholder="Search jobs..." className="max-w-md" />
      <div className="flex gap-2 flex-wrap">
        {["All", "In Progress", "Completed"].map((tab) => (
          <button key={tab} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${tab === "All" ? "bg-brand text-[#0E0E0E]" : "bg-soft text-text-muted hover:text-text-primary"}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {mockJobs.map((job) => (
          <Link key={job.id} to={`/mechanic/jobs/${job.id}`}>
            <Card className="hover:border-brand/40 cursor-pointer mb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center text-xl shrink-0">⚙️</div>
                  <div>
                    <h3 className="text-text-primary font-semibold">{job.serviceName}</h3>
                    <p className="text-text-muted text-xs mt-0.5">{job.customerName} • {job.vehicleName}</p>
                    <p className="text-text-muted text-xs">{job.licensePlate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="text-text-muted text-xs">{formatDate(job.startDate)}</span>
                  <StatusBadge status={job.status} />
                </div>
              </div>
              {job.notes && <p className="text-text-muted text-xs mt-3 bg-soft p-2 rounded">{job.notes}</p>}
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
