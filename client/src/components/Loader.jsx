export default function Loader({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative w-16 h-16">
        <svg className="w-full h-full animate-spin text-amber-500" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="80 40" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-amber-500 text-lg">🚗</span>
        </div>
      </div>
      <p className="text-gray-400 text-sm animate-pulse">{message}</p>
    </div>
  );
}
