export default function Checkbox({ label, defaultChecked, className = "", ...props }) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-5 h-5 accent-amber-500"
        {...props}
      />
      <span className="text-gray-300 text-sm">{label}</span>
    </label>
  );
}
