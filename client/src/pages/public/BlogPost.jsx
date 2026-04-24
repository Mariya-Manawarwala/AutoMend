import { useParams, Link } from "react-router-dom";
import { mockBlogPosts } from "../../utils/mockData";
import Card from "../../components/Card";

export default function BlogPost() {
  const { id } = useParams();
  const post = mockBlogPosts.find((p) => p.id === Number(id));
  const related = mockBlogPosts.filter((p) => p.id !== Number(id)).slice(0, 2);

  if (!post) {
    return (
      <div className="py-20 text-center bg-primary min-h-[50vh]">
        <h1 className="text-3xl font-bold text-text-primary mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-brand font-semibold hover:text-brand-hover transition-colors">← Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <section className="bg-secondary py-12 border-b border-soft">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <Link to="/blog" className="text-brand text-sm font-semibold hover:text-brand-hover transition-colors">← Back to Blog</Link>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-sm text-text-muted mb-4">
            <span className="bg-brand/15 text-brand px-3 py-1 rounded font-semibold">{post.category}</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime} read</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">{post.title}</h1>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-[#0E0E0E] font-bold">{post.author[0]}</div>
            <div>
              <p className="text-text-primary font-semibold text-sm">{post.author}</p>
              <p className="text-text-muted text-xs">AutoMend Team</p>
            </div>
          </div>

          <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8 shadow-lg" />

          <div className="prose prose-invert max-w-none">
            <p className="text-text-secondary leading-relaxed text-lg mb-6">{post.excerpt}</p>
            <p className="text-text-secondary leading-relaxed mb-6">{post.content}</p>
            <p className="text-text-secondary leading-relaxed mb-6">Regular vehicle maintenance is not just about keeping your car running — it's about safety, efficiency, and protecting your investment. At AutoMend, we believe every vehicle deserves premium care, regardless of its make or model.</p>
            <p className="text-text-secondary leading-relaxed">Our team of certified mechanics uses the latest diagnostic tools and genuine parts to ensure your vehicle performs at its best. Book your next service with us and experience the AutoMend difference.</p>
          </div>

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-12 pt-8 border-t border-soft">
              <h3 className="text-xl font-bold text-text-primary mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {related.map((r) => (
                  <Link key={r.id} to={`/blog/${r.id}`}>
                    <Card className="p-0 overflow-hidden group flex h-full">
                      <img src={r.image} alt={r.title} className="w-32 h-full object-cover" />
                      <div className="p-4 flex-1">
                        <p className="text-text-muted text-xs mb-1">{r.category} • {r.readTime}</p>
                        <h4 className="text-text-primary font-semibold text-sm group-hover:text-brand transition-colors">{r.title}</h4>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
