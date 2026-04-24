export default function Input({ label, error, className = "", ...props }) {
  return (
    <div className="w-full">
      {label && <label className="block text-text-primary mb-1.5 text-sm font-semibold">{label}</label>}
      <input
        className={`w-full bg-white border border-border-soft rounded-lg px-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors ${
          error ? "border-error focus:border-error focus:ring-error/20" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}
