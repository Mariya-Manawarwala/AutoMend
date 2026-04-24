import Card from "../../components/Card";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import { mockCoupons } from "../../utils/mockData";
import { formatDate } from "../../utils/helpers";

export default function ManageCoupons() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Manage Coupons</h1>
        <Button variant="primary" size="sm">➕ Create Coupon</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {mockCoupons.map((c) => (
          <Card key={c.id} className={!c.isActive ? "opacity-60" : ""}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-brand font-bold text-lg tracking-wider">{c.code}</h3>
                <p className="text-text-muted text-xs">{c.description}</p>
              </div>
              <StatusBadge status={c.isActive ? "active" : "inactive"} />
            </div>
            <div className="bg-soft rounded-lg p-3 mb-3">
              <span className="text-2xl font-bold text-brand">
                {c.type === "percentage" ? `${c.discount}%` : `₹${c.discount}`}
              </span>
              <span className="text-text-muted text-sm ml-1">OFF</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
              <div>Valid: {formatDate(c.validFrom)} - {formatDate(c.validUntil)}</div>
              <div>Min Order: ₹{c.minOrderValue}</div>
              <div>Uses: {c.currentUses}/{c.maxUses}</div>
              <div>
                <div className="w-full bg-soft rounded-full h-1.5 mt-1">
                  <div className="bg-brand h-1.5 rounded-full" style={{ width: `${(c.currentUses / c.maxUses) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-soft">
              <Button variant="secondary" size="sm" className="flex-1">Edit</Button>
              <Button variant={c.isActive ? "danger" : "success"} size="sm" className="flex-1">
                {c.isActive ? "Deactivate" : "Activate"}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
