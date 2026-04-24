import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Public Pages
import Homepage from "./pages/public/Homepage";
import ServicesPage from "./pages/public/ServicesPage";
import FleetPage from "./pages/public/FleetPage";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";
import BlogPage from "./pages/public/BlogPage";
import BlogPost from "./pages/public/BlogPost";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Customer
import CustomerDashboard from "./pages/customer/Dashboard";
import CustomerProfile from "./pages/customer/Profile";
import MyVehicles from "./pages/customer/MyVehicles";
import AddVehicle from "./pages/customer/AddVehicle";
import CreateRequest from "./pages/customer/CreateRequest";
import MyRequests from "./pages/customer/MyRequests";
import RequestDetails from "./pages/customer/RequestDetails";
import ServiceHistory from "./pages/customer/ServiceHistory";
import AddReview from "./pages/customer/AddReview";
import ReviewsList from "./pages/customer/ReviewsList";
import ChatSupport from "./pages/customer/ChatSupport";
import CustomerSettings from "./pages/customer/Settings";

// Mechanic
import MechanicDashboard from "./pages/mechanic/Dashboard";
import MechanicProfile from "./pages/mechanic/Profile";
import AssignedJobs from "./pages/mechanic/AssignedJobs";
import JobDetails from "./pages/mechanic/JobDetails";
import UpdateJobStatus from "./pages/mechanic/UpdateJobStatus";

// Admin
import AdminDashboard from "./pages/admin/Dashboard";
import AnalyticsDashboard from "./pages/admin/AnalyticsDashboard";
import ManageMechanics from "./pages/admin/ManageMechanics";
import ManageServices from "./pages/admin/ManageServices";
import ManageParts from "./pages/admin/ManageParts";
import ManageRequests from "./pages/admin/ManageRequests";
import ManageCoupons from "./pages/admin/ManageCoupons";
import PaymentManagement from "./pages/admin/PaymentManagement";
import InvoiceGeneration from "./pages/admin/InvoiceGeneration";
import UserManagement from "./pages/admin/UserManagement";
import Reports from "./pages/admin/Reports";
import AdminSettings from "./pages/admin/Settings";

// Shared
import NotFound from "./pages/shared/NotFound";
import Unauthorized from "./pages/shared/Unauthorized";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with PublicLayout (Navbar + Footer) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Homepage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPost />} />
        </Route>

        {/* Auth Routes (no layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard Layout Routes */}
        <Route element={<DashboardLayout />}>
          {/* Customer Routes */}
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/vehicles" element={<MyVehicles />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
          <Route path="/requests/create" element={<CreateRequest />} />
          <Route path="/requests" element={<MyRequests />} />
          <Route path="/requests/:id" element={<RequestDetails />} />
          <Route path="/history" element={<ServiceHistory />} />
          <Route path="/reviews/add" element={<AddReview />} />
          <Route path="/reviews" element={<ReviewsList />} />
          <Route path="/chat" element={<ChatSupport />} />
          <Route path="/settings/*" element={<CustomerSettings />} />

          {/* Mechanic Routes */}
          <Route path="/mechanic" element={<MechanicDashboard />} />
          <Route path="/mechanic/profile" element={<MechanicProfile />} />
          <Route path="/mechanic/jobs" element={<AssignedJobs />} />
          <Route path="/mechanic/jobs/:id" element={<JobDetails />} />
          <Route path="/mechanic/jobs/:id/update" element={<UpdateJobStatus />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AnalyticsDashboard />} />
          <Route path="/admin/mechanics" element={<ManageMechanics />} />
          <Route path="/admin/services" element={<ManageServices />} />
          <Route path="/admin/parts" element={<ManageParts />} />
          <Route path="/admin/requests" element={<ManageRequests />} />
          <Route path="/admin/coupons" element={<ManageCoupons />} />
          <Route path="/admin/payments" element={<PaymentManagement />} />
          <Route path="/admin/invoices" element={<InvoiceGeneration />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Error Routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
