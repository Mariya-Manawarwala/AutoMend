import { mockTeamMembers, mockSiteStats } from "../../utils/mockData";
import Card from "../../components/Card";

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-dark py-16 md:py-20 border-b border-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">About <span className="text-brand">AutoMend</span></h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">Where traditional craftsmanship meets AI-powered innovation.</p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 md:py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">Our <span className="text-brand">Journey</span></h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>Founded in 2006 in Bangalore, AutoMend started as a single-bay garage with a mission to bring transparency and professionalism to the Indian auto service industry.</p>
                <p>Over the years, we've grown into a network of premium service centers, serving over 80,000 customers across major Indian cities. Our AI-powered diagnostics system, launched in 2024, was a game-changer — reducing diagnosis time by 60% and improving first-fix rates to 95%.</p>
                <p>Today, we're proud to be one of India's most trusted garage management brands, blending human expertise with cutting-edge technology.</p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=600&h=500&fit=crop"
                alt="AutoMend garage"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-brand-dark border-y border-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {mockSiteStats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-brand mb-1">{s.stat}</p>
                <p className="text-text-secondary text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">Meet Our <span className="text-brand">Team</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockTeamMembers.map((m) => (
              <Card key={m.id} className="p-0 overflow-hidden group text-center">
                <div className="overflow-hidden">
                  <img src={m.avatar} alt={m.name} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-text-primary font-bold">{m.name}</h3>
                  <p className="text-brand text-sm font-semibold mb-2">{m.role}</p>
                  <p className="text-text-muted text-xs leading-relaxed">{m.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
