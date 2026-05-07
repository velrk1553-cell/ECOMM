import { useEffect, useState } from "react";
import { useContextElement } from "@/context/Context";
import { useCurrentProductStore } from "@/store/currentProductStore";
import { formatPrice } from "@/utils/formatPrice";

export default function StickyProduct() {
  const [isVisible, setIsVisible] = useState(false);
  const [quantity, setQuantity]   = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  const product = useCurrentProductStore((s) => s.product);
  const { addProductToCart, isAddedToCartProducts, updateQuantity } = useContextElement();

  const isInCart = product ? isAddedToCartProducts(product.id) : false;

  useEffect(() => {
    if (product?.sizes?.[0]) setSelectedSize(String(product.sizes[0]));
  }, [product?.id]);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!product) return null;

  const price    = product.price;
  const imgSrc   = product.img ?? product.images?.[0]?.src ?? "";
  const sizes    = (product.sizes ?? []).map(String).filter(Boolean);

  const handleAddToCart = () => {
    if (isInCart) {
      updateQuantity(product.id, quantity);
    } else {
      addProductToCart({ ...product, selectedSize }, quantity);
    }
  };

  return (
    <div className={`tf-sticky-btn-atc${isVisible ? " show" : ""}`}>
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="atc-product-side">
              {imgSrc && (
                <div className="prd_img">
                  <img loading="lazy" width={60} height={80} src={imgSrc} alt={product.name} />
                </div>
              )}
              <div className="prd_info d-none d-lg-grid">
                <p className="name__prd fw-medium lh-24">{product.name}</p>
                <p className="price__prd fw-semibold">{formatPrice(price)}</p>
              </div>
            </div>
          </div>

          <div className="tf-sticky-atc-infos">
            <form onSubmit={(e) => e.preventDefault()}>
              {sizes.length > 0 && (
                <div className="tf-sticky-atc-variant-price">
                  <p className="title">Size:</p>
                  <div className="tf-select style-2">
                    <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                      {sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="tf-product-info-quantity">
                <p className="title">Quantity:</p>
                <div className="wg-quantity style-2">
                  <button className="btn-quantity minus-btn" type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <i className="icon icon-minus" />
                  </button>
                  <input className="quantity-product" type="text" readOnly value={quantity} />
                  <button className="btn-quantity plus-btn" type="button"
                    onClick={() => setQuantity((q) => q + 1)}>
                    <i className="icon icon-plus" />
                  </button>
                </div>
              </div>

              <a
                href="#shoppingCart"
                data-bs-toggle="offcanvas"
                className="tf-btn animate-btn btn-add-to-cart"
                onClick={handleAddToCart}
              >
                {isInCart ? "Update Cart" : "Add To Cart"} — {formatPrice(price * quantity)}
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
