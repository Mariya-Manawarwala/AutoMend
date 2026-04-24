export const ROLES = { CUSTOMER: "customer", MECHANIC: "mechanic", ADMIN: "admin" };

export const STATUS_LIST = ["pending", "queued", "in-progress", "waiting-parts", "completed", "declined"];

export const PRIORITY_LIST = ["normal", "high", "urgent"];

export const CUSTOMER_MENU = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "My Vehicles", path: "/vehicles", icon: "🚗" },
  { label: "Create Request", path: "/requests/create", icon: "➕" },
  { label: "My Requests", path: "/requests", icon: "📋" },
  { label: "Service History", path: "/history", icon: "📜" },
  { label: "Support Chat", path: "/chat", icon: "💬" },
  { label: "Reviews", path: "/reviews", icon: "⭐" },
  { label: "Settings", path: "/settings", icon: "⚙️" },
  { label: "Profile", path: "/profile", icon: "👤" },
];

export const MECHANIC_MENU = [
  { label: "Dashboard", path: "/mechanic", icon: "📊" },
  { label: "Assigned Jobs", path: "/mechanic/jobs", icon: "🔧" },
  { label: "Profile", path: "/mechanic/profile", icon: "👤" },
];

export const ADMIN_MENU = [
  { label: "Dashboard", path: "/admin", icon: "📊" },
  { label: "Analytics", path: "/admin/analytics", icon: "📈" },
  { label: "Manage Mechanics", path: "/admin/mechanics", icon: "🔧" },
  { label: "Manage Services", path: "/admin/services", icon: "⚙️" },
  { label: "Manage Parts", path: "/admin/parts", icon: "🔩" },
  { label: "Manage Requests", path: "/admin/requests", icon: "📋" },
  { label: "Manage Coupons", path: "/admin/coupons", icon: "🎟️" },
  { label: "Payments", path: "/admin/payments", icon: "💰" },
  { label: "Invoices", path: "/admin/invoices", icon: "🧾" },
  { label: "Users", path: "/admin/users", icon: "👥" },
  { label: "Reports", path: "/admin/reports", icon: "📄" },
  { label: "Settings", path: "/admin/settings", icon: "⚙️" },
];
