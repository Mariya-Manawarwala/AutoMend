export default function Select({ label, options = [], placeholder = "-- Select --", defaultValue, required, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-amber-100 text-sm font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        defaultValue={defaultValue}
        className={`w-full bg-gray-700/50 border border-amber-600/20 rounded-lg p-3 text-amber-50 focus:outline-none focus:border-amber-500 transition-colors ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
