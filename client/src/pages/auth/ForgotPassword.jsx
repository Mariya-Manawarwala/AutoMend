import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/Button";

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-text-primary mb-2">Reset Password</h2>
      <p className="text-text-muted text-sm mb-6">Enter your email address and we&apos;ll send you a reset link.</p>
      <form className="space-y-5">
        <div>
          <label className="block text-text-primary mb-1.5 text-sm font-semibold">Email Address</label>
          <input type="email" placeholder="you@example.com" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors" />
        </div>
        <Button variant="primary" size="lg" className="w-full">Send Reset Link</Button>
      </form>
      <p className="text-text-muted text-sm text-center mt-6">
        <Link to="/login" className="text-brand hover:text-brand font-semibold transition-colors">← Back to Sign In</Link>
      </p>
    </AuthLayout>
  );
}
