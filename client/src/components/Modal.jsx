export default function Modal({ isOpen, onClose, title, children, size = "md" }) {
  if (!isOpen) return null;
  const sizes = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className={`bg-[#4A4238] border border-[#D4AF37]/20 rounded-xl shadow-2xl ${sizes[size]} w-full animate-slide-up`}>
        <div className="flex justify-between items-center p-6 border-b border-[#D4AF37]/20">
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-[#A89968] hover:text-[#D4AF37] transition-colors text-xl cursor-pointer">✕</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
