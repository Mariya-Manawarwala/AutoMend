import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { mockVehicles } from "../../utils/mockData";
import { formatDate } from "../../utils/helpers";
import { Plus } from "lucide-react";

export default function MyVehicles() {
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Vehicles</h1>
        <Link to="/vehicles/add">
          <Button variant="primary" size="sm" className="flex items-center gap-2">
            <Plus size={16} /> Add Vehicle
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {mockVehicles.map((v) => (
          <Card key={v.id} className="overflow-hidden p-0">
            <img src={v.image} alt={`${v.make} ${v.model}`} className="w-full h-40 object-cover" />
            <div className="p-4 md:p-5">
              <h3 className="text-lg font-bold text-text-primary">{v.make} {v.model}</h3>
              <p className="text-brand text-sm font-semibold">{v.licensePlate}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-text-muted">
                <div><span className="text-text-muted">Year:</span> {v.year}</div>
                <div><span className="text-text-muted">Color:</span> {v.color}</div>
                <div><span className="text-text-muted">Fuel:</span> {v.fuelType}</div>
                <div><span className="text-text-muted">Mileage:</span> {v.mileage.toLocaleString()} km</div>
              </div>
              <div className="mt-3 pt-3 border-t border-soft text-xs text-text-muted">
                Last Service: {formatDate(v.lastService)}
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="secondary" size="sm" className="flex-1">Edit</Button>
                <Button variant="ghost" size="sm" className="flex-1">History</Button>
              </div>
            </div>
          </Card>
        ))}

        {/* Add Vehicle Card */}
        <Link to="/vehicles/add" className="block">
          <Card className="flex flex-col items-center justify-center min-h-[280px] h-full border-dashed border-2 border-soft cursor-pointer hover:border-brand/50 group">
            <div className="w-16 h-16 bg-soft text-brand-deep rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Plus size={32} />
            </div>
            <p className="text-text-primary font-semibold">Add New Vehicle</p>
            <p className="text-text-muted text-xs mt-1">Register a vehicle to get started</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
