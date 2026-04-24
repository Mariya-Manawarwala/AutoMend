export default function NotificationBell({ count = 0 }) {
  return (
    <div className="relative cursor-pointer">
      <span className="text-xl">🔔</span>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full animate-pulse">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
}
