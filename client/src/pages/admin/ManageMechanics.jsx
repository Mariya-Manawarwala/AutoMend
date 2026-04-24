import Card from "../../components/Card";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import StarRating from "../../components/StarRating";
import SearchBar from "../../components/SearchBar";
import { mockMechanics } from "../../utils/mockData";

export default function ManageMechanics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Manage Mechanics</h1>
        <Button variant="primary" size="sm">➕ Add Mechanic</Button>
      </div>
      <SearchBar placeholder="Search mechanics..." className="max-w-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {mockMechanics.map((m) => (
          <Card key={m.id}>
            <div className="flex items-start gap-4">
              <img src={m.avatar} alt={m.name} className="w-14 h-14 rounded-full object-cover border border-brand/30" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-text-primary font-bold">{m.name}</h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.availability === "Available" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{m.availability}</span>
                </div>
                <p className="text-text-muted text-xs">{m.email} • {m.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <StarRating rating={Math.round(m.rating)} size="sm" />
                  <span className="text-brand text-xs">{m.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {m.skills.map((s) => (
                    <span key={s} className="bg-soft text-text-secondary px-2 py-0.5 rounded text-xs">{s}</span>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="text-text-muted text-xs">✅ {m.jobsCompleted} completed</span>
                  <span className="text-text-muted text-xs">🔧 {m.activeJobs} active</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-soft">
              <Button variant="secondary" size="sm" className="flex-1">Edit</Button>
              <Button variant="ghost" size="sm" className="flex-1">View Jobs</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
