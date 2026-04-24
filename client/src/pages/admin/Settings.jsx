import Card from "../../components/Card";
import Button from "../../components/Button";
import Checkbox from "../../components/Checkbox";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Admin Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Garage Information */}
        <Card hover={false}>
          <h2 className="text-lg font-bold text-text-primary mb-4">Garage Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-text-primary mb-1.5 text-sm font-semibold">Garage Name</label>
              <input type="text" defaultValue="AutoMend Service Center" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
            </div>
            <div>
              <label className="block text-text-primary mb-1.5 text-sm font-semibold">Address</label>
              <input type="text" defaultValue="MG Road, Bangalore, Karnataka" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-text-primary mb-1.5 text-sm font-semibold">Phone</label>
                <input type="tel" defaultValue="9555666777" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
              </div>
              <div>
                <label className="block text-text-primary mb-1.5 text-sm font-semibold">Email</label>
                <input type="email" defaultValue="info@automend.com" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
              </div>
            </div>
          </div>
        </Card>

        {/* Business Hours */}
        <Card hover={false}>
          <h2 className="text-lg font-bold text-text-primary mb-4">Business Hours</h2>
          <div className="space-y-3">
            {[
              { day: "Monday - Friday", hours: "8:00 AM - 7:00 PM" },
              { day: "Saturday", hours: "9:00 AM - 5:00 PM" },
              { day: "Sunday", hours: "Closed" },
            ].map((d) => (
              <div key={d.day} className="flex items-center justify-between p-3 bg-soft rounded-lg">
                <span className="text-text-primary text-sm font-semibold">{d.day}</span>
                <span className="text-text-muted text-sm">{d.hours}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* System Preferences */}
        <Card hover={false}>
          <h2 className="text-lg font-bold text-text-primary mb-4">System Preferences</h2>
          <div className="space-y-4">
            <Checkbox label="Auto-assign mechanics to new requests" defaultChecked />
            <Checkbox label="Send email receipts after payment" defaultChecked />
            <Checkbox label="Allow customer self-registration" defaultChecked />
            <Checkbox label="Enable AI chatbot for customer support" defaultChecked />
            <Checkbox label="Require approval before job starts" />
            <Checkbox label="Enable inventory low-stock alerts" defaultChecked />
          </div>
        </Card>

        {/* Tax & Payment */}
        <Card hover={false}>
          <h2 className="text-lg font-bold text-text-primary mb-4">Tax & Payment</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-text-primary mb-1.5 text-sm font-semibold">GST Rate (%)</label>
              <input type="number" defaultValue="18" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
            </div>
            <div>
              <label className="block text-text-primary mb-1.5 text-sm font-semibold">GSTIN</label>
              <input type="text" defaultValue="29AAACH7409R1ZS" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
            </div>
            <div>
              <label className="block text-text-primary mb-1.5 text-sm font-semibold">Accepted Payment Methods</label>
              <div className="space-y-2 mt-2">
                <Checkbox label="UPI" defaultChecked />
                <Checkbox label="Credit/Debit Card" defaultChecked />
                <Checkbox label="Net Banking" defaultChecked />
                <Checkbox label="Cash" defaultChecked />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button variant="primary" size="lg">Save Settings</Button>
      </div>
    </div>
  );
}
