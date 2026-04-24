import React from "react";
import { 
  Home, 
  Car, 
  FileText, 
  History, 
  MessageSquare, 
  Star, 
  Settings, 
  Tool, 
  ClipboardList, 
  Users, 
  PieChart, 
  CreditCard 
} from "lucide-react";

export const CUSTOMER_MENU = [
  { label: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
  { label: "My Vehicles", path: "/vehicles", icon: <Car size={20} /> },
  { label: "Create Request", path: "/requests/create", icon: <FileText size={20} /> },
  { label: "My Requests", path: "/requests", icon: <ClipboardList size={20} /> },
  { label: "Service History", path: "/history", icon: <History size={20} /> },
  { label: "Support Chat", path: "/chat", icon: <MessageSquare size={20} /> },
  { label: "Reviews", path: "/reviews", icon: <Star size={20} /> },
  { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
];

export const MECHANIC_MENU = [
  { label: "Dashboard", path: "/mechanic", icon: <Home size={20} /> },
  { label: "Assigned Jobs", path: "/mechanic/jobs", icon: <Tool size={20} /> },
  { label: "Service History", path: "/mechanic/history", icon: <History size={20} /> },
  { label: "Support Chat", path: "/mechanic/chat", icon: <MessageSquare size={20} /> },
  { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
];

export const ADMIN_MENU = [
  { label: "Dashboard", path: "/admin", icon: <Home size={20} /> },
  { label: "Analytics", path: "/admin/analytics", icon: <PieChart size={20} /> },
  { label: "Manage Requests", path: "/admin/requests", icon: <ClipboardList size={20} /> },
  { label: "User Management", path: "/admin/users", icon: <Users size={20} /> },
  { label: "Manage Services", path: "/admin/services", icon: <Tool size={20} /> },
  { label: "Manage Parts", path: "/admin/parts", icon: <Settings size={20} /> },
  { label: "Payments", path: "/admin/payments", icon: <CreditCard size={20} /> },
  { label: "Settings", path: "/settings", icon: <Settings size={20} /> },
];
