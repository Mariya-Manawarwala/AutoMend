import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-brand border-t border-brand-light">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-white">Auto</span>
              <span className="text-brand-deep">Mend</span>
            </h2>
            <p className="text-[#1F3F7A] font-medium text-sm leading-relaxed mb-4">
              Auto Painting & Collision Repair Shop. We help you put your car and your life back into the fast lane!
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-[#1F3F7A]/10 text-brand-deep hover:bg-white hover:text-brand flex items-center justify-center transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1F3F7A]/10 text-brand-deep hover:bg-white hover:text-brand flex items-center justify-center transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#1F3F7A]/10 text-brand-deep hover:bg-white hover:text-brand flex items-center justify-center transition-colors">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>

          {/* Our Services */}
          <div>
            <h3 className="text-brand-deep font-bold mb-4 text-sm uppercase tracking-wider">Our Services</h3>
            <ul className="space-y-2">
              {["Engine Diagnostics", "Lube, Oil and Filters", "Air Conditioning", "Brake Repair", "Tire & Wheel", "Performance Upgrades"].map((item) => (
                <li key={item}>
                  <Link to="/services" className="text-[#1F3F7A] font-medium hover:text-white text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Latest News */}
          <div>
            <h3 className="text-brand-deep font-bold mb-4 text-sm uppercase tracking-wider">Latest News</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/blog" className="group">
                  <h4 className="text-[#1F3F7A] text-sm font-bold group-hover:text-white transition">20th car looking much smarter</h4>
                  <p className="text-white text-xs mt-1 font-medium">July 20, 2026</p>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="group">
                  <h4 className="text-[#1F3F7A] text-sm font-bold group-hover:text-white transition">Get your vehicle ready for winter</h4>
                  <p className="text-white text-xs mt-1 font-medium">October 15, 2026</p>
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Hours */}
          <div>
            <h3 className="text-brand-deep font-bold mb-4 text-sm uppercase tracking-wider">Service Hours</h3>
            <ul className="space-y-3 text-sm text-[#1F3F7A] font-medium">
              <li className="flex justify-between border-b border-brand-light pb-2">
                <span>Monday</span>
                <span>7:00 - 18:00</span>
              </li>
              <li className="flex justify-between border-b border-brand-light pb-2">
                <span>Tuesday</span>
                <span>7:00 - 18:00</span>
              </li>
              <li className="flex justify-between border-b border-brand-light pb-2">
                <span>Wednesday</span>
                <span>7:00 - 18:00</span>
              </li>
              <li className="flex justify-between border-b border-brand-light pb-2">
                <span>Saturday</span>
                <span>7:00 - 15:00</span>
              </li>
              <li className="flex justify-between pt-1">
                <span>Sunday</span>
                <span className="text-white font-bold bg-brand-deep/20 px-2 py-0.5 rounded">Closed</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-light mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-brand-deep font-medium text-xs">Copyright 2026. All Rights Reserved AutoMend</p>
          <div className="flex gap-6">
            {["Home", "Privacy", "Privacy Policy", "Contact"].map((link) => (
              <a key={link} href="#" className="text-[#1F3F7A] font-medium hover:text-white text-xs transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
