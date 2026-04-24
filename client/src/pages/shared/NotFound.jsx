import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-secondary to-primary flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <p className="text-8xl font-bold text-brand mb-4">404</p>
        <h1 className="text-3xl font-bold text-text-primary mb-2">Page Not Found</h1>
        <p className="text-text-muted mb-8 max-w-md mx-auto">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link to="/" className="bg-brand hover:bg-brand-hover text-[#0E0E0E] font-semibold px-6 py-3 rounded-lg transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
