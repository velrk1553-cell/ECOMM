import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import TfSwiper from "@/components/ui/TfSwiper";
import { productsAPI } from "@/services/api";
import { toProductCard } from "@/hooks/useApi";
import type { ProductCardItem } from "@/types/productCard";

function MayBe() {
  const [items, setItems] = useState<ProductCardItem[]>([]);

  useEffect(() => {
    productsAPI.getAll({ featured: 1, limit: 12 })
      .then((res) => {
        const raw = res.data?.data?.products ?? [];
        setItems(raw.map(toProductCard));
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="flat-spacing">
      <div className="container">
        <div className="sect-heading">
          <h4>You may be interested in…</h4>
        </div>
        <TfSwiper
          preview={4}
          tablet={3}
          mobileSm={2}
          mobile={2}
          spaceLg={30}
          spaceMd={20}
          space={10}
          paginationLg={4}
          paginationMd={3}
          paginationSm={2}
          pagination={2}
          paginationClassName="sw-line-default style-2 tf-sw-pagination"
        >
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </TfSwiper>
      </div>
    </section>
  );
}

export default MayBe;
