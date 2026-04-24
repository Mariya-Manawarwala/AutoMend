import Card from "../../components/Card";
import Button from "../../components/Button";
import StatusBadge from "../../components/StatusBadge";
import SearchBar from "../../components/SearchBar";
import { mockAllUsers } from "../../utils/mockData";
import { formatDate } from "../../utils/helpers";

export default function UserManagement() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-text-primary">User Management</h1>
      <SearchBar placeholder="Search users..." className="max-w-md" />
      <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-soft">
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Name</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Email</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Role</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Joined</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Status</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAllUsers.map((u) => (
              <tr key={u.id} className="border-b border-soft hover:bg-soft transition-colors">
                <td className="py-3 px-4 text-text-primary text-sm font-semibold">{u.name}</td>
                <td className="py-3 px-4 text-text-muted text-sm">{u.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : u.role === "mechanic" ? "bg-blue-500/20 text-blue-400" : "bg-brand/20 text-brand"}`}>{u.role}</span>
                </td>
                <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{formatDate(u.dateJoined)}</td>
                <td className="py-3 px-4"><StatusBadge status={u.status} /></td>
                <td className="py-3 px-4">
                  <div className="flex gap-1">
                    <Button variant="secondary" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">🔒</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
