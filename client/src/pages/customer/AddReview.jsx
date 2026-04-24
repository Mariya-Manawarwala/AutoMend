import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";

export default function AddReview() {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/history" className="text-text-muted hover:text-brand transition-colors">← Back</Link>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Leave a Review</h1>
      </div>
      <Card hover={false} className="max-w-xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-text-muted text-sm mb-2">How was your experience?</p>
          <div className="flex justify-center gap-2">
            {stars.map((s) => (
              <span key={s} className="text-3xl cursor-pointer hover:scale-110 transition-transform text-brand">★</span>
            ))}
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Your Review</label>
            <textarea className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors h-32 resize-none" placeholder="Tell us about your experience..." />
          </div>
          <div className="flex gap-3">
            <Button variant="primary" className="flex-1">Submit Review</Button>
            <Link to="/history" className="flex-1">
              <Button variant="secondary" className="w-full">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
