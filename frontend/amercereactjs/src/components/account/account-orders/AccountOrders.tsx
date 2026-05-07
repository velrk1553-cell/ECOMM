import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { ordersAPI } from "@/services/api";
import { formatPrice } from "@/utils/formatPrice";
import { apiImageUrl } from "@/hooks/useApi";

interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
  thumbnail?: string;
}

interface Order {
  id: number;
  order_number?: string;
  status: string;
  payment_status?: string;
  payment_method?: string;
  total: number;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  promo_code?: string;
  tracking_number?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  shipping_name?: string;
  shipping_line1?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_pincode?: string;
  shipping_phone?: string;
  items?: OrderItem[];
}

const STATUS_STEPS = [
  { key: "pending",    label: "Order Placed",  icon: "📋" },
  { key: "confirmed",  label: "Confirmed",     icon: "✅" },
  { key: "processing", label: "Processing",    icon: "🔧" },
  { key: "shipped",    label: "Shipped",       icon: "🚚" },
  { key: "delivered",  label: "Delivered",     icon: "📦" },
];

const STATUS_META: Record<string, { bg: string; color: string; label: string }> = {
  pending:    { bg: "#fef3c7", color: "#92400e", label: "Pending"    },
  confirmed:  { bg: "#dbeafe", color: "#1e40af", label: "Confirmed"  },
  processing: { bg: "#ede9fe", color: "#5b21b6", label: "Processing" },
  shipped:    { bg: "#e0f2fe", color: "#0369a1", label: "Shipped"    },
  delivered:  { bg: "#dcfce7", color: "#166534", label: "Delivered"  },
  cancelled:  { bg: "#fee2e2", color: "#991b1b", label: "Cancelled"  },
  returned:   { bg: "#ffedd5", color: "#9a3412", label: "Returned"   },
};

