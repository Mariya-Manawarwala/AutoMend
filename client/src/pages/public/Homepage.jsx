import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Input from "../../components/Input";
import { mockServices } from "../../utils/mockData";
import { Wrench, CircleDollarSign, Star, Calendar, Car, ShieldCheck, Quote } from "lucide-react";

export default function Homepage() {
  const topServices = mockServices.slice(0, 3);

  return (
    <div className="bg-primary">
      {/* 1. Hero Section - Pastel Blue Background with Dark Text */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-brand">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1613214149922-f1809c99b414?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
            alt="Mechanic working on car" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-brand-deep uppercase tracking-wider font-bold text-sm mb-2 block">We Are Professionals</span>
            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
              QUALITY <span className="text-brand-deep">AUTO REPAIR</span>
            </h1>
            <p className="text-lg text-text-secondary mb-8 max-w-lg leading-relaxed font-medium">
              Auto Painting & Collision Repair Shop. We help you put your car and your life back into the fast lane!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-brand-deep border border-brand-deep hover:bg-soft uppercase tracking-wide text-sm shadow-md">Get Appointment</Button>
              </Link>
            </div>
          </div>

          {/* Floating Appointment Box */}
          <div className="hidden md:block">
            <Card className="bg-white border-2 border-brand-light text-text-primary p-8 shadow-xl relative translate-y-16 z-20 rounded-2xl">
              <h3 className="text-xl font-bold mb-6 text-center uppercase tracking-wider text-brand-deep">Get 30% Discount</h3>
              <form className="space-y-4">
                <input type="text" placeholder="Name" className="w-full bg-soft border border-brand-light rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors" />
                <input type="email" placeholder="Email" className="w-full bg-soft border border-brand-light rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors" />
                <input type="text" placeholder="Service" className="w-full bg-soft border border-brand-light rounded-lg px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand transition-colors" />
                <Button className="w-full bg-brand-deep text-white hover:bg-[#152e5a] uppercase tracking-wide text-sm py-3 mt-2 shadow-md">Get Appointment</Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. Why Choose Us */}
      <section className="py-24 bg-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary uppercase">Why <span className="text-brand-deep">Choose Us</span></h2>
            <div className="w-16 h-1.5 bg-brand mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand-deep shrink-0 shadow-sm">
                <Wrench size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Expert Mechanics</h3>
                <p className="text-text-secondary text-sm leading-relaxed">Our certified mechanics have years of experience dealing with all types of vehicle models and issues.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand-deep shrink-0 shadow-sm">
                <CircleDollarSign size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Reasonable Price</h3>
                <p className="text-text-secondary text-sm leading-relaxed">We provide transparent pricing with no hidden fees. High-quality service that doesn't break the bank.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand-deep shrink-0 shadow-sm">
                <Star size={32} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-2">Trusted by 5000+ Clients</h3>
                <p className="text-text-secondary text-sm leading-relaxed">Our reputation is built on trust, reliability, and ensuring every customer leaves satisfied.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Automend */}
      <section className="bg-section py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Get Upto 30% Rewards</h2>
            <p className="text-text-secondary mb-8 leading-relaxed font-medium">
              Auto Painting & Collision Repair Shop. We help you put your car and your life back into the fast lane!
            </p>
            <Button className="bg-brand text-text-primary border-none hover:bg-brand-light uppercase tracking-wide text-sm px-8 shadow-md font-bold">Learn More</Button>
          </div>
          <div className="bg-white p-10 rounded-2xl relative z-10 shadow-card border border-border-soft">
            <h2 className="text-2xl font-bold mb-4 text-text-primary">About <span className="text-brand-deep">AutoMend</span></h2>
            <p className="text-text-secondary mb-6 text-sm leading-relaxed">
              We are a full-service auto repair center providing comprehensive maintenance and repair solutions.
            </p>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-sm font-medium text-text-primary"><span className="text-brand w-5 h-5 flex items-center justify-center bg-brand-light/30 rounded-full"><ShieldCheck size={14} /></span> We provide best auto repair services</li>
              <li className="flex items-center gap-3 text-sm font-medium text-text-primary"><span className="text-brand w-5 h-5 flex items-center justify-center bg-brand-light/30 rounded-full"><ShieldCheck size={14} /></span> We fix any make and model</li>
              <li className="flex items-center gap-3 text-sm font-medium text-text-primary"><span className="text-brand w-5 h-5 flex items-center justify-center bg-brand-light/30 rounded-full"><ShieldCheck size={14} /></span> Quality parts and trained mechanics</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Working Process */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary uppercase">Our <span className="text-brand-deep">Working Process</span></h2>
            <div className="w-16 h-1.5 bg-brand mx-auto mt-4 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-soft border border-border-soft rounded-2xl p-8 text-center relative shadow-sm">
              <div className="text-6xl font-black text-brand-light/30 absolute top-4 right-6">1</div>
              <div className="mb-4 bg-white text-brand-deep w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm">
                <Calendar size={28} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Request Quote</h3>
              <p className="text-sm text-text-secondary">Contact us online and get a custom quote.</p>
            </div>
            <div className="bg-brand border border-brand-light rounded-2xl p-8 text-center relative shadow-md scale-105 z-10">
              <div className="text-6xl font-black text-white/30 absolute top-4 right-6">2</div>
              <div className="mb-4 bg-white text-brand-deep w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm">
                <Car size={28} />
              </div>
              <h3 className="text-lg font-bold text-[#1F3F7A] mb-2">Bring Your Vehicle</h3>
              <p className="text-sm text-[#1F3F7A]/80 font-medium">Drop off your car at our service center.</p>
            </div>
            <div className="bg-brand-light border border-brand/50 rounded-2xl p-8 text-center relative shadow-sm">
              <div className="text-6xl font-black text-brand-deep/10 absolute top-4 right-6">3</div>
              <div className="mb-4 bg-white text-brand-deep w-16 h-16 mx-auto rounded-full flex items-center justify-center shadow-sm">
                <Wrench size={28} />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">Get It Repaired</h3>
              <p className="text-sm text-text-secondary">We fix it fast and get you back on the road.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Services - Cleaned up heading to prevent overlap */}
      <section className="py-24 bg-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-text-primary uppercase text-center md:text-left">Services <span className="text-brand-deep">We Provide</span></h2>
              <div className="w-16 h-1.5 bg-brand mx-auto md:mx-0 mt-4 rounded-full"></div>
            </div>
            <Link to="/services" className="text-brand-deep font-bold hover:text-brand px-6 py-2 bg-white rounded-full shadow-sm border border-border-soft">View All Services →</Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topServices.map((service, idx) => (
              <Card key={idx} className="p-0 overflow-hidden group border-border-soft shadow-card hover:shadow-xl hover:-translate-y-1 transition-all bg-white">
                <div className="h-48 overflow-hidden relative bg-section flex items-center justify-center">
                  {/* Replaced broken images with huge emojis for cleaner pastel aesthetic if images fail */}
                  <div className="text-7xl group-hover:scale-110 transition-transform duration-500">{service.icon}</div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-white text-brand flex items-center justify-center rounded-full shadow-md font-bold">
                    🔧
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-primary mb-3">{service.name}</h3>
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-2">{service.description}</p>
                  <Link to="/services" className="text-brand-deep font-bold text-sm hover:underline">Read more →</Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Form & Testimonials split */}
      <section className="py-24 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid lg:grid-cols-2 gap-16">
          {/* Appointment Form */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary uppercase mb-8">Book <span className="text-brand-deep">An Appointment</span></h2>
            <Card className="p-8 bg-white border-border-soft shadow-card">
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Name" className="bg-soft border-transparent" />
                  <Input placeholder="Phone" className="bg-soft border-transparent" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="email" placeholder="Email" className="bg-soft border-transparent" />
                  <Input type="date" className="bg-soft border-transparent text-text-secondary" />
                </div>
                <select className="w-full bg-soft border border-transparent rounded-lg px-4 py-3 text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand/50 font-medium">
                  <option>Select Service</option>
                  <option>General Maintenance</option>
                  <option>Engine Diagnostics</option>
                </select>
                <Button className="w-full bg-brand text-text-primary font-bold uppercase mt-4 py-4 text-lg hover:bg-brand-dark hover:text-white transition-colors">Book Appointment</Button>
              </form>
            </Card>
          </div>

          {/* Testimonials */}
          <div>
            <h2 className="text-2xl font-bold text-text-primary uppercase mb-8">Clients <span className="text-brand-deep">Love Us</span></h2>
            <Card className="p-8 bg-section border-none shadow-md relative overflow-hidden">
              <div className="absolute top-[-20px] right-4 text-9xl text-white opacity-50 font-serif">"</div>
              <div className="flex text-brand-deep mb-6 text-xl">★★★★★</div>
              <h3 className="text-xl font-bold text-text-primary mb-4 relative z-10">Great Experience!</h3>
              <p className="text-text-secondary italic mb-8 leading-relaxed relative z-10 text-lg">
                "Professional service from start to finish. They fixed my brakes in under an hour and the pricing was exactly what they quoted. Highly recommended!"
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-border-soft">👨</div>
                <div>
                  <h4 className="font-bold text-text-primary text-lg">David Brooks</h4>
                  <p className="text-sm text-brand-deep font-semibold">Local Partner</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Newsletter */}
      <section className="bg-brand-deep py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-white uppercase mb-3">Subscribe <span className="font-light">For Newsletter</span></h2>
            <p className="text-brand-light font-medium">Get the latest updates, tips, and discounts directly to your inbox.</p>
          </div>
          <div className="flex gap-2 bg-white p-2 rounded-xl shadow-lg">
            <input type="email" placeholder="Your Email Address" className="flex-1 bg-transparent border-none px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none font-medium" />
            <Button className="bg-brand text-[#1F3F7A] font-bold px-8 py-3 rounded-lg hover:bg-brand-light">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
