export default function Textarea({ label, placeholder, defaultValue, rows = 5, required, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-amber-100 text-sm font-semibold">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
        className={`w-full bg-gray-700/50 border border-amber-600/20 rounded-lg p-3 text-amber-50 placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  );
}
