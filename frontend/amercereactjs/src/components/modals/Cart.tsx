import { useNavigate } from "react-router-dom";
import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";

function closeCartOffcanvas() {
  const el = document.getElementById("shoppingCart");
  if (!el) return;
  const bs = (window as unknown as { bootstrap?: { Offcanvas?: { getInstance?: (el: HTMLElement) => { hide(): void } | null } } }).bootstrap;
  bs?.Offcanvas?.getInstance?.(el)?.hide();
}

export default function Cart({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const navigate = useNavigate();
  const { cartProducts, setCartProducts, updateQuantity, totalPrice } =
    useContextElement();

  const removeLine = (id: ProductId) =>
    setCartProducts((prev) => prev.filter((p) => p.id !== id));

  const setQty = (id: ProductId, qty: number) => {
    if (qty < 1) removeLine(id);
    else updateQuantity(id, qty);
  };

  const goTo = (path: string) => {
    closeCartOffcanvas();
    setTimeout(() => navigate(path), 50); // brief delay lets offcanvas start closing
  };

  return (
    <div
      ref={registerOffcanvasElement}
      className="offcanvas offcanvas-end popup-shopping-cart"
      id="shoppingCart"
    >
      <div className="canvas-wrapper">
        {/* Header */}
        <div className="popup-header">
          <div className="d-flex align-items-center justify-content-between mb-12">
            <h5 className="title">
              Shopping Cart
              {cartProducts.length > 0 && (
                <span className="text-caption-01 cl-text-2 fw-normal ms-8">
                  ({cartProducts.length} item{cartProducts.length !== 1 ? "s" : ""})
                </span>
              )}
            </h5>
            <span
              className="icon-X2 icon-close-popup cs-pointer"
              data-bs-dismiss="offcanvas"
            />
          </div>
        </div>

        <div className="wrap">
          <div className={`tf-mini-cart-wrap list-file-delete${cartProducts.length === 0 ? " wrap-empty_text" : ""}`}>
            <div className="tf-mini-cart-main">
              <div className="tf-mini-cart-sroll">
                <div className={`tf-mini-cart-items${cartProducts.length === 0 ? " list-empty" : ""}`}>
                  {cartProducts.length === 0 ? (
                    <div className="box-text_empty type-shop_cart">
                      <div className="shop-empty_top">
                        <span className="icon"><i className="icon-Handbag" /></span>
                        <h4 className="text-emp">Your cart is empty</h4>
                        <p className="cl-text-2">
                          Explore our saree collection and find your perfect pick.
                        </p>
                      </div>
                      <div className="shop-empty_bot">
                        <button
                          type="button"
                          className="tf-btn animate-btn"
                          onClick={() => goTo("/shop-default")}
                        >
                          Shop Now
                        </button>
                        <button
                          type="button"
                          className="tf-btn btn-stroke"
                          onClick={() => goTo("/")}
                        >
                          Back to Home
                        </button>
                      </div>
                    </div>
                  ) : (
                    cartProducts.map((item, i) => (
                      <CartMiniLine
                        key={i}
                        item={item}
                        onRemove={() => removeLine(item.id)}
                        onQtyChange={(qty) => setQty(item.id, qty)}
                        onProductClick={() => goTo(`/product-detail/${item.id}`)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            {cartProducts.length > 0 && (
              <div className="tf-mini-cart-bottom box-empty_clear">
                <div className="tf-mini-cart-bottom-wrap">
                  <div className="tf-mini-cart-total">
                    <h5 className="text-total d-flex justify-content-between">
                      <span className="subtotal">Subtotal</span>
                      <span className="total-price tf-totals-total-value">
                        {formatPrice(totalPrice)}
                      </span>
                    </h5>
                    <p className="text-caption-01 cl-text-2 mt-4">
                      Taxes &amp; shipping calculated at checkout
                    </p>
                  </div>

                  <div className="tf-mini-cart-view-checkout mt-12">
                    {/* Use button + goTo instead of Link + data-bs-dismiss */}
                    <button
                      type="button"
                      className="tf-btn btn-stroke"
                      onClick={() => goTo("/view-cart")}
                    >
                      View Cart
                    </button>
                    <button
                      type="button"
                      className="tf-btn animate-btn"
                      onClick={() => goTo("/checkout")}
                    >
                      Checkout
                    </button>
                  </div>

                  <button
                    type="button"
                    className="d-flex justify-content-center fw-semibold text-center link mt-8 w-100 border-0 bg-transparent p-0"
                    style={{ cursor: "pointer" }}
                    onClick={() => goTo("/shop-default")}
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CartMiniLine({
  item,
  onRemove,
  onQtyChange,
  onProductClick,
}: {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
  onProductClick: () => void;
}) {
  const imgSrc = item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";
  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel  = item.selectedSize ?? null;

  return (
    <div className="tf-mini-cart-item file-delete">
      <div className="tf-mini-cart-image cs-pointer" onClick={onProductClick}>
        <img loading="lazy" width={100} height={133} src={imgSrc} alt={item.name} />
      </div>
      <div className="tf-mini-cart-info">
        <span
          className="name fw-medium link text-line-clamp-1 cs-pointer"
          style={{ cursor: "pointer" }}
          onClick={onProductClick}
        >
          {item.name}
        </span>
        {colorLabel && (
          <div className="tf-prd-select text-caption-01 mb-4">
            <span className="cl-text-3">Color: </span>
            <span className="fw-medium">{colorLabel}</span>
          </div>
        )}
        {sizeLabel && (
          <div className="tf-prd-select text-caption-01">
            <span className="cl-text-3">Size: </span>
            <span className="fw-medium">{sizeLabel}</span>
          </div>
        )}
      </div>
      <div className="tf-mini-cart-price">
        <button
          type="button"
          className="tf-btn-line-3 type-primary remove cs-pointer border-0 bg-transparent p-0"
          onClick={onRemove}
        >
          <span className="text-caption-01 fw-semibold">Remove</span>
        </button>
        <div className="fw-semibold d-flex flex-column gap-8 align-items-end">
          <div className="wg-quantity justify-content-end">
            <button type="button" className="btn-quantity minus-quantity"
              onClick={() => onQtyChange(item.quantity - 1)}>
              <i className="icon icon-minus" />
            </button>
            <span className="quantity-product d-flex align-items-center justify-content-center border-0">
              {item.quantity}
            </span>
            <button type="button" className="btn-quantity plus-quantity"
              onClick={() => onQtyChange(item.quantity + 1)}>
              <i className="icon icon-plus" />
            </button>
          </div>
          <span className="price tf-mini-card-price">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
