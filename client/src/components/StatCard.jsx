export default function StatCard({ icon, label, value, trend, trendUp = true, className = "" }) {
  return (
    <div className={`bg-[#4A4238] border border-[#D4AF37]/20 rounded-xl p-4 md:p-6 shadow-lg hover:shadow-2xl hover:border-[#D4AF37]/40 transition-all duration-300 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#A89968] text-xs md:text-sm">{label}</p>
          <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] mt-1">{value}</p>
          {trend && (
            <p className={`text-xs mt-2 ${trendUp ? "text-green-400" : "text-red-400"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        <span className="text-2xl md:text-3xl">{icon}</span>
      </div>
    </div>
  );
}
