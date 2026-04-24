import Card from "../../components/Card";
import StarRating from "../../components/StarRating";
import { mockReviews } from "../../utils/mockData";
import { formatDate } from "../../utils/helpers";

export default function ReviewsList() {
  const avgRating = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Reviews</h1>
        <div className="flex items-center gap-2 bg-secondary border border-soft rounded-lg px-4 py-2">
          <StarRating rating={Math.round(Number(avgRating))} size="sm" />
          <span className="text-brand font-bold">{avgRating}</span>
          <span className="text-text-muted text-sm">({mockReviews.length} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockReviews.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
              <div>
                <h3 className="text-text-primary font-semibold">{r.customerName}</h3>
                <p className="text-text-muted text-xs mt-0.5">{r.serviceName} • Mechanic: {r.mechanicName}</p>
              </div>
              <div className="flex items-center gap-2">
                <StarRating rating={r.rating} size="sm" />
                <span className="text-brand text-sm font-semibold">{r.rating}/5</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm">{r.comment}</p>
            <p className="text-text-muted text-xs mt-3">{formatDate(r.date)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
