import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Shop from "@/components/shop/shop-default/Shop";
import PageMeta from "@/components/common/PageMeta";
import { categoriesAPI } from "@/services/api";
import type { ApiCategory } from "@/services/api";

export default function Page() {
  const [searchParams] = useSearchParams();
  const categorySlug = searchParams.get("category_slug") ?? "";
  const [category, setCategory] = useState<ApiCategory | null>(null);

  useEffect(() => {
    if (!categorySlug) { setCategory(null); return; }
    categoriesAPI.getAll()
      .then((res) => {
        const all = res.data.data ?? [];
        const found = all.find((c) => c.slug === categorySlug) ?? null;
        setCategory(found);
      })
      .catch(() => setCategory(null));
  }, [categorySlug]);

  const title = category?.name ?? "All Sarees";
  const desc  = category
    ? `Explore our ${category.name} collection — handpicked for you.`
    : "Browse our complete saree collection.";

  return (
    <>
      <PageMeta title={`${title} | ShopKart Sarees`} description={desc} />
      <section className="section-page-title text-center flat-spacing-2 pb-0">
        <div className="container">
          <div className="main-page-title">
            <div className="breadcrumbs">
              <Link to="/" className="text-caption-01 cl-text-3 link">Home</Link>
              <i className="icon icon-CaretRightThin cl-text-3" />
              {category && (
                <>
                  <Link to="/shop-default" className="text-caption-01 cl-text-3 link">All Sarees</Link>
                  <i className="icon icon-CaretRightThin cl-text-3" />
                </>
              )}
              <p className="text-caption-01">{title}</p>
            </div>
            <h3>{title}</h3>
            <p className="text-body-1 cl-text-2">{desc}</p>
          </div>
        </div>
      </section>
      <Shop variant={["infinityScroll"]} />
    </>
  );
}
