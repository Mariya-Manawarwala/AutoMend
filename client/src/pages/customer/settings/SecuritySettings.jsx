import Card from "../../../components/Card";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

export default function SecuritySettings() {
  return (
    <Card hover={false} className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-text-primary mb-6">Security & Password</h2>
      <form className="space-y-5">
        <Input label="Current Password" type="password" placeholder="••••••••" />
        <Input label="New Password" type="password" placeholder="••••••••" />
        <Input label="Confirm New Password" type="password" placeholder="••••••••" />
        
        <div className="pt-4 border-t border-border-soft flex justify-end gap-3">
          <Button type="button" variant="ghost">Cancel</Button>
          <Button type="submit" variant="primary">Update Password</Button>
        </div>
      </form>
    </Card>
  );
}
