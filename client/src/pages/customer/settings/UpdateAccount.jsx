import { useState } from "react";
import Card from "../../../components/Card";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { Edit2 } from "lucide-react";

export default function UpdateAccount() {
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  return (
    <Card hover={false} className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-primary">Update Account Details</h2>
        {!isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit2 size={16} /> Edit
          </Button>
        )}
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="First Name" defaultValue="John" readOnly={!isEditing} className={!isEditing ? "bg-primary opacity-70 cursor-not-allowed" : ""} />
          <Input label="Last Name" defaultValue="Doe" readOnly={!isEditing} className={!isEditing ? "bg-primary opacity-70 cursor-not-allowed" : ""} />
        </div>
        <Input label="Email Address" type="email" defaultValue="john@example.com" readOnly={!isEditing} className={!isEditing ? "bg-primary opacity-70 cursor-not-allowed" : ""} />
        <Input label="Phone Number" type="tel" defaultValue="+1 234 567 890" readOnly={!isEditing} className={!isEditing ? "bg-primary opacity-70 cursor-not-allowed" : ""} />
        <Input label="Residential Address" defaultValue="123 Mechanic Lane, Auto City" readOnly={!isEditing} className={!isEditing ? "bg-primary opacity-70 cursor-not-allowed" : ""} />
        
        {isEditing && (
          <div className="pt-4 border-t border-border-soft flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Changes</Button>
          </div>
        )}
      </form>
    </Card>
  );
}
