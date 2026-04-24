import Card from "../../../components/Card";
import Button from "../../../components/Button";

export default function DeleteAccount() {
  return (
    <Card hover={false} className="max-w-2xl mx-auto border-error/50 bg-error/5">
      <div className="flex flex-col items-center text-center p-4">
        <div className="w-16 h-16 bg-error/20 text-error rounded-full flex items-center justify-center text-3xl mb-4">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-error mb-2">Delete Account</h2>
        <p className="text-text-primary font-medium mb-4">
          Are you sure you want to permanently delete your account?
        </p>
        <p className="text-text-muted text-sm mb-8 max-w-md">
          This action cannot be undone. All your service history, vehicles, and data will be permanently removed from AutoMend.
        </p>
        
        <div className="flex gap-4 w-full justify-center">
          <Button variant="secondary" onClick={() => window.history.back()}>Keep Account</Button>
          <Button variant="danger">Yes, Delete Account</Button>
        </div>
      </div>
    </Card>
  );
}
