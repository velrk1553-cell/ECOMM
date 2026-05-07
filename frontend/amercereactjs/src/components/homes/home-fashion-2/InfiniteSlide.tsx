import { Link } from "react-router-dom";
import React from "react";
import { useCategories } from "@/hooks/useApi";

const PLACEHOLDER_IMG = "/assets/images/collection/cls-34.jpg";

function catImgSrc(img?: string): string {
  if (!img) return PLACEHOLDER_IMG;
  if (img.startsWith("http")) {
    const url = new URL(img);
    return url.pathname;
  }
  if (img.startsWith("assets/uploads/")) return `/ecomm/${img}`;
  if (img.startsWith("assets/")) return `/${img}`;
  return img;
}

const STATIC_ITEMS = [
  { name: "Modern Minimalism", img: "/assets/images/collection/cls-34.jpg", slug: "" },
  { name: "Artisan Craftsmanship", img: "/assets/images/collection/cls-35.jpg", slug: "" },
  { name: "Sustainable Luxury", img: "/assets/images/collection/cls-36.jpg", slug: "" },
  { name: "Luxe and Livable", img: "/assets/images/collection/cls-37.jpg", slug: "" },
  { name: "Confidence in Every Step", img: "/assets/images/collection/cls-38.jpg", slug: "" },
  { name: "Curated Confidence", img: "/assets/images/collection/cls-3.jpg", slug: "" },
];

function InfiniteSlide() {
  const { categories, loading } = useCategories();

  const items =
    !loading && categories.length > 0
      ? categories.map((c) => ({
          name: c.name,
          img: catImgSrc(c.image_url ?? c.image),
          slug: c.slug,
        }))
      : STATIC_ITEMS;

  // Duplicate for seamless CSS infinite scroll
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div className="bg-main-2">
      <div className="infiniteSlide-cls wow fadeInUp">
        <div className="infiniteslide_wrap">
          <div className="infiniteSlide infinite-slider infiniteSlide-wrapper">
            {repeated.map((item, index) => (
              <React.Fragment key={index}>
                <div className="infiniteSlide-item">
                  <Link to={`/shop-default?category_slug=${item.slug}`} className="cls-wrap">
                    <h4>{item.name}</h4>
                    <div className="img-cls">
                      <img
                        loading="lazy"
                        width={80}
                        height={80}
                        src={item.img}
                        alt={item.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                        }}
                      />
                    </div>
                  </Link>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfiniteSlide;
