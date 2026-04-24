import Card from "../../components/Card";
import Button from "../../components/Button";
import { mockServices } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";

export default function ManageServices() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Manage Services</h1>
        <Button variant="primary" size="sm">➕ Add Service</Button>
      </div>
      <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-soft">
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Service</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Price</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden lg:table-cell">Duration</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockServices.map((s) => (
              <tr key={s.id} className="border-b border-soft hover:bg-soft transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <div>
                      <p className="text-text-primary text-sm font-semibold">{s.name}</p>
                      <p className="text-text-muted text-xs">{s.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{s.category}</td>
                <td className="py-3 px-4 text-brand font-semibold text-sm">{formatCurrency(s.basePrice)}</td>
                <td className="py-3 px-4 text-text-muted text-sm hidden lg:table-cell">{s.duration}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Edit</Button>
                    <Button variant="danger" size="sm">Delete</Button>
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
