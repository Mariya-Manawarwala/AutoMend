import { useState } from "react";
import { Link } from "react-router-dom";
import { mockBlogPosts } from "../../utils/mockData";
import Card from "../../components/Card";

const categories = ["All", ...new Set(mockBlogPosts.map((p) => p.category))];

export default function BlogPage() {
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? mockBlogPosts : mockBlogPosts.filter((p) => p.category === active);

  return (
    <div>
      <section className="bg-brand-dark py-16 md:py-20 border-b border-soft">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-text-primary mb-4">Our <span className="text-brand">Blog</span></h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-lg">Tips, guides, and news from the world of auto care.</p>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((c) => (
              <button key={c} onClick={() => setActive(c)} className={`px-5 py-2 rounded-full text-sm font-semibold transition-all cursor-pointer ${active === c ? "bg-brand text-[#0E0E0E]" : "bg-secondary text-text-secondary border border-soft hover:border-brand/50"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <Link key={post.id} to={`/blog/${post.id}`}>
                <Card className="p-0 overflow-hidden group h-full flex flex-col">
                  <div className="overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-3">
                      <span className="bg-brand/15 text-brand px-2 py-0.5 rounded font-semibold">{post.category}</span>
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime} read</span>
                    </div>
                    <h3 className="text-text-primary font-bold text-lg mb-2 group-hover:text-brand transition-colors">{post.title}</h3>
                    <p className="text-text-secondary text-sm mb-4 flex-1">{post.excerpt}</p>
                    <span className="text-brand text-sm font-semibold">By {post.author}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
