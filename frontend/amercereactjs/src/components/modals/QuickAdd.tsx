import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";
import { formatPrice } from "@/utils/formatPrice";

export default function QuickAdd({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const { quickAddProduct, addProductToCart, isAddedToCartProducts } =
    useContextElement();

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSizeIndex, setSelectedSizeIndex]   = useState(0);
  const [quantity, setQuantity]                     = useState(1);

  // Reset selections whenever the product changes
  useEffect(() => {
    setSelectedColorIndex(0);
    setSelectedSizeIndex(0);
    setQuantity(1);
  }, [quickAddProduct?.id]);

  const product = quickAddProduct;

  const sizeOptions   = product ? (product.sizes ?? []).map(String) : [];
  const hasSizes      = sizeOptions.length > 0;
  const selectedColor = product?.colors?.[selectedColorIndex];
  const selectedSize  = sizeOptions[selectedSizeIndex] ?? null;
  const displayPrice  = product?.price ?? 0;
  const previewImage  = selectedColor?.img
    ?? product?.img
    ?? product?.images?.[0]?.src
    ?? "/assets/images/product/product-1.jpg";

  const handleAddToCart = () => {
    if (!product) return;
    if (isAddedToCartProducts(product.id)) return;
    addProductToCart(
      { ...product, selectedSize: selectedSize ?? undefined, selectedColor: selectedColor?.label },
      quantity,
    );
  };

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-quickadd"
      id="quickAdd"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          <div className="d-flex align-items-center justify-content-between mb-20">
            <h5>Quick Add</h5>
            <span className="d-flex cs-pointer link" data-bs-dismiss="modal">
              <i className="icon icon-X2 fs-24" />
            </span>
          </div>

          {/* Loading state — product not yet set */}
          {!product ? (
            <div className="d-flex justify-content-center align-items-center py-4">
              <div className="spinner-border spinner-border-sm text-secondary" role="status" />
            </div>
          ) : (
            <div className="tf-product-quick_add tf-quick-prd_variant">

              {/* Mini product header */}
              <div className="product-mini-view">
                <Link to={`/product-detail/${product.id}`} className="prd-image" data-bs-dismiss="modal">
                  <img
                    className="img-product"
                    width={80}
                    height={107}
                    src={previewImage}
                    alt={product.name}
                  />
                </Link>
                <div className="prd-content">
                  <Link
                    to={`/product-detail/${product.id}`}
                    className="prd-name fw-medium link-underline link text-capitalize"
                    data-bs-dismiss="modal"
                  >
                    {product.name}
                  </Link>
                  <div className="price-wrap">
                    <span className="price-new text-primary fw-semibold price-on-sale">
                      {formatPrice(displayPrice)}
                    </span>
                    {product.priceOld != null && (
                      <span className="price-old text-caption-01 cl-text-3">
                        {formatPrice(product.priceOld)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="quick-variant-picker picker_color">
                  <div className="variant-picker_label mb-12">
                    <div>
                      Color:{" "}
                      <span className="variant__value text-capitalize fw-medium">
                        {selectedColor?.label}
                      </span>
                    </div>
                  </div>
                  <div className="variant-picker_values">
                    {product.colors.map((color, index) => (
                      <button
                        key={`${color.label}-${index}`}
                        type="button"
                        className={`hover-tooltip tooltip-bot color_btn style-image ${selectedColorIndex === index ? "active" : ""}`}
                        onClick={() => setSelectedColorIndex(index)}
                      >
                        <div className="img">
                          <img loading="lazy" width={60} height={60} src={color.img} alt={color.label} />
                        </div>
                        <span className="tooltip color__label">{color.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {hasSizes && (
                <div className="quick-variant-picker picker_size">
                  <div className="variant-picker_label mb-12">
                    <div>
                      Size:{" "}
                      <span className="variant__value text-capitalize fw-medium">
                        {selectedSize}
                      </span>
                    </div>
                  </div>
                  <div className="variant-picker_values">
                    {sizeOptions.map((size, index) => (
                      <button
                        key={`${size}-${index}`}
                        type="button"
                        className={`size_btn ${selectedSizeIndex === index ? "active" : ""}`}
                        onClick={() => setSelectedSizeIndex(index)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Add to Cart */}
              <div className="product-total-quantity">
                <p>Quantity:</p>
                <div className="group-action">
                  <div className="wg-quantity">
                    <button type="button" className="btn-quantity btn-decrease"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                      <i className="icon icon-minus" />
                    </button>
                    <input className="quantity-product" type="text" readOnly value={quantity} />
                    <button type="button" className="btn-quantity btn-increase"
                      onClick={() => setQuantity((q) => q + 1)}>
                      <i className="icon icon-plus" />
                    </button>
                  </div>
                  <a
                    href="#shoppingCart"
                    onClick={handleAddToCart}
                    data-bs-toggle="offcanvas"
                    data-bs-dismiss="modal"
                    className="btn-action-price tf-btn type-xl animate-btn w-100"
                  >
                    {isAddedToCartProducts(product.id) ? "Added" : "Add to Cart"}
                    <span className="d-none d-sm-block d-md-none d-lg-block">
                      &nbsp;-&nbsp;
                    </span>
                    <span className="price-add d-none d-sm-block d-md-none d-lg-block">
                      {formatPrice(displayPrice * quantity)}
                    </span>
                  </a>
                </div>
                <Link
                  to="/checkout"
                  data-bs-dismiss="modal"
                  className="tf-btn type-xl btn-primary animate-btn w-100"
                  onClick={handleAddToCart}
                >
                  Buy It Now
                </Link>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
