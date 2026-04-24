import { useParams, Link } from "react-router-dom";
import Card from "../../components/Card";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { mockRequests } from "../../utils/mockData";
import { formatCurrency, formatDate } from "../../utils/helpers";

export default function RequestDetails() {
  const { id } = useParams();
  const req = mockRequests.find((r) => r.id === Number(id)) || mockRequests[0];
  const timeline = [
    { label: "Request Created", date: req.createdAt, done: true },
    { label: "Under Review", date: req.createdAt, done: req.status !== "pending" },
    { label: "Mechanic Assigned", date: req.updatedAt, done: ["in-progress","completed"].includes(req.status) },
    { label: "In Progress", date: req.updatedAt, done: req.status === "in-progress" || req.status === "completed" },
    { label: "Completed", date: req.status === "completed" ? req.updatedAt : null, done: req.status === "completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/requests" className="text-text-muted hover:text-brand transition-colors">← Back</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Request #{req.id}</h1>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card hover={false} className="lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{req.serviceName}</h2>
              <p className="text-text-muted text-sm mt-1">{req.vehicleName} — {req.licensePlate}</p>
            </div>
            <StatusBadge status={req.status} />
          </div>
          <p className="text-text-muted text-xs uppercase tracking-wide mb-1">Description</p>
          <p className="text-text-secondary text-sm mb-4">{req.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-soft">
            <div><p className="text-text-muted text-xs">Priority</p><p className="text-text-primary font-semibold text-sm capitalize">{req.priority}</p></div>
            <div><p className="text-text-muted text-xs">Created</p><p className="text-text-primary font-semibold text-sm">{formatDate(req.createdAt)}</p></div>
            <div><p className="text-text-muted text-xs">Est. Cost</p><p className="text-brand font-semibold text-sm">{formatCurrency(req.estimatedCost)}</p></div>
            <div><p className="text-text-muted text-xs">Mechanic</p><p className="text-text-primary font-semibold text-sm">{req.assignedMechanic || "Not assigned"}</p></div>
          </div>
          {req.status === "completed" && (
            <div className="mt-6 pt-4 border-t border-soft flex gap-3">
              <Link to="/reviews/add"><Button variant="primary" size="sm">⭐ Leave Review</Button></Link>
              <Button variant="secondary" size="sm">🧾 View Invoice</Button>
            </div>
          )}
        </Card>
        <Card hover={false}>
          <h3 className="text-lg font-bold text-text-primary mb-4">Progress Timeline</h3>
          {timeline.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full border-2 ${step.done ? "bg-brand border-brand" : "bg-soft border-soft"}`} />
                {i < timeline.length - 1 && <div className={`w-0.5 h-8 ${step.done ? "bg-brand/40" : "bg-soft"}`} />}
              </div>
              <div className="pb-4">
                <p className={`text-sm font-semibold ${step.done ? "text-text-primary" : "text-text-muted"}`}>{step.label}</p>
                {step.date && step.done && <p className="text-text-muted text-xs">{formatDate(step.date)}</p>}
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
