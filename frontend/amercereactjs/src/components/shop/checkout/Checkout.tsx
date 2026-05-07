import { Link, useNavigate } from "react-router-dom";
import { type FormEvent, useEffect, useState } from "react";
import "./Checkout.css";

import { useContextElement, type CartProduct } from "@/context/Context";
import type { ProductId } from "@/context/store";
import { formatPrice } from "@/utils/formatPrice";
import { useAuthStore } from "@/store/authStore";
import { userAPI, cartAPI, ordersAPI, promoAPI, paymentAPI } from "@/services/api";
import type { ApiAddress } from "@/services/api";

/* Razorpay global type */
declare global {
  interface Window {
    Razorpay: new (options: object) => { open(): void };
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Delhi","Jammu and Kashmir","Ladakh","Puducherry",
];

const ADDRESS_LABELS = ["Home","Work","Other","Hotel","Parents"];

export default function Checkout() {
  const { cartProducts, setCartProducts, updateQuantity, totalPrice } = useContextElement();
  const { isLoggedIn, user } = useAuthStore();
  const navigate = useNavigate();

  /* ── Saved addresses ── */
  const [addresses, setAddresses]       = useState<ApiAddress[]>([]);
  const [selectedAddr, setSelectedAddr] = useState<number>(-1);
  const [showAddForm, setShowAddForm]   = useState(false);
  const [addressLoading, setAddressLoading] = useState(true); // true until first fetch done

  const loadAddresses = (): Promise<ApiAddress[]> => {
    if (!isLoggedIn) { setAddressLoading(false); return Promise.resolve([]); }
    setAddressLoading(true);
    return userAPI.getAddresses()
      .then((res) => {
        const list = (res.data as { data?: ApiAddress[] }).data ?? [];
        setAddresses(list);
        const defIdx = list.findIndex((a) => Number(a.is_default) === 1);
        if (defIdx >= 0) { setSelectedAddr(defIdx); applyAddress(list[defIdx]); }
        else if (list.length > 0) { setSelectedAddr(0); applyAddress(list[0]); }
        else { setSelectedAddr(-1); setShowAddForm(true); }
        return list;
      })
      .catch(() => { setShowAddForm(true); return []; })
      .finally(() => setAddressLoading(false));
  };

  // Redirect to login if not authenticated — pass return URL so they come back here
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login?redirect=/checkout", { replace: true });
    }
  }, [isLoggedIn]);

  useEffect(() => { loadAddresses(); }, [isLoggedIn]);

  /* ── Address form fields ── */
  const [addrLabel, setAddrLabel]   = useState("Home");
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  // Ignore system-generated placeholder emails (ph_PHONE@shopkart.app)
  const realEmail = (email?: string) =>
    email && !email.startsWith("ph_") ? email : "";
  const [addrEmail, setAddrEmail]   = useState(realEmail(user?.email));
  const [addrPhone, setAddrPhone]   = useState(user?.phone ?? "");

  // Sync phone/email when user logs in
  useEffect(() => {
    if (user?.phone && !addrPhone) setAddrPhone(user.phone);
    if (user?.email && !addrEmail) setAddrEmail(realEmail(user.email));
  }, [user]);
  const [addrCity, setAddrCity]     = useState("");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrState, setAddrState]   = useState("");
  const [addrZip, setAddrZip]       = useState("");
  const [zipError, setZipError]     = useState(false);
  const [orderNote, setOrderNote]   = useState("");

  function applyAddress(addr: ApiAddress) {
    const parts = addr.full_name.split(" ");
    setFirstName(parts[0] ?? "");
    setLastName(parts.slice(1).join(" "));
    setAddrEmail(user?.email ?? "");
    setAddrPhone(addr.phone ?? "");
    setAddrCity(addr.city ?? "");
    setAddrStreet(`${addr.line1}${addr.line2 ? ", " + addr.line2 : ""}`);
    setAddrState(addr.state ?? "");
    setAddrZip(addr.pincode ?? "");
    setZipError(false);
    setShowAddForm(false);
  }

  /* ── Save new address ── */
  const [savingAddr, setSavingAddr] = useState(false);
  const [addrSaveError, setAddrSaveError] = useState("");

  const handleSaveAddress = async () => {
    setAddrSaveError("");
    // Validate all required fields including phone
    if (!firstName.trim()) { setAddrSaveError("First name is required."); return; }
    if (!addrPhone.trim()) { setAddrSaveError("Phone number is required."); return; }
    if (!addrStreet.trim()) { setAddrSaveError("Street address is required."); return; }
    if (!addrCity.trim())   { setAddrSaveError("City is required."); return; }
    if (!addrState)         { setAddrSaveError("Please select a state."); return; }
    if (!/^\d{6}$/.test(addrZip)) { setAddrSaveError("Enter a valid 6-digit PIN code."); return; }

    setSavingAddr(true);
    try {
      const res = await userAPI.saveAddress({
        label:      addrLabel,
        full_name:  `${firstName} ${lastName}`.trim(),
        phone:      addrPhone.trim(),
        line1:      addrStreet.trim(),
        city:       addrCity.trim(),
        state:      addrState,
        pincode:    addrZip,
        country:    "India",
        is_default: addresses.length === 0 ? 1 : 0,
      });

      // Backend returns updated addresses list directly — use it
      const result = res.data as { success?: boolean; data?: { addresses?: ApiAddress[] }; message?: string };
      if (result.success) {
        const fresh = result.data?.addresses;
        if (fresh && fresh.length > 0) {
          setAddresses(fresh);
          const newIdx = fresh.length - 1;
          setSelectedAddr(newIdx);
          applyAddress(fresh[newIdx]);
        } else {
          // Fallback: reload from API
          await loadAddresses();
        }
        setShowAddForm(false);
      } else {
        setAddrSaveError(result.message ?? "Failed to save address.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setAddrSaveError(msg ?? "Failed to save address. Please try again.");
    } finally {
      setSavingAddr(false);
    }
  };

  /* ── Promo code ── */
  const [promoInput, setPromoInput]       = useState("");
  const [appliedCode, setAppliedCode]     = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError]       = useState("");
  const [promoLoading, setPromoLoading]   = useState(false);

  const handleApplyPromo = async (e: FormEvent) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (!code) return;
    if (!isLoggedIn) { setPromoError("Please log in to apply a promo code."); return; }
    setPromoLoading(true); setPromoError("");
    try {
      const res = await promoAPI.apply({ code, order_amount: totalPrice });
      const r = res.data as { success?: boolean; data?: { discount: number; code: string }; message?: string };
      if (r.success && r.data) {
        setAppliedCode(r.data.code); setPromoDiscount(r.data.discount); setPromoInput("");
      } else setPromoError(r.message ?? "Invalid promo code.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPromoError(msg ?? "Invalid or expired promo code.");
    } finally { setPromoLoading(false); }
  };

  const removePromo = () => { setAppliedCode(""); setPromoDiscount(0); setPromoError(""); setPromoInput(""); };

  const shippingCost = totalPrice >= 999 ? 0 : 50;
  const orderTotal   = Math.max(0, totalPrice - promoDiscount + shippingCost);

  /* ── Payment ── */
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");

  /* ── Place order ── */
  const [orderError, setOrderError]     = useState("");
  const [orderPlacing, setOrderPlacing] = useState(false);

  const getDeliveryAddress = () => {
    if (selectedAddr >= 0 && addresses[selectedAddr]) {
      const a = addresses[selectedAddr];
      return {
        full_name: a.full_name,
        phone:     a.phone,
        line1:     a.line1,
        line2:     a.line2 ?? "",
        city:      a.city,
        state:     a.state,
        pincode:   a.pincode,
        country:   "India",
      };
    }
    return {
      full_name: `${firstName} ${lastName}`.trim(),
      phone:     addrPhone,
      line1:     addrStreet,
      city:      addrCity,
      state:     addrState,
      pincode:   addrZip,
      country:   "India",
    };
  };

  const handleCheckoutSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOrderError("");

    const addr = getDeliveryAddress();
    if (!addr.full_name || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      setOrderError("Please complete the delivery address.");
      return;
    }
    if (!/^\d{6}$/.test(addr.pincode)) { setZipError(true); setOrderError("Enter a valid 6-digit PIN code."); return; }

    if (!isLoggedIn) { setOrderError("Please log in to place an order."); return; }
    if (cartProducts.length === 0) { setOrderError("Your cart is empty."); return; }

    setOrderPlacing(true);
    try {
      // Sync local cart → backend cart
      await cartAPI.clear();
      for (const item of cartProducts) {
        await cartAPI.add({ product_id: Number(item.id), quantity: item.quantity });
      }

      // Place order
      const res = await ordersAPI.checkout({
        address: addr,
        payment_method: paymentMethod,
        promo_code: appliedCode || undefined,
        note: orderNote,
      });

      const result = res.data as { success?: boolean; data?: { order?: { id: number } } };
      if (!result.success || !result.data?.order?.id) {
        setOrderError("Failed to place order. Please try again.");
        return;
      }

      const orderId = result.data.order.id;

      // ── COD: done ──────────────────────────────────────────
      if (paymentMethod === "cod") {
        setCartProducts([]);
        navigate("/account-orders");
        return;
      }

      // ── Razorpay online payment ─────────────────────────────
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setOrderError("Failed to load payment gateway. Please try again or use Cash on Delivery.");
        return;
      }

      const payRes = await paymentAPI.createOrder({ order_id: orderId });
      const payData = (payRes.data as { success?: boolean; data?: {
        razorpay_order_id: string; amount: number; currency: string;
        key_id: string; order_number: string;
        prefill: { name: string; email: string; contact: string };
      }; message?: string });

      if (!payData.success || !payData.data?.razorpay_order_id) {
        setOrderError(payData.message ?? "Payment gateway error. Try Cash on Delivery.");
        return;
      }

      const pd = payData.data;
      const rzpOptions = {
        key:         pd.key_id,
        amount:      pd.amount,
        currency:    pd.currency,
        order_id:    pd.razorpay_order_id,
        name:        "ShopKart Sarees",
        description: `Order #${pd.order_number}`,
        image:       "/assets/images/logo/logo.png",
        prefill:     { name: pd.prefill.name, email: pd.prefill.email, contact: pd.prefill.contact },
        theme:       { color: "#f59e0b" },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id:  response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id:           orderId,
            });
          } catch {
            setOrderError("Payment received but verification failed. Contact support with Order #" + pd.order_number);
          }
          setCartProducts([]);
          navigate("/account-orders");
        },
        modal: {
          ondismiss: async () => {
            try { await ordersAPI.cancelOrder(orderId); } catch { /* ignore */ }
            setOrderError("Payment cancelled. Your order has been cancelled.");
            setOrderPlacing(false);
          },
        },
      };

      new window.Razorpay(rzpOptions).open();
      return; // don't hit finally yet — Razorpay handler controls flow

    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setOrderError(msg ?? "Order placement failed. Please try again.");
    } finally { setOrderPlacing(false); }
  };

  const removeLine = (id: ProductId) => setCartProducts((prev) => prev.filter((p) => p.id !== id));
  const setQty = (id: ProductId, qty: number) => {
    if (qty < 1) removeLine(id); else updateQuantity(id, qty);
  };

  return (
    <section className="premium-checkout-wrapper">


      <div className="container">
        <div className="row">
          {/* ── LEFT: address + payment ── */}
          <div className="col-lg-7">
            
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: '#0f172a' }}>Checkout</h2>
              <Link to="/view-cart" className="text-decoration-none fw-semibold" style={{ color: '#64748b' }}>
                ← Back to Cart
              </Link>
            </div>

            {/* Not-logged-in users are redirected to /login?redirect=/checkout above */}

            <form onSubmit={handleCheckoutSubmit}>
              <div className="checkout-card">
                <div className="checkout-header">
                  <div className="icon">📍</div>
                  Delivery Address
                </div>

                {/* Skeleton while addresses are loading */}
                {addressLoading && (
                  <div className="mb-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="address-card mb-3"
                        style={{ background: "#f1f5f9", borderRadius: 12, padding: 20, animation: "pulse 1.5s ease-in-out infinite" }}>
                        <div style={{ height: 14, width: "40%", background: "#e2e8f0", borderRadius: 6, marginBottom: 10 }} />
                        <div style={{ height: 12, width: "70%", background: "#e2e8f0", borderRadius: 6, marginBottom: 8 }} />
                        <div style={{ height: 12, width: "55%", background: "#e2e8f0", borderRadius: 6 }} />
                        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}`}</style>
                      </div>
                    ))}
                  </div>
                )}

                {!addressLoading && isLoggedIn && addresses.length > 0 && !showAddForm && (
                  <div className="mb-4">
                    <div className="grid-2">
                      {addresses.map((a, i) => {
                        const isSelected = selectedAddr === i;
                        const labelIcon = a.label === "Work" ? "💼" : a.label === "Hotel" ? "🏨" : a.label === "Parents" ? "👨‍👩‍👧" : "🏠";
                        return (
                          <div 
                            key={a.id} 
                            className={`address-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => { setSelectedAddr(i); applyAddress(a); }}
                          >
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div className="fw-semibold text-dark d-flex align-items-center gap-2">
                                {labelIcon} {a.label ?? "Home"}
                                {Number(a.is_default) === 1 && <span className="badge bg-success bg-opacity-10 text-success ms-2">Default</span>}
                              </div>
                              <div className="radio-circle">
                                {isSelected && <div className="radio-inner" />}
                              </div>
                            </div>
                            <div className="fw-bold mb-1" style={{ fontSize: 15 }}>{a.full_name}</div>
                            <div className="text-muted" style={{ fontSize: 14, lineHeight: 1.5 }}>
                              {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br/>
                              {a.city}, {a.state} – {a.pincode}
                            </div>
                            <div className="mt-3 text-muted d-flex align-items-center gap-2" style={{ fontSize: 13 }}>
                              📞 {a.phone}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" className="tf-btn-line-2 link mt-3" onClick={() => navigate("/account-addresses")}>
                      + Add New Address
                    </button>
                  </div>
                )}

                {!addressLoading && (showAddForm || !isLoggedIn || addresses.length === 0) && (
                  <div>
                    {isLoggedIn && (
                      <div className="mb-3">
                        <label className="fw-semibold mb-2 d-block">Address Label</label>
                        <div className="d-flex gap-2 flex-wrap">
                          {ADDRESS_LABELS.map((lbl) => (
                            <button key={lbl} type="button"
                              className={`btn btn-sm ${addrLabel === lbl ? "btn-dark" : "btn-outline-secondary"}`}
                              style={{ borderRadius: 8 }}
                              onClick={() => setAddrLabel(lbl)}>
                              {lbl === "Home" ? "🏠" : lbl === "Work" ? "💼" : lbl === "Hotel" ? "🏨" : lbl === "Parents" ? "👨👩👧" : "📍"} {lbl}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid-2">
                      <input type="text" className="premium-input" placeholder="First Name*" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      <input type="text" className="premium-input" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="grid-2">
                      <input type="email" className="premium-input" placeholder="Email Address" value={addrEmail} onChange={(e) => setAddrEmail(e.target.value)} />
                      <input type="tel" className="premium-input" placeholder="Phone Number*" required value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} />
                    </div>
                    <input type="text" className="premium-input" placeholder="Street Address / Landmark*" required value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} />
                    <div className="grid-2">
                      <input type="text" className="premium-input" placeholder="Town / City*" required value={addrCity} onChange={(e) => setAddrCity(e.target.value)} />
                      <select className="premium-select" value={addrState} onChange={(e) => setAddrState(e.target.value)} required>
                        <option value="">Select State*</option>
                        {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="grid-2">
                      <div>
                        <input type="text" className={`premium-input mb-0 ${zipError ? 'border-danger' : ''}`} inputMode="numeric" placeholder="PIN Code*" required maxLength={6} value={addrZip} onChange={(e) => { setAddrZip(e.target.value.replace(/\D/g, "")); setZipError(false); }} />
                        {zipError && <div className="text-danger mt-1" style={{ fontSize: 12 }}>Enter a valid 6-digit PIN.</div>}
                      </div>
                      <input value="India" readOnly className="premium-input" style={{ background: '#e2e8f0', color: '#64748b' }} />
                    </div>

                    {isLoggedIn && (
                      <div className="mt-3">
                        {addrSaveError && <p className="text-danger text-sm mb-2">{addrSaveError}</p>}
                        <button type="button" className="tf-btn btn-sm animate-btn" onClick={handleSaveAddress} disabled={savingAddr}>
                          {savingAddr ? "Saving…" : "Save Address"}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <textarea className="premium-input mt-4 mb-0" placeholder="Order notes" rows={2} value={orderNote} onChange={(e) => setOrderNote(e.target.value)} />
              </div>

              <div className="checkout-card">
                <div className="checkout-header">
                  <div className="icon">💳</div>
                  Payment Method
                </div>

                <div 
                  className={`payment-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="radio-circle">
                      {paymentMethod === 'cod' && <div className="radio-inner" />}
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize: 16, color: '#0f172a' }}>💵 Cash on Delivery</div>
                      <div style={{ fontSize: 14, color: '#64748b' }}>Pay when your order arrives</div>
                    </div>
                  </div>
                </div>

                <div 
                  className={`payment-card mb-0 ${paymentMethod === 'razorpay' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod("razorpay")}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div className="radio-circle">
                      {paymentMethod === 'razorpay' && <div className="radio-inner" />}
                    </div>
                    <div>
                      <div className="fw-bold" style={{ fontSize: 16, color: '#0f172a' }}>💳 Online Payment</div>
                      <div style={{ fontSize: 14, color: '#64748b' }}>UPI · Credit/Debit Card · Net Banking · Wallets</div>
                    </div>
                  </div>
                  {paymentMethod === 'razorpay' && (
                    <div className="mt-3" style={{ paddingLeft: '52px' }}>
                      <div className="d-flex gap-2 flex-wrap">
                        {["UPI", "Visa", "Mastercard", "RuPay", "PhonePe", "GPay"].map((m) => (
                          <span key={m} className="payment-badge">
                            {m}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 mb-0" style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>
                        🔒 Secured by Razorpay — 256-bit SSL encryption
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {orderError && (
                <div className="alert alert-danger" style={{ borderRadius: 12 }}>
                  {orderError}
                </div>
              )}
              {isLoggedIn ? (
                <button type="submit" className="btn-premium mt-4" disabled={cartProducts.length === 0 || orderPlacing}>
                  {orderPlacing ? "Processing..." : `Place Order • ${formatPrice(orderTotal)}`}
                  {!orderPlacing && <i className="icon-arrow-right ms-2" />}
                </button>
              ) : (
                <button type="button" className="btn-premium mt-4" data-bs-toggle="modal" data-bs-target="#phoneOTPModal">
                  📱 Login to Place Order
                </button>
              )}
            </form>
          </div>

          {/* ── RIGHT: order summary ── */}
          <div className="col-lg-5">
            <div className="summary-card">
              <h3 className="fw-bold mb-4" style={{ fontSize: 22, color: '#0f172a' }}>Order Summary</h3>
              
              <div className="order-items-list mb-4">
                {cartProducts.length === 0 ? (
                  <div className="text-center py-4 text-muted fw-semibold">Your cart is empty</div>
                ) : (
                  cartProducts.map((item) => (
                    <CheckoutOrderItemPremium key={item.id} item={item}
                      onRemove={() => removeLine(item.id)}
                      onQtyChange={(qty) => setQty(item.id, qty)} />
                  ))
                )}
              </div>

              {appliedCode ? (
                <div className="premium-alert mb-4" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46', padding: '12px 16px' }}>
                  <div className="flex-grow-1 fw-bold">
                    ✓ {appliedCode} applied!
                  </div>
                  <button type="button" className="btn btn-sm btn-link text-danger p-0 text-decoration-none fw-semibold" onClick={removePromo}>Remove</button>
                </div>
              ) : (
                <div className="promo-box">
                  <input type="text" className="promo-input" placeholder="Promo / voucher code"
                    value={promoInput} onChange={(e) => { setPromoInput(e.target.value); setPromoError(""); }}
                    disabled={promoLoading} />
                  <button className="tf-btn btn-sm animate-btn promo-apply-btn" type="button" onClick={handleApplyPromo} disabled={promoLoading}>
                    {promoLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
              {promoError && <p className="text-danger mt-n2 mb-3" style={{ fontSize: 13 }}>{promoError}</p>}

              <div className="summary-row">
                <span>Subtotal</span>
                <span className="fw-semibold text-dark">{formatPrice(totalPrice)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="summary-row text-success fw-semibold">
                  <span>Discount ({appliedCode})</span>
                  <span>−{formatPrice(promoDiscount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Shipping</span>
                <span className="fw-semibold text-dark">{shippingCost === 0 ? <span className="text-success">Free</span> : formatPrice(shippingCost)}</span>
              </div>
              
              <div className="summary-total">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function CheckoutOrderItemPremium({ item, onRemove, onQtyChange }: {
  item: CartProduct; onRemove: () => void; onQtyChange: (qty: number) => void;
}) {
  const imgSrc = item.img ?? item.images?.[0]?.src ?? "/assets/images/product/product-1.jpg";
  const colorLabel = item.selectedColor ?? item.colors?.[0]?.label ?? null;
  const sizeLabel  = item.selectedSize ?? null;

  return (
    <div className="order-item-premium">
      <img src={imgSrc} alt={item.name} />
      <div className="order-item-details">
        <div className="d-flex justify-content-between align-items-start">
          <Link to={`/product-detail/${item.id}`} className="order-item-title text-decoration-none">{item.name}</Link>
          <button type="button" className="btn btn-sm text-danger p-0 border-0 bg-transparent" onClick={onRemove} title="Remove">
            <i className="icon-X2" style={{ fontSize: 16 }} />
          </button>
        </div>
        
        <div className="order-item-meta">
          {colorLabel && <span className="me-3">Color: <span className="fw-semibold text-dark">{colorLabel}</span></span>}
          {sizeLabel && <span>Size: <span className="fw-semibold text-dark">{sizeLabel}</span></span>}
        </div>
        
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="qty-control">
            <button type="button" className="qty-btn" onClick={() => onQtyChange(item.quantity - 1)}>−</button>
            <input className="qty-input" readOnly value={item.quantity} />
            <button type="button" className="qty-btn" onClick={() => onQtyChange(item.quantity + 1)}>+</button>
          </div>
          <div className="fw-bold" style={{ color: '#0f172a', fontSize: 15 }}>
            {formatPrice(item.price * item.quantity)}
          </div>
        </div>
      </div>
    </div>
  );
}
