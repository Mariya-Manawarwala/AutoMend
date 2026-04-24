import { Link, useLocation } from "react-router-dom";
import { CUSTOMER_MENU, MECHANIC_MENU, ADMIN_MENU } from "../utils/constants";

export default function Sidebar({ currentRole, isOpen, onClose }) {
  const location = useLocation();
  const menus = { customer: CUSTOMER_MENU, mechanic: MECHANIC_MENU, admin: ADMIN_MENU };
  const items = menus[currentRole] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={onClose} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-brand z-40 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col rounded-tr-[40px] md:rounded-none`}>
        {/* Header */}
        <div className="p-6 flex items-center justify-between">
          <span className="text-2xl font-bold text-white tracking-tight">
            AutoMend
          </span>
          <button onClick={onClose} className="md:hidden text-white/80 hover:text-white cursor-pointer text-xl">✕</button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-y-auto pl-4">
          {/* Direct Home Link */}
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-5 py-3 mb-4 rounded-l-full text-sm text-[#1F3F7A] font-semibold hover:bg-brand-dark hover:text-white transition-colors"
          >
            <span className="text-lg">🏠</span>
            <span>Home Page</span>
          </Link>

          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-5 py-3.5 mb-2 rounded-l-full text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-soft text-brand-deep relative shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)]"
                    : "text-[#1F3F7A] hover:bg-brand-dark hover:text-white"
                }`}
              >
                <span className={`text-lg ${isActive ? "text-brand-dark" : ""}`}>{item.icon}</span>
                <span>{item.label}</span>
                
                {/* Corner cutouts for active state effect (optional but adds polish) */}
                {isActive && (
                  <>
                    <div className="absolute top-[-20px] right-0 w-[20px] h-[20px] bg-soft" style={{ clipPath: "polygon(100% 0, 100% 100%, 0 100%, 100% 100%, 100% 0)" }}></div>
                    <div className="absolute bottom-[-20px] right-0 w-[20px] h-[20px] bg-soft" style={{ clipPath: "polygon(100% 100%, 100% 0, 0 0, 100% 0, 100% 100%)" }}></div>
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 pl-4 mb-4">
          <Link to="/login" onClick={onClose} className="flex items-center gap-3 px-5 py-3 rounded-l-full text-sm font-semibold text-[#1F3F7A] hover:bg-error hover:text-white transition-colors">
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
