import type { ProductCardItem } from "@/types/productCard";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function firstLine(text: string, max = 90): string {
  const clean = stripHtml(text);
  const first = clean.split(/[.!\n]/)[0].trim();
  const result = first.length > 0 ? first : clean;
  if (result.length <= max) return result;
  return result.slice(0, max).trimEnd() + "…";
}

const GENERIC_SHIP = "we ship across";

export function ProductDelivery({ product }: { product?: ProductCardItem }) {
  const sla          = product?.procurement_sla ?? null;
  const rawShipping  = product?.shipping_info ?? "";
  const shippingText = rawShipping && !rawShipping.toLowerCase().includes(GENERIC_SHIP)
    ? firstLine(rawShipping)
    : null;

  if (!product || !sla) return null;

  return (
    <div className="tf-product-delivery-return">
      <div className="product-delivery">
        <i className="icon icon-Timer" />
        <p>
          Estimated Delivery:
          <span className="fw-semibold"> {sla}–{sla + 3} business days</span>
          {product.procurement_type === "MADE_TO_ORDER" && (
            <span className="text-muted small"> (Made to order)</span>
          )}
          {product.origin_state && (
            <span className="cl-text-2 small"> · Ships from {product.origin_state}</span>
          )}
        </p>
      </div>

      {shippingText && (
        <div className="product-delivery">
          <i className="icon icon-Package" />
          <p className="cl-text-2">{shippingText}</p>
        </div>
      )}

      {product.manufacturer_name && (
        <div className="product-delivery" style={{ marginTop: 4 }}>
          <i className="icon icon-Buildings" />
          <p className="text-caption-01 cl-text-2">
            Manufactured by{" "}
            <span className="fw-medium">{product.manufacturer_name}</span>
            {product.manufacturer_address && `, ${product.manufacturer_address}`}
          </p>
        </div>
      )}
    </div>
  );
}
