import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { useCategories } from "@/hooks/useApi";

const PLACEHOLDER = "/assets/images/category/fashion-2/cate-1.jpg";

function catImgSrc(img?: string): string {
  if (!img) return PLACEHOLDER;
  if (img.startsWith("http")) {
    const url = new URL(img);
    return url.pathname;
  }
  const encoded = img.split("/").map(encodeURIComponent).join("/");
  return `/ecomm/${encoded}`;
}

/* ── Skeleton card matching the 3:4 category card ── */
function CategorySkeleton() {
  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Image placeholder — same 3:4 ratio as real card */}
      <div style={{
        aspectRatio: "3/4",
        background: "#eeeeee",
        borderRadius: 4,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
          animation: "sk-sweep 1.4s ease-in-out infinite",
        }} />
      </div>
      {/* Name placeholder */}
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{ height: 14, width: "65%", background: "#eeeeee", borderRadius: 4, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            animation: "sk-sweep 1.4s ease-in-out infinite",
          }} />
        </div>
        <div style={{ height: 12, width: "40%", background: "#eeeeee", borderRadius: 4, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
            animation: "sk-sweep 1.4s ease-in-out infinite",
          }} />
        </div>
      </div>
      <style>{`@keyframes sk-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}

function Category() {
  const { categories: apiCats, loading } = useCategories();

  /* Show skeleton row while API is in flight */
  if (loading) {
    return (
      <section className="flat-spacing">
        <div className="container-layout-right">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 30 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const items = apiCats.map((c) => ({
    name: c.name,
    img: c.image_url ? catImgSrc(c.image_url) : catImgSrc(c.image),
    quantity: c.product_count != null ? `${c.product_count} items` : undefined,
    slug: c.slug,
  }));

  if (!items.length) return null;

  return (
    <section className="flat-spacing">
      <div className="container-layout-right">
        <TfSwiper
          preview={4.3605}
          tablet={3.3}
          mobileSm={2.3}
          mobile={1.3}
          spaceLg={30}
          spaceMd={20}
          space={10}
          pagination={1}
          paginationSm={2}
          paginationMd={3}
          paginationLg={4}
          paginationDisabled={true}
        >
          {items.map((item, idx) => (
            <div key={idx} className="category-v06 style-2 hover-img4 wow fadeInUp">
              <Link
                to={`/shop-default?category_slug=${item.slug ?? ""}`}
                className="cate-image img-style4"
                style={{ display: "block", aspectRatio: "3/4", overflow: "hidden" }}
              >
                <img
                  src={item.img ?? PLACEHOLDER}
                  alt={item.name}
                  width={400}
                  height={533}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
                />
              </Link>
              <Link to={`/shop-default?category_slug=${item.slug ?? ""}`} className="cate-content">
                <h6 className="cate_name">{item.name}</h6>
                {item.quantity != null && (
                  <p className="cate_quantity">{item.quantity}</p>
                )}
              </Link>
            </div>
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default Category;
