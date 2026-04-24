import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine role based on route for rendering the correct sidebar
  let currentRole = "customer";
  if (location.pathname.startsWith("/admin")) {
    currentRole = "admin";
  } else if (location.pathname.startsWith("/mechanic")) {
    currentRole = "mechanic";
  }

  return (
    <div className="flex min-h-screen bg-soft">
      <Sidebar
        currentRole={currentRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          currentRole={currentRole}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
