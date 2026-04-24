import { useParams, Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { mockJobs } from "../../utils/mockData";

export default function UpdateJobStatus() {
  const { id } = useParams();
  const job = mockJobs.find((j) => j.id === Number(id)) || mockJobs[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to={`/mechanic/jobs/${job.id}`} className="text-text-muted hover:text-brand transition-colors">← Back</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Update Job #{job.id}</h1>
      </div>
      <Card hover={false} className="max-w-xl mx-auto">
        <h2 className="text-lg font-bold text-text-primary mb-1">{job.serviceName}</h2>
        <p className="text-text-muted text-sm mb-6">{job.vehicleName} — {job.licensePlate}</p>
        <form className="space-y-4">
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Status</label>
            <select defaultValue={job.status} className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors">
              <option value="in-progress">In Progress</option>
              <option value="waiting-parts">Waiting for Parts</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Notes</label>
            <textarea defaultValue={job.notes} className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors h-28 resize-none" placeholder="Add work notes..." />
          </div>
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Add Part Used</label>
            <div className="flex gap-2">
              <input type="text" placeholder="Part name" className="flex-1 bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors" />
              <input type="number" placeholder="Cost" className="w-24 bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors" />
              <Button variant="secondary" size="md">Add</Button>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="primary" className="flex-1">Save Changes</Button>
            <Link to={`/mechanic/jobs/${job.id}`} className="flex-1">
              <Button variant="secondary" className="w-full">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
