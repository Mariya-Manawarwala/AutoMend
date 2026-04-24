import { useState } from "react";
import { Link } from "react-router-dom";
import { mockServices } from "../../utils/mockData";
import { formatCurrency } from "../../utils/helpers";
import Button from "../../components/Button";
import Card from "../../components/Card";

const categories = ["All", ...new Set(mockServices.map((s) => s.category))];

export default function ServicesPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? mockServices : mockServices.filter((s) => s.category === active);

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-dark py-16 md:py-20 border-b border-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Our <span className="text-brand">Services</span></h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">Comprehensive auto care solutions for every vehicle. Transparent pricing, expert mechanics.</p>
        </div>
      </section>

      {/* Filters */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((s) => (
              <Card key={s.id} className="group flex flex-col h-full">
                <span className="text-4xl mb-4">{s.icon}</span>
                <h3 className="text-text-primary font-bold text-lg mb-1 group-hover:text-brand transition-colors">{s.name}</h3>
                <span className="text-text-muted text-xs mb-3">{s.category} • {s.duration}</span>
                <p className="text-text-secondary text-sm mb-4 flex-1">{s.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-soft">
                  <span className="text-brand font-bold text-lg">{formatCurrency(s.basePrice)}</span>
                  <Link to="/register"><Button size="sm">Book Now</Button></Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-brand-dark border-t border-soft">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">Not sure which service you need?</h2>
          <p className="text-text-secondary mb-8">Our AI assistant can diagnose your vehicle's issues and recommend the right service.</p>
          <Link to="/register"><Button size="lg" className="inline-flex">Try AI Diagnostics →</Button></Link>
        </div>
      </section>
    </div>
  );
}
