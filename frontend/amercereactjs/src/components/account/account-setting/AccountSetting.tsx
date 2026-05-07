import { useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function AccountSetting() {
  const { user, setUser } = useAuthStore();

  const [name,  setName]  = useState(user?.name  ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const currentEmail = user?.email ?? "";
  const isPhoneOnly = currentEmail.startsWith("ph_") || currentEmail.includes("@shopkart.app");
  const [email, setEmail] = useState(isPhoneOnly ? "" : currentEmail);

  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setMsg({ type: "error", text: "Full name is required." });
    setMsg(null);
    setSaving(true);
    try {
      const payload: Record<string, string> = { name: name.trim(), phone: phone.trim() };
      if (isPhoneOnly && email.trim()) payload.email = email.trim();
      const res = await userAPI.updateProfile(payload);
      const updated = (res.data as { data?: typeof user }).data;
      if (updated) setUser(updated as NonNullable<typeof user>);
      setMsg({ type: "success", text: "Profile updated successfully." });
    } catch (err: unknown) {
      const msg2 = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setMsg({ type: "error", text: msg2 ?? "Failed to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <AccountSection title="Account Details">
      <div className="account-details">
        {/* Prompt when user has no real email */}
        {isPhoneOnly && (
          <div className="alert alert-warning py-2 px-3 mb-4 fs-14" style={{ borderRadius: 10 }}>
            📧 Your account doesn't have an email address yet. Add one below to enable email login.
          </div>
        )}

        {msg && (
          <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-danger'} py-2 px-3 mb-4 fs-14`}>
            {msg.type === 'success' ? '✓ ' : '✕ '}{msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-12 mb-4">
              <fieldset className="tf-field">
                <label className="fw-medium mb-1 fs-13">Full Name*</label>
                <input
                  className="form-control"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </fieldset>
            </div>
            <div className="col-12 mb-4">
              <fieldset className="tf-field">
                <label className="fw-medium mb-1 fs-13">Phone Number</label>
                <input
                  className="form-control"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                />
              </fieldset>
            </div>
            <div className="col-12 mb-4">
              <fieldset className="tf-field">
                <label className="fw-medium mb-1 fs-13">
                  Email Address {isPhoneOnly ? <span className="text-muted fw-normal">(optional — enables email login)</span> : "(Read-only)"}
                </label>
                {isPhoneOnly ? (
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                ) : (
                  <input
                    className="form-control"
                    type="email"
                    value={currentEmail}
                    readOnly
                    style={{ background: "var(--bg)", cursor: "not-allowed" }}
                  />
                )}
              </fieldset>
              {!isPhoneOnly && (
                <p className="mt-2 text-muted" style={{ fontSize: 12 }}>Email address cannot be modified.</p>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button type="submit" className="tf-btn btn-sm animate-btn" disabled={saving}>
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </AccountSection>
  );
}
