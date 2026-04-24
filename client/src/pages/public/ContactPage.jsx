import { useState } from "react";
import { mockFAQs } from "../../utils/mockData";
import Card from "../../components/Card";
import Button from "../../components/Button";
import Input from "../../components/Input";

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div>
      <section className="bg-brand-dark py-16 md:py-20 border-b border-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Get In <span className="text-brand">Touch</span></h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">Have a question or need assistance? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-2xl font-bold text-text-primary mb-6">Send us a Message</h2>
                <form className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Full Name" placeholder="Your name" />
                    <Input label="Email" type="email" placeholder="your@email.com" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input label="Phone" type="tel" placeholder="+91 9876543210" />
                    <div className="space-y-1.5 w-full">
                      <label className="block text-text-secondary text-sm font-semibold">Service Type</label>
                      <select className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary focus:outline-none focus:border-brand">
                        <option>General Inquiry</option>
                        <option>Book a Service</option>
                        <option>Request a Quote</option>
                        <option>Feedback</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5 w-full">
                    <label className="block text-text-secondary text-sm font-semibold">Message</label>
                    <textarea rows="5" placeholder="How can we help you?" className="w-full bg-soft border border-soft rounded-lg p-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-brand resize-none transition-colors" />
                  </div>
                  <Button type="submit" size="lg">Send Message →</Button>
                </form>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {[
                { icon: "📍", title: "Visit Us", lines: ["AutoMend Service Center", "MG Road, Bangalore", "Karnataka 560001"] },
                { icon: "📞", title: "Call Us", lines: ["+91 95556 66777", "+91 80 2222 3333"] },
                { icon: "✉️", title: "Email Us", lines: ["info@automend.com", "support@automend.com"] },
                { icon: "🕐", title: "Business Hours", lines: ["Mon-Fri: 8:00 AM - 7:00 PM", "Saturday: 9:00 AM - 5:00 PM", "Sunday: Closed"] },
              ].map((item, i) => (
                <Card key={i}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h3 className="text-text-primary font-bold mb-1">{item.title}</h3>
                      {item.lines.map((line, j) => (
                        <p key={j} className="text-text-muted text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-secondary border-t border-soft">
        <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary text-center mb-10">Frequently Asked <span className="text-brand">Questions</span></h2>
          <div className="space-y-3">
            {mockFAQs.map((faq, i) => (
              <div key={i} className="bg-primary border border-soft rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left cursor-pointer hover:bg-soft transition-colors"
                >
                  <span className="text-text-primary font-semibold text-sm md:text-base">{faq.q}</span>
                  <span className="text-brand text-xl ml-4 flex-shrink-0">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 pt-2 text-text-secondary text-sm leading-relaxed animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
