import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { mockVehicles, mockServices } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";

export default function CreateRequest() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Create Repair Request</h1>
        <p className="text-text-muted mt-1">Fill in the details below to submit a new repair request.</p>
      </div>

      <Card hover={false} className="max-w-2xl mx-auto">
        <form className="space-y-5">
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Select Vehicle *</label>
            <select className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors">
              <option value="">Choose a vehicle</option>
              {mockVehicles.map((v) => (
                <option key={v.id} value={v.id}>{v.make} {v.model} — {v.licensePlate}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Service Type *</label>
            <select className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors">
              <option value="">Choose a service</option>
              {mockServices.map((s) => (
                <option key={s.id} value={s.id}>{s.icon} {s.name} — {formatCurrency(s.basePrice)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Priority</label>
            <select className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors">
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Description *</label>
            <textarea className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors h-32 resize-none" placeholder="Describe the issue in detail..." />
          </div>
          <div>
            <label className="block text-text-primary mb-1.5 text-sm font-semibold">Coupon Code (Optional)</label>
            <input type="text" placeholder="Enter coupon code" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button variant="primary" size="lg" className="flex-1">Submit Request</Button>
            <Link to="/requests" className="flex-1">
              <Button variant="secondary" size="lg" className="w-full">Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
