import Button from "./Button";

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", variant = "danger" }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#4A4238] border border-[#D4AF37]/20 rounded-xl shadow-2xl max-w-md w-full p-6 animate-slide-up">
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-[#A89968] mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant={variant} size="sm" onClick={onConfirm}>{confirmText}</Button>
        </div>
      </div>
    </div>
  );
}