const TABS = [
  { id: "all",       label: "All"       },
  { id: "pending",   label: "Pending"   },
  { id: "shipped",   label: "Shipped"   },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

function StatusTimeline({ status }: { status: string }) {
  if (status === "cancelled" || status === "returned") {
    const meta = STATUS_META[status];
    return (
      <div style={{ padding: "12px 16px", background: meta.bg, borderRadius: 8, color: meta.color, fontWeight: 600, fontSize: 14 }}>
        {status === "cancelled" ? "❌ Order Cancelled" : "↩️ Return Requested"}
      </div>
    );
  }
  const cancelledStatuses = ["cancelled", "returned"];
  if (cancelledStatuses.includes(status)) return null;

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
      {STATUS_STEPS.map((step, idx) => {
        const done    = idx <= currentIdx;
        const active  = idx === currentIdx;
        return (
          <div key={step.key} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: done ? "#0f172a" : "#f1f5f9",
                color: done ? "#fff" : "#94a3b8",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: active ? 18 : 14,
                border: active ? "3px solid #0f172a" : "2px solid " + (done ? "#0f172a" : "#e2e8f0"),
                transition: "all 0.2s",
                boxShadow: active ? "0 0 0 4px rgba(15,23,42,0.1)" : "none",
              }}>
                {step.icon}
              </div>
              <span style={{ fontSize: 10, color: done ? "#0f172a" : "#94a3b8", fontWeight: done ? 600 : 400, whiteSpace: "nowrap" }}>
                {step.label}
              </span>
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div style={{
                height: 2, width: 32, background: idx < currentIdx ? "#0f172a" : "#e2e8f0",
                marginBottom: 20, flexShrink: 0,
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AccountOrders() {
  const [orders,    setOrders]    = useState<Order[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [expanded,  setExpanded]  = useState<number | null>(null);

  useEffect(() => {
    ordersAPI.getAll()
      .then((res) => setOrders((res.data as { data?: Order[] }).data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const visible = activeTab === "all"
    ? orders
    : orders.filter((o) => o.status === activeTab);

  const countOf = (id: string) =>
    id === "all" ? orders.length : orders.filter((o) => o.status === id).length;

  return (
    <AccountSection title="My Orders">
      <div className="account-my_order">
        {/* Tabs */}
        <ul className="tab-btn-wrap-v1" role="tablist">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const count  = countOf(tab.id);
            return (
              <li key={tab.id} className="nav-tab-item" role="presentation">
                <a
                  className={`tf-btn-tab ${active ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ cursor: "pointer" }}
                >
                  <span className="h6 fw-medium">
                    {tab.label}
                    {count > 0 && <span className="ms-1 opacity-50">({count})</span>}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Content */}
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-dark" role="status" /></div>
        ) : visible.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: "var(--bg)", border: "1px dashed var(--line)" }}>
            <p className="mb-3">No orders found.</p>
            <Link to="/shop-default" className="tf-btn btn-sm animate-btn">Shop Now</Link>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4 mt-4">
            {visible.map((order) => {
              const meta = STATUS_META[order.status] ?? STATUS_META.pending;
              const isExpanded = expanded === order.id;

              return (
                <div key={order.id} style={{ border: "1px solid #f1f5f9", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                  {/* Order header */}
                  <div style={{ padding: "16px 20px", background: "#fafafa", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px" }}>Order</div>
                        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>#{order.order_number ?? order.id}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px" }}>Date</div>
                        <div style={{ fontWeight: 600, color: "#334155" }}>
                          {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".5px" }}>Total</div>
                        <div style={{ fontWeight: 700, color: "#0f172a" }}>{formatPrice(order.total)}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        background: meta.bg, color: meta.color,
                        padding: "4px 14px", borderRadius: 20,
                        fontSize: 12, fontWeight: 700, letterSpacing: ".3px",
                      }}>
                        {meta.label}
                      </span>
                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : order.id)}
                        style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13, color: "#64748b", fontWeight: 600 }}
                      >
                        {isExpanded ? "Hide" : "Details"}
                      </button>
                    </div>
                  </div>

                  {/* Status timeline */}
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid #f1f5f9" }}>
                    <StatusTimeline status={order.status} />
                    {order.tracking_number && (
                      <div style={{ marginTop: 8, fontSize: 13, color: "#0369a1", fontWeight: 600 }}>
                        🔍 Tracking: {order.tracking_number}
                      </div>
                    )}
                  </div>

                  {/* Items preview */}
                  <div style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
                      {(order.items ?? []).slice(0, 4).map((item, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                          <img
                            src={apiImageUrl(item.thumbnail)}
                            alt={item.product_name}
                            style={{ width: 56, height: 70, objectFit: "cover", borderRadius: 8, background: "#f1f5f9" }}
                          />
                          <div style={{ fontSize: 13 }}>
                            <div style={{ fontWeight: 600, color: "#0f172a", maxWidth: 120, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {item.product_name}
                            </div>
                            <div style={{ color: "#64748b" }}>Qty: {item.quantity}</div>
                            <div style={{ fontWeight: 700 }}>{formatPrice(item.subtotal)}</div>
                          </div>
                        </div>
                      ))}
                      {(order.items?.length ?? 0) > 4 && (
                        <div style={{ display: "flex", alignItems: "center", color: "#64748b", fontSize: 13 }}>
                          +{(order.items?.length ?? 0) - 4} more
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div style={{ padding: "0 20px 20px", borderTop: "1px dashed #f1f5f9" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
                        {/* Order totals */}
                        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16 }}>
                          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>Order Summary</div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569", marginBottom: 6 }}>
                            <span>Subtotal</span><span>{formatPrice(order.subtotal ?? order.total)}</span>
                          </div>
                          {(order.discount ?? 0) > 0 && (
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#16a34a", marginBottom: 6 }}>
                              <span>Coupon ({order.promo_code})</span>
                              <span>-{formatPrice(order.discount!)}</span>
                            </div>
                          )}
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#475569", marginBottom: 6 }}>
                            <span>Shipping</span>
                            <span>{(order.shipping ?? 0) === 0 ? <span style={{ color: "#16a34a" }}>Free</span> : formatPrice(order.shipping!)}</span>
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 15, color: "#0f172a", borderTop: "1px solid #e2e8f0", paddingTop: 8, marginTop: 4 }}>
                            <span>Total</span><span>{formatPrice(order.total)}</span>
                          </div>
                          <div style={{ marginTop: 8, fontSize: 12, color: "#64748b" }}>
                            Payment: <strong>{order.payment_method?.toUpperCase()}</strong> &nbsp;·&nbsp; {order.payment_status}
                          </div>
                        </div>

                        {/* Delivery address */}
                        <div style={{ background: "#f8fafc", borderRadius: 12, padding: 16 }}>
                          <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>📍 Delivery Address</div>
                          <div style={{ fontSize: 13, color: "#334155", lineHeight: 1.7 }}>
                            <div style={{ fontWeight: 600 }}>{order.shipping_name}</div>
                            <div>{order.shipping_line1}</div>
                            <div>{order.shipping_city}{order.shipping_state ? ", " + order.shipping_state : ""} – {order.shipping_pincode}</div>
                            {order.shipping_phone && <div>📞 {order.shipping_phone}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AccountSection>
  );
}
