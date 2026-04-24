import Card from "../../components/Card";
import Button from "../../components/Button";
import { mockUsers } from "../../utils/mockData";
import { formatDate } from "../../utils/helpers";

export default function Profile() {
  const user = mockUsers.customer;
  return (
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <Card className="flex flex-col items-center text-center">
          <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-full border-2 border-brand/50 object-cover mb-4" />
          <h2 className="text-xl font-bold text-text-primary">{user.name}</h2>
          <p className="text-text-muted text-sm">{user.email}</p>
          <span className="mt-2 bg-brand text-[#0E0E0E] px-3 py-0.5 rounded-full text-xs font-bold uppercase">{user.role}</span>
          <p className="text-text-muted text-xs mt-3">Member since {formatDate(user.dateJoined)}</p>
        </Card>

        {/* Details Form */}
        <Card hover={false} className="lg:col-span-2">
          <h3 className="text-lg font-bold text-text-primary mb-4">Personal Information</h3>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-text-primary mb-1.5 text-sm font-semibold">Full Name</label>
                <input type="text" defaultValue={user.name} className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
              </div>
              <div>
                <label className="block text-text-primary mb-1.5 text-sm font-semibold">Phone</label>
                <input type="tel" defaultValue={user.phone} className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-text-primary mb-1.5 text-sm font-semibold">Email</label>
              <input type="email" defaultValue={user.email} className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
            </div>
            <div>
              <label className="block text-text-primary mb-1.5 text-sm font-semibold">Address</label>
              <input type="text" defaultValue={user.address} className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand transition-colors" />
            </div>
            <div className="flex justify-end pt-2">
              <Button variant="primary">Save Changes</Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
