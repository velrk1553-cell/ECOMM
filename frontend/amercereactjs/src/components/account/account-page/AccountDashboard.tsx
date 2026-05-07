import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { formatPrice } from "@/utils/formatPrice";

interface DashStats {
  total_orders: number;
  pending: number;
  delivered: number;
  total_spent: number;
  addresses: number;
}

interface OrderItem {
  product_name: string;
  quantity: number;
  subtotal: number;
  thumbnail?: string;
}

interface RecentOrder {
  id: number;
  order_number?: string;
  status: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
}

const STAT_CARDS = [
  { key: "total_orders", label: "Total Orders",   icon: "📦", color: "#dbeafe", text: "#1e40af" },
  { key: "pending",      label: "Pending",         icon: "⏳", color: "#fef3c7", text: "#92400e" },
  { key: "delivered",    label: "Delivered",       icon: "✅", color: "#dcfce7", text: "#166534" },
  { key: "addresses",    label: "Saved Addresses", icon: "📍", color: "#f3e8ff", text: "#7c3aed" },
];

export default function AccountDashboard() {
  useAuthStore();
  const [stats, setStats]   = useState<DashStats | null>(null);
  const [recent, setRecent] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.dashboard()
      .then((res) => {
        const d = (res.data as { data?: { stats: DashStats; recent_orders: RecentOrder[] } }).data;
        if (d) { setStats(d.stats); setRecent(d.recent_orders); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <AccountSection title="Dashboard">
      <div className="my-account-dashboard">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-dark" role="status" /></div>
        ) : (
          <>
            <div className="row g-4 acount-order_stats">
              {STAT_CARDS.map((c) => (
                <div className="col-6 col-md-3" key={c.key}>
                  <div className="order-box">
                    <div className="order_content">
                      <div className="info__label">{c.label}</div>
                      <h4 className="fw-bold">
                        {c.key === "total_orders" ? stats?.total_orders ?? 0
                          : c.key === "pending"   ? stats?.pending ?? 0
                          : c.key === "delivered" ? stats?.delivered ?? 0
                          : stats?.addresses ?? 0}
                      </h4>
                    </div>
                    <div className="order_icon">
                      <i className={`icon ${c.icon}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="account-my_recent mt-5">
              <h5 className="fw-bold mb-4">Recent Orders</h5>
              {recent.length === 0 ? (
                <div className="text-center py-5 rounded-3" style={{ background: "var(--bg)", border: "1px dashed var(--line)" }}>
                  <p className="mb-0">No recent orders found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-my_recent">
                    <thead>
                      <tr>
                        <th>Order</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((order) => {
                        const stClass = order.status === "delivered" ? "stt-completed"
                                      : order.status === "cancelled" ? "stt-canceled"
                                      : order.status === "shipped"   ? "stt-delivery"
                                      : "stt-pending";
                        const stLabel = order.status.charAt(0).toUpperCase() + order.status.slice(1);
                        return (
                          <tr key={order.id}>
                            <td>#{order.order_number ?? order.id}</td>
                            <td>{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</td>
                            <td>
                              <span className={`tb-order_status ${stClass}`}>
                                {stLabel}
                              </span>
                            </td>
                            <td>{formatPrice(order.total)}</td>
                            <td>
                              <Link to="/account-orders" className="tf-btn-line-2 link">View</Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AccountSection>
  );
}
