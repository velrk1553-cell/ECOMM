import { useState } from "react";
import { AccountSection } from "@/components/account/AccountSection";
import { userAPI } from "@/services/api";

export default function AccountChangePassword() {
  const [current,  setCurrent]  = useState("");
  const [next,     setNext]     = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (!current.trim()) return setMsg({ type: "error", text: "Current password is required." });
    if (next.length < 6)  return setMsg({ type: "error", text: "New password must be at least 6 characters." });
    if (next !== confirm)  return setMsg({ type: "error", text: "Passwords do not match." });

    setSaving(true);
    try {
      await userAPI.changePassword({
        current_password:  current,
        new_password:      next,
        confirm_password:  confirm,
      });
      setMsg({ type: "success", text: "Password changed successfully." });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err: unknown) {
      const apiMsg = (err as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setMsg({ type: "error", text: apiMsg ?? "Failed to change password. Check your current password." });
    } finally {
      setSaving(false);
    }
  }

  const strengthScore = (() => {
    if (!next) return 0;
    let s = 0;
    if (next.length >= 6)  s++;
    if (next.length >= 10) s++;
    if (/[A-Z]/.test(next)) s++;
    if (/[0-9]/.test(next)) s++;
    if (/[^A-Za-z0-9]/.test(next)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Very strong"][strengthScore];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#16a34a"][strengthScore];

  return (
    <AccountSection title="">
      {/* Header */}
      <div className="mb-24">
        <h5 className="fw-semibold mb-4">Change Password</h5>
        <p className="mb-0" style={{ fontSize: 13, color: "#6b7280" }}>
          Keep your account secure with a strong password
        </p>
      </div>

      {/* Security tips card */}
      <div className="rounded-3 p-16 mb-24"
        style={{ background: "#eff6ff", border: "1px solid #bfdbfe" }}>
        <p className="fw-semibold mb-8" style={{ fontSize: 13, color: "#1e40af" }}>
          🔒 Password tips
        </p>
        <ul className="mb-0" style={{ fontSize: 12, color: "#1e40af", paddingLeft: 16, lineHeight: 1.8 }}>
          <li>Use at least 8 characters</li>
          <li>Mix uppercase, lowercase, numbers and symbols</li>
          <li>Avoid using your name or phone number</li>
          <li>Don't reuse passwords from other sites</li>
        </ul>
      </div>

      {/* Alert */}
      {msg && (
        <div className="rounded-2 px-14 py-10 mb-20"
          style={{
            background: msg.type === "success" ? "#f0fdf4" : "#fef2f2",
            color: msg.type === "success" ? "#166534" : "#991b1b",
            border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            fontSize: 13,
          }}>
          {msg.type === "success" ? "✓ " : "✕ "}{msg.text}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-3 p-20 mb-20" style={{ border: "1px solid #e5e7eb", background: "white" }}>

          {/* Current password */}
          <div className="mb-16">
            <label className="fw-medium mb-6 d-block" style={{ fontSize: 13 }}>
              Current Password <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className="position-relative">
              <input
                className="form-control pe-40"
                type={showPw ? "text" : "password"}
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Enter current password"
                required
              />
              <button type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#6b7280", fontSize: 16,
                }}>
                {showPw ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="mb-8">
            <label className="fw-medium mb-6 d-block" style={{ fontSize: 13 }}>
              New Password <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <div className="position-relative">
              <input
                className="form-control pe-40"
                type={showPw ? "text" : "password"}
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>

          {/* Strength meter */}
          {next.length > 0 && (
            <div className="mb-16">
              <div className="d-flex gap-4 mb-4">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} style={{
                    flex: 1, height: 4, borderRadius: 2,
                    background: n <= strengthScore ? strengthColor : "#e5e7eb",
                    transition: "background 0.2s",
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: strengthColor, fontWeight: 600 }}>{strengthLabel}</span>
            </div>
          )}

          {/* Confirm password */}
          <div>
            <label className="fw-medium mb-6 d-block" style={{ fontSize: 13 }}>
              Confirm New Password <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              className="form-control"
              type={showPw ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              required
            />
            {confirm.length > 0 && (
              <p className="mt-4" style={{
                fontSize: 11,
                color: next === confirm ? "#16a34a" : "#dc2626",
              }}>
                {next === confirm ? "✓ Passwords match" : "✕ Passwords don't match"}
              </p>
            )}
          </div>
        </div>

        <button type="submit" className="tf-btn animate-btn" disabled={saving}>
          {saving ? "Updating…" : "Update Password"}
        </button>
      </form>
    </AccountSection>
  );
}
