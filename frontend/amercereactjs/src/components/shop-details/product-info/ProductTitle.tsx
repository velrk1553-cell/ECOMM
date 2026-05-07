import type { ProductCardItem } from "@/types/productCard";

export function ProductTitle({ product }: { product: ProductCardItem }) {
  const rating     = Math.round(product.avg_rating ?? product.rating ?? 0);
  const reviewCount = product.review_count ?? 0;
  const totalSold  = product.total_sold ?? 0;

  return (
    <>
      {product.category && (
        <p className="product-infor-cate text-caption-01 mb-4 text-capitalize">
          {product.category}
        </p>
      )}

      <h3 className="product-infor-name mb-4 text-capitalize">{product.name}</h3>

      {product.subtitle && (
        <p className="cl-text-2 mb-8 text-body-1">{product.subtitle}</p>
      )}

      <div className="product-infor-meta mb-20">
        <div className="meta_rate">
          <div className="star-wrap normal d-flex align-items-center">
            {[1,2,3,4,5].map((s) => (
              <i
                key={s}
                className={`icon icon-Star${s <= rating ? "" : ""}`}
                style={{ color: s <= rating ? "#f4a234" : "#ccc" }}
              />
            ))}
          </div>
          <span className="text-caption-01 cl-text-2">
            ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
          </span>
        </div>

        {totalSold > 0 && (
          <>
            <div className="br-line type-vertical" />
            <div className="meta_sold">
              <i className="icon icon-Lightning text-primary" />
              <span className="text-caption-01 cl-text-2">
                {totalSold}&nbsp;sold
              </span>
            </div>
          </>
        )}

        {product.sku && (
          <>
            <div className="br-line type-vertical" />
            <div className="meta_prd_code text-caption-01">
              <span className="cl-text-2">SKU:&nbsp;</span>
              <span>{product.sku}</span>
            </div>
          </>
        )}

        {product.brand_name && (
          <>
            <div className="br-line type-vertical" />
            <div className="meta_prd_code text-caption-01">
              <span className="cl-text-2">Brand:&nbsp;</span>
              <span className="fw-medium">{product.brand_name}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
