import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function Login() {
  const [role, setRole] = useState("customer");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (role === "admin") navigate("/admin");
    else if (role === "mechanic") navigate("/mechanic");
    else navigate("/dashboard");
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Welcome Back</h2>
      <form className="space-y-5" onSubmit={handleLogin}>
        <Input label="Email Address" type="email" placeholder="you@example.com" required />
        <Input label="Password" type="password" placeholder="••••••••" required />
        
        <div>
          <label className="block text-sm font-bold text-text-primary mb-2 uppercase tracking-wider">Login As</label>
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

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-text-muted cursor-pointer">
            <input type="checkbox" className="accent-brand" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-brand hover:text-brand-hover transition-colors">Forgot Password?</Link>
        </div>
        
        <Button size="lg" className="w-full" type="submit">Sign In</Button>
      </form>
      <p className="text-text-muted text-sm text-center mt-6">
        Don&apos;t have an account?{" "}
        <Link to="/register" className="text-brand hover:text-brand-hover font-semibold transition-colors">Create Account</Link>
      </p>
    </AuthLayout>
  );
}
