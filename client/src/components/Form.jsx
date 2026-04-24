export default function Form({ onSubmit, children, className = "" }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };
  return (
    <form onSubmit={handleSubmit} className={`space-y-5 ${className}`}>
      {children}
    </form>
  );
}
