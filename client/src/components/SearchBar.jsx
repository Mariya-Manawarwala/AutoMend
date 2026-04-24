export default function SearchBar({ placeholder = "Search...", value, onChange, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        defaultValue={value}
        onChange={onChange}
        className="w-full bg-white border border-border-soft rounded-lg pl-10 pr-4 py-2.5 text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors"
      />
    </div>
  );
}
