export default function StarRating({ rating = 0, maxStars = 5, size = "md" }) {
  const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };
  return (
    <div className={`flex gap-0.5 ${sizes[size]}`}>
      {Array.from({ length: maxStars }, (_, i) => (
        <span key={i} className={i < rating ? "text-amber-400" : "text-gray-600"}>★</span>
      ))}
    </div>
  );
}
