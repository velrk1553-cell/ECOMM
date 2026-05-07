import { useEffect, useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import type { ApiAddress } from "@/services/api";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal","Andaman & Nicobar Islands","Chandigarh",
  "Dadra & Nagar Haveli and Daman & Diu","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];

const EMPTY_FORM = {
  full_name: "", phone: "", line1: "", line2: "",
  city: "", state: "", pincode: "", country: "India",
  label: "Home", is_default: 0,
};

const fieldStyle: React.CSSProperties = {
  marginBottom: 16,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  border: "1px solid #e2e8f0",
  borderRadius: 10,
  fontSize: 14,
  color: "#334155",
  background: "#fff",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  fontSize: 13,
  color: "#475569",
  marginBottom: 6,
};

export default function AccountAddresses() {
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ ...EMPTY_FORM });
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [deleting, setDeleting]   = useState<number | null>(null);

  useEffect(() => {
    userAPI.getAddresses()
      .then((res) => setAddresses(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function field(key: keyof typeof form, value: string | number) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.full_name.trim()) return setError("Full name is required.");
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim()))
      return setError("Enter a valid 10-digit phone number.");
    if (!form.line1.trim()) return setError("Address line 1 is required.");
    if (!form.city.trim()) return setError("City is required.");
    if (!form.state) return setError("State is required.");
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim()))
      return setError("Enter a valid 6-digit PIN code.");

    setSaving(true);
    try {
      const res = await userAPI.saveAddress(form);
      const saved = (res.data as { data?: { addresses: ApiAddress[] } }).data;
      if (saved?.addresses) setAddresses(saved.addresses);
      setShowForm(false);
      setForm({ ...EMPTY_FORM });
    } catch {
      setError("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    setDeleting(id);
    try {
      const res = await userAPI.deleteAddress(id);
      const d = (res.data as { data?: { addresses: ApiAddress[] } }).data;
      if (d?.addresses) setAddresses(d.addresses);
      else setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch { /* silent */ }
    finally { setDeleting(null); }
  }

  return (
    <AccountSection title="My Address">
      <div className="account-my_address">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-semibold mb-0">My Addresses</h5>
          {!showForm && (
            <button
              type="button"
              className="tf-btn animate-btn btn-sm"
              onClick={() => { setShowForm(true); setError(null); setForm({ ...EMPTY_FORM }); }}
            >
              + Add New Address
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-5 p-4 rounded-3" style={{ border: "1px solid #e2e8f0", background: "#fafafa" }}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold m-0" style={{ color: "#0f172a" }}>New Address</h6>
              <button type="button" className="btn-close" onClick={() => setShowForm(false)} />
            </div>

            {error && (
              <div className="alert alert-danger py-2 px-3 fs-14" style={{ borderRadius: 10, marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSave} noValidate>
              {/* Label */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Address Label <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  style={inputStyle}
                  value={form.label}
                  onChange={(e) => field("label", e.target.value)}
                  placeholder="e.g. Home, Office, Gym"
                  required
                />
              </div>

              {/* Name + Phone */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>Recipient Name <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    style={inputStyle}
                    value={form.full_name}
                    onChange={(e) => field("full_name", e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    style={inputStyle}
                    value={form.phone}
                    maxLength={10}
                    onChange={(e) => field("phone", e.target.value.replace(/\D/g, ""))}
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>

              {/* Address Line 1 */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Address Line 1 <span style={{ color: "#ef4444" }}>*</span></label>
                <input
                  style={inputStyle}
                  value={form.line1}
                  onChange={(e) => field("line1", e.target.value)}
                  placeholder="House / Flat / Block, Street"
                  required
                />
              </div>

              {/* Address Line 2 */}
              <div style={fieldStyle}>
                <label style={labelStyle}>Address Line 2 <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span></label>
                <input
                  style={inputStyle}
                  value={form.line2}
                  onChange={(e) => field("line2", e.target.value)}
                  placeholder="Area / Colony / Sector / Landmark"
                />
              </div>

              {/* City + State + PIN */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div>
                  <label style={labelStyle}>City <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    style={inputStyle}
                    value={form.city}
                    onChange={(e) => field("city", e.target.value)}
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <label style={labelStyle}>State <span style={{ color: "#ef4444" }}>*</span></label>
                  <select
                    style={{ ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 7L11 1' stroke='%2364748B' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 36 }}
                    value={form.state}
                    onChange={(e) => field("state", e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>PIN Code <span style={{ color: "#ef4444" }}>*</span></label>
                  <input
                    style={inputStyle}
                    value={form.pincode}
                    maxLength={6}
                    onChange={(e) => field("pincode", e.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit PIN"
                    required
                  />
                </div>
              </div>

              {/* Default checkbox */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#334155" }}>
                  <input
                    type="checkbox"
                    checked={form.is_default === 1}
                    onChange={(e) => field("is_default", e.target.checked ? 1 : 0)}
                    style={{ width: 16, height: 16, accentColor: "#0f172a" }}
                  />
                  Set as my primary delivery address
                </label>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" className="tf-btn btn-sm animate-btn" disabled={saving}>
                  {saving ? "Saving…" : "Save Address"}
                </button>
                <button
                  type="button"
                  className="tf-btn btn-sm"
                  style={{ background: "transparent", border: "1px solid #e2e8f0", color: "#64748b" }}
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-dark" role="status" /></div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-5 rounded-3" style={{ background: "#f8fafc", border: "1px dashed #e2e8f0" }}>
            <div style={{ fontSize: 48 }}>📍</div>
            <p className="fw-bold mt-3 mb-1">No saved addresses</p>
            <p className="text-muted mb-4 fs-14">Add an address to speed up your checkout process.</p>
            {!showForm && (
              <button type="button" className="tf-btn animate-btn btn-sm" onClick={() => setShowForm(true)}>
                Add Address
              </button>
            )}
          </div>
        ) : (
          <div className="row g-3">
            {addresses.map((addr) => (
              <div key={addr.id} className="col-md-6">
                <div
                  className="p-4 rounded-3 h-100"
                  style={{
                    border: `2px solid ${Number(addr.is_default) === 1 ? "#0f172a" : "#e2e8f0"}`,
                    background: Number(addr.is_default) === 1 ? "#f8fafc" : "#fff",
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span style={{ fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: ".5px", color: "#475569" }}>
                      📍 {addr.label}
                    </span>
                    {Number(addr.is_default) === 1 && (
                      <span style={{ background: "#0f172a", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 6 }}>{addr.full_name}</div>
                  <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                    {addr.city}, {addr.state} – {addr.pincode}<br />
                    📞 {addr.phone}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <button
                      type="button"
                      style={{ background: "none", border: "none", color: "#ef4444", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0 }}
                      onClick={() => handleDelete(addr.id)}
                      disabled={deleting === addr.id}
                    >
                      {deleting === addr.id ? "Removing…" : "Remove"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountSection>
  );
}
