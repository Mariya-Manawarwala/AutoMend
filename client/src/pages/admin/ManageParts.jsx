import Card from "../../components/Card";
import Button from "../../components/Button";
import SearchBar from "../../components/SearchBar";
import { mockParts } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";

export default function ManageParts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Parts Inventory</h1>
        <Button variant="primary" size="sm">➕ Add Part</Button>
      </div>
      <SearchBar placeholder="Search parts..." className="max-w-md" />
      <div className="bg-white border border-border-soft rounded-xl shadow-card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-soft">
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Part Name</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden md:table-cell">Category</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Stock</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Price</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm hidden lg:table-cell">Supplier</th>
              <th className="text-left py-3 px-4 text-text-primary font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockParts.map((p) => (
              <tr key={p.id} className="border-b border-soft hover:bg-soft transition-colors">
                <td className="py-3 px-4 text-text-primary text-sm">{p.name}</td>
                <td className="py-3 px-4 text-text-muted text-sm hidden md:table-cell">{p.category}</td>
                <td className="py-3 px-4">
                  <span className={`text-sm font-bold ${p.stock <= p.minStock ? "text-red-400" : "text-green-400"}`}>{p.stock}</span>
                  {p.stock <= p.minStock && <span className="text-red-400 text-xs ml-1">Low!</span>}
                </td>
                <td className="py-3 px-4 text-brand font-semibold text-sm">{formatCurrency(p.unitPrice)}</td>
                <td className="py-3 px-4 text-text-muted text-sm hidden lg:table-cell">{p.supplier}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm">Restock</Button>
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
