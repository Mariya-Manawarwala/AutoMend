import Card from "../../../components/Card";
import Checkbox from "../../../components/Checkbox";
import Button from "../../../components/Button";

export default function NotificationPreferences() {
  return (
    <Card hover={false} className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-text-primary mb-6">Notification Preferences</h2>
      <form className="space-y-6">
        <div className="space-y-4">
          <Checkbox label="Email notifications for request updates" defaultChecked />
          <Checkbox label="SMS alerts for urgent repairs" defaultChecked />
          <Checkbox label="Push notifications for payment confirmations" defaultChecked />
          <Checkbox label="Promotional offers and discounts" />
          <Checkbox label="Service reminders" defaultChecked />
          <Checkbox label="Weekly summary report" />
        </div>
        
        <div className="pt-4 border-t border-border-soft flex justify-end gap-3">
          <Button type="button" variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">Save Preferences</Button>
        </div>
      </form>
    </Card>
  );
}
