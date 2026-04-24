import { Link } from "react-router-dom";
import { mockNotifications } from "../utils/mockData";

export default function Navbar({ currentRole, onToggleSidebar }) {
  const unread = mockNotifications.filter((n) => !n.read).length;
  const roleLabels = { customer: "Customer", mechanic: "Mechanic", admin: "Admin" };
  const rolePaths = { customer: "/dashboard", mechanic: "/mechanic", admin: "/admin" };

  return (
    <nav className="bg-soft border-b border-border-soft sticky top-0 z-30">
      <div className="px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="md:hidden text-text-primary text-2xl cursor-pointer hover:text-brand transition-colors">
            ☰
          </button>
          
          {/* Breadcrumb / Title Area - Often seen in eProduct header */}
          <div className="hidden sm:block">
            <h2 className="text-xl font-bold text-text-primary capitalize">{currentRole} Dashboard</h2>
            <p className="text-xs text-text-muted mt-0.5">Welcome back to AutoMend</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-text-primary">{roleLabels[currentRole]}</p>
              <p className="text-xs text-text-muted">Active User</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand-deep font-bold border-2 border-white shadow-sm">
              {roleLabels[currentRole][0]}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
