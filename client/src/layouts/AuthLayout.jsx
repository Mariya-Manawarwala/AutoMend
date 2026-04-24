import { Link } from "react-router-dom";

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-slide-up">
        {/* Branding */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-brand">Auto</span>
              <span className="text-text-primary">Mend</span>
            </h1>
          </Link>
          <p className="text-text-muted text-sm">AI-Powered Garage Management</p>
        </div>
        {/* Content */}
        <div className="bg-secondary border border-soft rounded-2xl p-6 md:p-8 shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
}
