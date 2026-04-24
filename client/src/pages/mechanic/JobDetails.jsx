import { useParams, Link } from "react-router-dom";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { mockJobs } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function JobDetails() {
  const { id } = useParams();
  const job = mockJobs.find((j) => j.id === Number(id)) || mockJobs[0];
  const partsCost = job.partsUsed.reduce((s, p) => s + p.cost * p.qty, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/mechanic/jobs" className="text-text-muted hover:text-brand transition-colors">← Back</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Job #{job.id}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card hover={false} className="lg:col-span-2">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{job.serviceName}</h2>
              <p className="text-text-muted text-sm">{job.customerName} • {job.vehicleName} ({job.licensePlate})</p>
            </div>
            <StatusBadge status={job.status} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-soft">
            <div><p className="text-text-muted text-xs">Priority</p><p className="text-text-primary font-semibold text-sm capitalize">{job.priority}</p></div>
            <div><p className="text-text-muted text-xs">Start Date</p><p className="text-text-primary font-semibold text-sm">{formatDate(job.startDate)}</p></div>
            <div><p className="text-text-muted text-xs">Est. Cost</p><p className="text-brand font-semibold text-sm">{formatCurrency(job.estimatedCost)}</p></div>
            <div><p className="text-text-muted text-xs">Labor</p><p className="text-brand font-semibold text-sm">{formatCurrency(job.laborCost)}</p></div>
          </div>
          <div className="mt-4">
            <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Notes</p>
            <p className="text-text-secondary text-sm">{job.notes}</p>
          </div>
          {job.status !== "completed" && (
            <div className="mt-6 flex gap-3">
              <Link to={`/mechanic/jobs/${job.id}/update`}><Button variant="primary" size="sm">Update Status</Button></Link>
              <Button variant="secondary" size="sm">Add Notes</Button>
            </div>
          )}
        </Card>
        <Card hover={false}>
          <h3 className="text-lg font-bold text-text-primary mb-4">Parts Used</h3>
          <div className="space-y-3">
            {job.partsUsed.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-soft rounded-lg">
                <div>
                  <p className="text-text-primary text-sm">{p.name}</p>
                  <p className="text-text-muted text-xs">Qty: {p.qty}</p>
                </div>
                <p className="text-brand text-sm font-semibold">{formatCurrency(p.cost * p.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-soft flex justify-between">
            <span className="text-text-muted text-sm">Total Parts</span>
            <span className="text-brand font-bold">{formatCurrency(partsCost)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
