import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function Register() {
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    if (role === "admin") navigate("/admin");
    else if (role === "mechanic") navigate("/mechanic");
    else navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Create Account</h2>
      <form className="space-y-5" onSubmit={handleRegister}>
        <Input label="Full Name" placeholder="Your full name" required />
        <Input label="Email Address" type="email" placeholder="you@example.com" required />
        <Input label="Phone Number" type="tel" placeholder="+91 9876543210" required />
        <Input label="Password" type="password" placeholder="••••••••" required />
        
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2 uppercase tracking-wider">Select Role</label>
          <select 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-soft border border-border-soft rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
          >
            <option value="customer">Customer</option>
            <option value="mechanic">Mechanic</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        
        <label className="flex items-center gap-2 text-text-muted text-sm cursor-pointer">
          <input type="checkbox" className="accent-brand" required />
          I agree to the Terms of Service
        </label>
        
        <Button size="lg" className="w-full" type="submit">Create Account</Button>
      </form>
      <p className="text-text-muted text-sm text-center mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-brand hover:text-brand-hover font-semibold transition-colors">Sign In</Link>
      </p>
    </AuthLayout>
  );
}
