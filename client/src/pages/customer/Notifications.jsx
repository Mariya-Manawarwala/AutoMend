import Card from "../../components/Card";
import { mockNotifications } from "../../utils/mockData";
import { getRelativeTime } from "../../utils/helpers";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Notifications</h1>
        <button className="text-brand hover:text-brand text-sm font-semibold transition-colors cursor-pointer">Mark all read</button>
      </div>
      <div className="space-y-2">
        {mockNotifications.map((n) => (
          <Card key={n.id} className={`flex items-start gap-4 ${!n.read ? "border-brand/30 bg-brand/5" : ""}`}>
            <span className="text-2xl shrink-0">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`font-semibold text-sm ${!n.read ? "text-text-primary" : "text-text-secondary"}`}>{n.title}</h3>
                {!n.read && <span className="w-2 h-2 bg-brand rounded-full shrink-0 mt-1.5" />}
              </div>
              <p className="text-text-muted text-xs mt-0.5">{n.message}</p>
              <p className="text-text-muted text-xs mt-1">{getRelativeTime(n.date)}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
