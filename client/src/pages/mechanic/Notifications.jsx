import Card from "../../components/Card";
import { mockNotifications } from "../../utils/mockData";
import { getRelativeTime } from "../../utils/helpers";

export default function MechanicNotifications() {
  const mechNotifs = mockNotifications.filter((n) => ["assignment", "status_update", "review"].includes(n.type));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Notifications</h1>
        <button className="text-brand hover:text-brand text-sm font-semibold transition-colors cursor-pointer">Mark all read</button>
      </div>
      <div className="space-y-2">
        {mechNotifs.map((n) => (
          <Card key={n.id} className={`flex items-start gap-4 ${!n.read ? "border-brand/30 bg-brand/5" : ""}`}>
            <span className="text-2xl shrink-0">{n.icon}</span>
            <div className="flex-1">
              <h3 className={`font-semibold text-sm ${!n.read ? "text-text-primary" : "text-text-secondary"}`}>{n.title}</h3>
              <p className="text-text-muted text-xs mt-0.5">{n.message}</p>
              <p className="text-text-muted text-xs mt-1">{getRelativeTime(n.date)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
