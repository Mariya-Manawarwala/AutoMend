import { Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Card from "../../components/Card";

// Sub-pages (We'll implement these next, exporting them from same file for simplicity or creating new ones. Creating new ones is better, but since they are small, let's just make separate components below for clean organization)
import UpdateAccount from "./settings/UpdateAccount";
import NotificationPreferences from "./settings/NotificationPreferences";
import SecuritySettings from "./settings/SecuritySettings";
import DeleteAccount from "./settings/DeleteAccount";

export default function SettingsRouter() {
  const location = useLocation();
  const isHub = location.pathname === "/settings" || location.pathname === "/settings/";

  return (
    <div className="space-y-6">
      {/* Header with Back button if not on Hub */}
      <div className="flex items-center gap-4">
        {!isHub && (
          <Link to="/settings" className="text-text-muted hover:text-brand transition-colors text-lg">
            ← Back
          </Link>
        )}
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Settings</h1>
      </div>

      <Routes>
        <Route path="/" element={<SettingsHub />} />
        <Route path="/update-account" element={<UpdateAccount />} />
        <Route path="/notifications" element={<NotificationPreferences />} />
        <Route path="/security" element={<SecuritySettings />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
      </Routes>
    </div>
  );
}

function SettingsHub() {
  const menuItems = [
    { title: "Update Account", desc: "Change your personal details and contact info.", icon: "👤", path: "update-account" },
    { title: "Notification Preferences", desc: "Manage how we contact you.", icon: "🔔", path: "notifications" },
    { title: "Security & Passwords", desc: "Update your password and secure your account.", icon: "🔒", path: "security" },
    { title: "Display Preferences", desc: "Change language and currency settings.", icon: "🌍", path: "#" },
    { title: "Delete Account", desc: "Permanently remove your data from AutoMend.", icon: "⚠️", path: "delete-account", danger: true },
  ];

  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {menuItems.map((item, idx) => (
        <Card 
          key={idx} 
          onClick={() => item.path !== "#" && navigate(item.path)}
          className={`cursor-pointer transition-all hover:shadow-md hover:border-brand ${item.danger ? "border-error/30 hover:border-error" : ""}`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${item.danger ? "bg-error/10 text-error" : "bg-brand/10 text-brand"}`}>
              {item.icon}
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${item.danger ? "text-error" : "text-text-primary"}`}>{item.title}</h3>
              <p className="text-text-muted text-sm mt-1">{item.desc}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
