import { useState } from "react";
import { mockFleet } from "../../utils/mockData";
import Modal from "../../components/Modal";
import Card from "../../components/Card";
import Button from "../../components/Button";

const categories = ["All", ...new Set(mockFleet.map((v) => v.category))];

export default function FleetPage() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);
  const filtered = active === "All" ? mockFleet : mockFleet.filter((v) => v.category === active);

  return (
    <div>
      <section className="bg-brand-dark py-16 md:py-20 border-b border-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Our <span className="text-brand">Fleet</span></h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">Explore our collection of premium vehicles. Each one maintained to the highest standards.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${
                  active === c
                    ? "bg-brand text-[#0E0E0E]"
                    : "bg-secondary text-text-secondary border border-soft hover:border-brand/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((v) => (
              <Card key={v.id} className="p-0 overflow-hidden group flex flex-col">
                <div className="overflow-hidden">
                  <img src={v.image} alt={v.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-text-primary font-bold text-lg">{v.name}</h3>
                    <span className="bg-brand text-[#0E0E0E] text-xs font-bold px-2 py-1 rounded">{v.category}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 text-text-muted text-sm mb-6 flex-1">
                    <span>🪑 {v.seats} seats</span>
                    <span>⚡ {v.transmission}</span>
                    <span>⛽ {v.fuel}</span>
                    <span>🚗 {v.type}</span>
                  </div>
                  <Button variant="secondary" onClick={() => setSelected(v)} className="w-full">
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name || ""}>
        {selected && (
          <div>
            <img src={selected.image} alt={selected.name} className="w-full h-64 object-cover rounded-lg mb-4" />
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Type", selected.type],
                ["Category", selected.category],
                ["Seats", selected.seats],
                ["Transmission", selected.transmission],
                ["Fuel", selected.fuel],
              ].map(([label, val]) => (
                <div key={label} className="bg-soft border border-soft rounded-lg p-3">
                  <p className="text-text-muted text-xs">{label}</p>
                  <p className="text-text-primary font-semibold">{val}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button className="w-full">Book This Vehicle</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
