export default function Card({ children, className = "", hover = true }) {
  return (
    <div
      className={`bg-white rounded-xl shadow-card border border-border-soft p-5 md:p-6 ${
        hover ? "transition-all duration-300 hover:shadow-lg" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
