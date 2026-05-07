import type { ProductCardItem } from "@/types/productCard";

type IntroProps = {
  gridClassName?: string;
  titleTag?: "h5" | "div";
  product?: ProductCardItem;
};

export function ProductDescriptionIntro({
  gridClassName = "tab-content_desc tf-grid-layout md-col-2",
  titleTag = "h5",
  product,
}: IntroProps) {
  const Title = ({ children }: { children: React.ReactNode }) =>
    titleTag === "h5"
      ? <h5 className="desc_title">{children}</h5>
      : <div className="h6 desc_title">{children}</div>;

  const hasDetails = product && (
    product.fabric || product.occasion || product.color ||
    product.saree_type || product.pattern || product.fit_type ||
    product.neck_type || product.sleeve_length || product.length_type ||
    product.suitable_for || product.pack_of
  );

  const hasComposition = product && (
    product.fabric || product.wash_care || product.origin_state ||
    product.manufacturer_name || product.weave_type || product.ean
  );

  if (!product || (!product.description && !hasDetails && !hasComposition)) {
    return (
      <div className={gridClassName}>
        <div className="box-desc">
          <Title>Product Description</Title>
          <div className="desc_info">
            <p className="cl-text-2">No description available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={gridClassName}>
      {/* Description + Features */}
      <div className="box-desc">
        <Title>{product.name}</Title>
        <div className="desc_info">
          {product.description && (
            <div
              className="cl-text-2 mb-12 product-html-content"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          {product.features && product.features.length > 0 && (
            <ul className="list mt-8">
              {product.features.map((f, i) => (
                <li key={i} className="cl-text-2">– {f}</li>
              ))}
            </ul>
          )}
          {hasDetails && (
            <ul className="list mt-12">
              {product.saree_type && <li className="cl-text-2">– Type: {product.saree_type}</li>}
              {product.fabric     && <li className="cl-text-2">– Fabric: {product.fabric}</li>}
              {product.pattern    && <li className="cl-text-2">– Pattern: {product.pattern}</li>}
              {product.fit_type   && <li className="cl-text-2">– Fit: {product.fit_type}</li>}
              {product.neck_type  && <li className="cl-text-2">– Neck: {product.neck_type}</li>}
              {product.sleeve_length && <li className="cl-text-2">– Sleeve: {product.sleeve_length}</li>}
              {product.length_type   && <li className="cl-text-2">– Length: {product.length_type}</li>}
              {product.occasion      && <li className="cl-text-2">– Occasion: {product.occasion}</li>}
              {product.suitable_for  && <li className="cl-text-2">– Ideal For: {product.suitable_for}</li>}
              {product.color         && <li className="cl-text-2">– Colour: {product.color}{product.color2 ? ` / ${product.color2}` : ""}</li>}
              {product.pack_of && product.pack_of > 1 && <li className="cl-text-2">– Pack of: {product.pack_of}</li>}
            </ul>
          )}
        </div>
      </div>

      {/* Composition, Origin & Care */}
      {hasComposition && (
        <div className="box-desc">
          <Title>Composition, Origin &amp; Care</Title>
          <ul className="list">
            {product.fabric            && <li className="cl-text-2">– Fabric: {product.fabric}</li>}
            {product.weave_type        && <li className="cl-text-2">– Weave: {product.weave_type}</li>}
            {product.wash_care         && <li className="cl-text-2">– Care: {product.wash_care}</li>}
            {product.origin_state      && <li className="cl-text-2">– Origin: {product.origin_state}, India</li>}
            {product.manufacturer_name && <li className="cl-text-2">– By: {product.manufacturer_name}</li>}
            {product.ean               && <li className="cl-text-2">– EAN: {product.ean}</li>}
            {product.hsn_code          && <li className="cl-text-2">– HSN: {product.hsn_code}</li>}
            {product.tax_code          && <li className="cl-text-2">– Tax: {product.tax_code}</li>}
          </ul>
        </div>
      )}

      {/* Category attributes */}
      {product.category_attributes && Object.keys(product.category_attributes).length > 0 && (
        <div className="box-desc">
          <Title>Specifications</Title>
          <ul className="list">
            {Object.entries(product.category_attributes).map(([k, v]) => (
              <li key={k} className="cl-text-2">– {k}: {v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
