import { Link } from "react-router-dom";

import { useMemo, useState } from "react";

import { useContextElement, type CartProduct } from "@/context/Context";
import { useAuthStore } from "@/store/authStore";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";
import { promoAPI } from "@/services/api";

const FREE_SHIPPING_THRESHOLD = 999;

type ShipOption = "free" | "standard";

const SHIP_PRICES: Record<ShipOption, number> = {
  free: 0,
  standard: 50,
};

export default function ShoppingCart() {
  const { cartProducts, setCartProducts, updateQuantity, totalPrice } =
    useContextElement();
  const { isLoggedIn } = useAuthStore();
  const [shipOption] = useState<ShipOption>("free");

  /* ── Promo code ── */
  const [promoInput,    setPromoInput]    = useState("");
  const [appliedCode,   setAppliedCode]   = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError,    setPromoError]    = useState("");
  const [promoLoading,  setPromoLoading]  = useState(false);

  const handleApplyPromo = async () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (!isLoggedIn) { setPromoError("Please login to apply a promo code."); return; }
    setPromoLoading(true); setPromoError("");
    try {
      const res = await promoAPI.apply({ code, order_amount: totalPrice });
      const r = res.data as { success?: boolean; data?: { discount: number; code: string }; message?: string };
      if (r.success && r.data) {
        setAppliedCode(r.data.code);
        setPromoDiscount(r.data.discount);
        setPromoInput("");
      } else {
        setPromoError(r.message ?? "Invalid promo code.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPromoError(msg ?? "Invalid or expired promo code.");
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => { setAppliedCode(""); setPromoDiscount(0); setPromoError(""); };

  const discount = promoDiscount;
  const shippingCost = SHIP_PRICES[shipOption];
  const orderTotal = Math.max(0, totalPrice - discount + shippingCost);

  const amountToFreeship = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const shipProgressPercent = Math.min(
    100,
    FREE_SHIPPING_THRESHOLD > 0
      ? (totalPrice / FREE_SHIPPING_THRESHOLD) * 100
      : 0,
  );

  const removeLine = (id: ProductId) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const setQty = (id: ProductId, qty: number) => {
    if (qty < 1) {
      removeLine(id);
      return;
    }
    updateQuantity(id, qty);
  };

  const freeshipMessage = useMemo(() => {
    if (totalPrice >= FREE_SHIPPING_THRESHOLD) {
      return (
        <>
          You qualify for{" "}
          <span className="text-primary fw-bold">free shipping</span>
        </>
      );
    }
    return (
      <>
        Buy
        <span className="text-primary fw-bold">
          {" "}
          {formatPrice(amountToFreeship)}{" "}
        </span>
        more to get freeship
      </>
    );
  }, [amountToFreeship, totalPrice]);

  return (
    <>
      <section className="section-shoping-cart each-list-prd flat-spacing-2 pb-0">
        {cartProducts.length > 0 ? (
          <div className="flat-spacing-2 pt-0">
            <div className="container">
            </div>
          </div>
        ) : null}
        <div className="container">
          <div className="row">
            {cartProducts.length === 0 ? (
              <div className="col-12 text-center flat-spacing-2">
                <h4 className="mb-16">Your cart is empty</h4>
                <p className="cl-text-2 mb-24">
                  Add items from the shop to see them here.
                </p>
                <Link to="/shop-default" className="tf-btn animate-btn">
                  Continue shopping
                </Link>
              </div>
            ) : (
              <>
                <div className="col-lg-8">
                  <form
                    className="form-shop-cart"
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className="overflow-auto">
                      <table className="tf-table-page-cart">
                        <thead>
                          <tr>
                            <th>
                              <p className="h6 fw-medium">Products</p>
                            </th>
                            <th>
                              <p className="h6 fw-medium">Price</p>
                            </th>
                            <th>
                              <p className="h6 fw-medium">Quantity</p>
                            </th>
                            <th className="text-end">
                              <p className="h6 fw-medium">Total Price</p>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {cartProducts.map((item) => (
                            <CartTableRow
                              key={item.id}
                              item={item}
                              onRemove={() => removeLine(item.id)}
                              onQtyChange={(qty) => setQty(item.id, qty)}
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {appliedCode ? (
                      <div className="ip-discount-code" style={{ background: '#ecfdf5', borderRadius: 8, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ color: '#065f46', fontWeight: 600 }}>✓ <strong>{appliedCode}</strong> applied — you save {formatPrice(promoDiscount)}</span>
                        <button type="button" className="tf-btn-reset text-danger fw-semibold" style={{ fontSize: 13 }} onClick={removePromo}>Remove</button>
                      </div>
                    ) : (
                      <div className="ip-discount-code">
                        <input
                          type="text"
                          placeholder="Add voucher / promo code"
                          value={promoInput}
                          onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                          disabled={promoLoading}
                        />
                        <button
                          className="tf-btn animate-btn"
                          type="button"
                          onClick={handleApplyPromo}
                          disabled={promoLoading}
                        >
                          {promoLoading ? "…" : "Apply Code"}
                        </button>
                      </div>
                    )}
                    {promoError && <p className="text-danger mt-2 mb-0" style={{ fontSize: 13 }}>{promoError}</p>}
                  </form>
                </div>
                <div className="col-lg-4">
                  <div className="fl-sidebar-cart mt-lg-0 sticky-top">
                    <div className="box-order-summary">
                      <div className="notification-progress">
                        <p>{freeshipMessage}</p>
                        <div className="progress-cart">
                          <div
                            className="value"
                            style={{ width: `${shipProgressPercent}%` }}
                            data-progress={Math.round(shipProgressPercent)}
                          >
                            <span className="round" />
                          </div>
                        </div>
                      </div>
                      <h5 className="title mb-20">Order Summary</h5>
                      <div className="subtotal d-flex justify-content-between align-items-center">
                        <p className="fw-medium lh-24">Subtotal</p>
                        <span className="total fw-medium lh-24">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="discount d-flex justify-content-between align-items-center">
                          <p className="fw-medium lh-24 text-success">Discount ({appliedCode})</p>
                          <span className="total fw-medium lh-24 text-success">-{formatPrice(discount)}</span>
                        </div>
                      )}
                      <div className="ship">
                        <p className="fw-medium lh-24">Shipping</p>
                        <div className="box-check-payment flex-grow-1">
                          <fieldset className="ship-item">
                            <input type="radio" name="ship-check"
                              className="tf-check-rounded" id="free"
                              checked={totalPrice >= FREE_SHIPPING_THRESHOLD}
                              readOnly />
                            <label htmlFor="free">
                              <span>Free Shipping {totalPrice < FREE_SHIPPING_THRESHOLD && `(orders above ${formatPrice(FREE_SHIPPING_THRESHOLD)})`}</span>
                              <span className="price text-success">{formatPrice(0)}</span>
                            </label>
                          </fieldset>
                          <fieldset className="ship-item">
                            <input type="radio" name="ship-check"
                              className="tf-check-rounded" id="standard"
                              checked={totalPrice < FREE_SHIPPING_THRESHOLD}
                              readOnly />
                            <label htmlFor="standard">
                              <span>Standard Delivery</span>
                              <span className="price">{totalPrice >= FREE_SHIPPING_THRESHOLD ? <span className="text-success">Free</span> : formatPrice(50)}</span>
                            </label>
                          </fieldset>
                        </div>
                      </div>
                      <h5 className="total-order d-flex justify-content-between align-items-center">
                        <span>Total</span>
                        <span className="total each-total-price">
                          {formatPrice(orderTotal)}
                        </span>
                      </h5>
                      <fieldset className="checkbox-wrap check-agree">
                        <input
                          type="checkbox"
                          name="agree"
                          className="tf-check-rounded"
                          id="checkOutAgree"
                        />
                        <label htmlFor="checkOutAgree">
                          I agree with the{" "}
                          <Link
                            to="/term-and-condition"
                            className="fw-medium text-decoration-underline link"
                          >
                            terms and conditions
                          </Link>
                        </label>
                      </fieldset>
                      <div className="list-ver text-center">
                        <Link
                          to="/checkout"
                          id="checkout-btn"
                          className="action-checkout tf-btn w-100 animate-btn text-center"
                        >
                          <span className="fw-semibold">
                            Process To Checkout
                          </span>
                        </Link>
                        <Link
                          to="/shop-default"
                          className="link-underline link"
                        >
                          <span className="fw-semibold">
                            Or Continue Shopping
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function CartTableRow({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartProduct;
  onRemove: () => void;
  onQtyChange: (qty: number) => void;
}) {
  const imgSrc =
    item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";

  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel = item.selectedSize ?? null;

  const lineTotal = item.price * item.quantity;

  return (
    <tr className="tf-cart_item each-prd file-delete">
      <td className="cart_product">
        <Link to={`/product-detail/${item.id}`} className="img-prd">
          <img loading="lazy" width={100} height={133} src={imgSrc} alt="" />
        </Link>
        <div className="infor-prd">
          <Link
            to={`/product-detail/${item.id}`}
            className="prd_name fw-medium link lh-24"
          >
            {item.name}
          </Link>
          {colorLabel ? (
            <div className="prd_select text-caption-01">
              <span className="type-text cl-text-3">Color:&nbsp;</span>
              <span className="fw-medium">{colorLabel}</span>
            </div>
          ) : null}
          {sizeLabel ? (
            <div className="prd_select text-caption-01">
              <span className="type-text cl-text-3">Size:&nbsp;</span>
              <span className="fw-medium">{sizeLabel}</span>
            </div>
          ) : null}
          <button
            type="button"
            className="cart_remove tf-btn-line-3 type-primary remove border-0 bg-transparent p-0"
            onClick={onRemove}
          >
            <span className="text-caption-01 fw-semibold">Remove</span>
          </button>
        </div>
      </td>
      <td
        className="cart_price each-price fw-semibold text-primary"
        data-cart-title="Price"
      >
        {formatPrice(item.price)}
      </td>
      <td className="cart_quantity" data-cart-title="Quantity">
        <div className="wg-quantity">
          <button
            type="button"
            className="btn-quantity minus-quantity"
            onClick={() => onQtyChange(item.quantity - 1)}
            aria-label="Decrease quantity"
          >
            <i className="icon icon-minus" />
          </button>
          <input
            className="quantity-product"
            type="text"
            inputMode="numeric"
            name={`qty-${item.id}`}
            readOnly
            value={item.quantity}
            aria-label="Quantity"
          />
          <button
            type="button"
            className="btn-quantity plus-quantity"
            onClick={() => onQtyChange(item.quantity + 1)}
            aria-label="Increase quantity"
          >
            <i className="icon icon-plus" />
          </button>
        </div>
      </td>
      <td>
        <div className="cart_total fw-semibold text-primary each-subtotal-price">
          {formatPrice(lineTotal)}
        </div>
      </td>
    </tr>
  );
}
