export default function Button({ children, variant = "primary", size = "md", className = "", ...props }) {
  const baseStyle = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand text-[#0F172A] hover:bg-brand-dark hover:text-white shadow-sm",
    secondary: "bg-white text-text-primary border border-border-soft hover:bg-section",
    ghost: "bg-transparent text-text-primary hover:bg-section",
    danger: "bg-error text-white hover:opacity-90 shadow-sm",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base font-semibold",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
