import type { ProductCardItem } from "@/types/productCard";

type Props = {
  wrapperClassName?: string;
  titleTag?: "h5" | "div";
  product?: ProductCardItem;
};

function DescTitle({ tag, children }: { tag: "h5" | "div"; children: React.ReactNode }) {
  return tag === "h5"
    ? <h5 className="desc_title">{children}</h5>
    : <div className="h6 desc_title">{children}</div>;
}

export function ProductReturnPolicies({
  wrapperClassName = "tab-content_desc desc-3 d-grid",
  titleTag = "h5",
  product,
}: Props) {
  const returnPolicy = product?.return_policy;
  const shippingInfo = product?.shipping_info;
  const sla          = product?.procurement_sla ?? 3;

  return (
    <div className={wrapperClassName}>
      <div className="box-desc">
        <DescTitle tag={titleTag}>Return Policy</DescTitle>
        {returnPolicy ? (
          <div
            className="desc_info cl-text-2 product-html-content"
            dangerouslySetInnerHTML={{ __html: returnPolicy }}
          />
        ) : (
          <p className="desc_info cl-text-2">
            Easy 7-day return. Items must be unused, unwashed, and in original packaging with tags attached.
          </p>
        )}
      </div>

      <div className="box-desc">
        <DescTitle tag={titleTag}>Shipping &amp; Delivery</DescTitle>
        {shippingInfo ? (
          <div
            className="cl-text-2 product-html-content"
            dangerouslySetInnerHTML={{ __html: shippingInfo }}
          />
        ) : (
          <ul className="list">
            <li className="cl-text-2">– Standard delivery: {sla}–{sla + 3} business days.</li>
            <li className="cl-text-2">– Tracking number shared via SMS/email after dispatch.</li>
            <li className="cl-text-2">– Free shipping on orders above ₹999.</li>
            <li className="cl-text-2">– Cash on Delivery available across India.</li>
          </ul>
        )}
      </div>

      <div className="box-desc">
        <DescTitle tag={titleTag}>How to Return</DescTitle>
        <ul className="list">
          <li className="cl-text-2">– Contact us within the return window via WhatsApp or email.</li>
          <li className="cl-text-2">– Pack the item securely with original packaging and invoice.</li>
          <li className="cl-text-2">– Our courier will pick up or we'll share a prepaid label.</li>
          <li className="cl-text-2">– Refund is processed within 5–7 working days after receipt.</li>
        </ul>
      </div>
    </div>
  );
}
