import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Fleet", path: "/fleet" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="fixed w-full top-0 z-50 transition-all duration-300">
      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-sm">
                A
              </div>
              <span className="text-2xl font-bold text-brand-deep tracking-tight">AutoMend<span className="text-brand">.</span></span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-bold transition-all uppercase tracking-wide rounded-full ${
                    location.pathname === link.path ? "text-brand-deep bg-soft" : "text-text-secondary hover:text-brand-deep hover:bg-soft"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA & Mobile Toggle */}
            <div className="flex items-center gap-4">
              <Link to="/login" className="hidden lg:block text-text-secondary hover:text-brand-deep font-bold text-sm transition-colors uppercase tracking-wide">
                Log In
              </Link>
              <Link to="/register" className="hidden md:block">
                <Button variant="primary" className="bg-brand text-[#1F3F7A] font-bold hover:bg-brand-dark hover:text-white uppercase tracking-wide text-xs">
                  Get Appointment
                </Button>
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-text-primary hover:text-brand cursor-pointer"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-border-soft absolute w-full shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {links.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wide ${
                    location.pathname === link.path
                      ? "bg-soft text-brand-deep"
                      : "text-text-secondary hover:bg-soft hover:text-brand-deep"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border-soft space-y-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-3 text-text-secondary hover:text-brand-deep hover:bg-soft rounded-lg font-bold text-sm uppercase tracking-wide">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button variant="primary" className="w-full bg-brand text-[#1F3F7A] font-bold hover:bg-brand-dark hover:text-white uppercase tracking-wide text-xs py-3">
                    Get Appointment
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
