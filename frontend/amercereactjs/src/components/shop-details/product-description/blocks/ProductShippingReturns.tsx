import type { ProductCardItem } from "@/types/productCard";

type Props = {
  gridClassName?: string;
  titleTag?: "h5" | "div";
  product?: ProductCardItem;
};

function DescTitle({ tag, children }: { tag: "h5" | "div"; children: React.ReactNode }) {
  return tag === "h5"
    ? <h5 className="desc_title">{children}</h5>
    : <div className="h6 desc_title">{children}</div>;
}

export function ProductShippingReturns({
  gridClassName = "tab-content_desc desc-2 tf-grid-layout sm-col-2 xl-col-4",
  titleTag = "h5",
  product,
}: Props) {
  const sla          = product?.procurement_sla ?? null;
  const rawShipping  = product?.shipping_info ?? "";
  const shippingInfo = rawShipping && !rawShipping.toLowerCase().includes("we ship across")
    ? rawShipping
    : null;

  return (
    <div className={gridClassName}>
      <div className="box-desc">
        <DescTitle tag={titleTag}>Shipping Info</DescTitle>
        <div className="desc_info">
          {shippingInfo ? (
            <div
              className="cl-text-2 product-html-content"
              dangerouslySetInnerHTML={{ __html: shippingInfo }}
            />
          ) : (
            <ul className="list">
              <li className="cl-text-2">– Free shipping on orders above ₹999</li>
              <li className="cl-text-2">– Cash on Delivery available pan-India</li>
              <li className="cl-text-2">– Tracked dispatch via courier</li>
            </ul>
          )}
        </div>
      </div>

      {sla != null && (
        <div className="box-desc">
          <DescTitle tag={titleTag}>Estimated Delivery</DescTitle>
          <ul className="list">
            <li className="cl-text-2">– Standard: {sla}–{sla + 3} business days</li>
            {product?.procurement_type === "MADE_TO_ORDER" && (
              <li className="cl-text-2">– Made to order — allow extra production time</li>
            )}
            {product?.origin_state && (
              <li className="cl-text-2">– Ships from {product.origin_state}, India</li>
            )}
          </ul>
        </div>
      )}

      <div className="box-desc">
        <DescTitle tag={titleTag}>Need Help?</DescTitle>
        <ul className="list">
          <li className="cl-text-2">– Contact our support team</li>
          <li className="cl-text-2">– WhatsApp assistance available</li>
        </ul>
      </div>
    </div>
  );
}
