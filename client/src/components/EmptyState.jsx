export default function EmptyState({ icon = "📭", title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <span className="text-5xl mb-4">{icon}</span>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-[#A89968] max-w-md mb-6">{message}</p>
      {action}
    </div>
  );
}
