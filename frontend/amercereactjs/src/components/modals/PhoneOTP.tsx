import { useRef, useState } from "react";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";

export default function PhoneOTPModal() {
  const { login } = useAuthStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  const [step, setStep]       = useState<"phone" | "otp">("phone");
  const [phone, setPhone]     = useState("");
  const [otp, setOtp]         = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint]       = useState("");

  const reset = () => {
    setStep("phone"); setPhone(""); setOtp("");
    setError(""); setHint("");
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = phone.trim().replace(/\D/g, "");
    if (p.length < 10) { setError("Enter a valid 10-digit mobile number."); return; }
    setLoading(true); setError("");
    try {
      const res = await authAPI.otpRequest({ phone: p });
      const r = res.data as { success: boolean; message: string };
      if (r.success) { setStep("otp"); setHint(r.message); }
      else setError(r.message ?? "Failed to send OTP.");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to send OTP. Check your connection.");
    } finally { setLoading(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) { setError("Enter the OTP."); return; }
    setLoading(true); setError("");
    try {
      const res = await authAPI.otpVerify({ phone: phone.trim().replace(/\D/g, ""), otp: otp.trim() });
      const r = res.data as { success: boolean; message?: string; data?: { token: string; user: ApiUser } };
      if (r.success && r.data?.token) {
        login(r.data.token, r.data.user);
        closeRef.current?.click(); // dismiss modal via hidden button
        reset();
      } else {
        setError(r.message ?? "Invalid OTP.");
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid OTP. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div className="modal fade" id="phoneOTPModal" tabIndex={-1} aria-hidden="true">
      {/* Hidden dismiss button — reliably closes modal via Bootstrap */}
      <button ref={closeRef} type="button" data-bs-dismiss="modal"
        aria-label="close" style={{ display: "none" }} />

      <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 400 }}>
        <div className="modal-content p-4">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-semibold">
              {step === "phone" ? "🔐 Login with Mobile" : "Enter OTP"}
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={reset} />
          </div>

          <div className="modal-body pt-3">
            {step === "phone" ? (
              <form onSubmit={handleRequestOTP}>
                <p className="cl-text-2 text-caption-01 mb-16">
                  Enter your WhatsApp / mobile number to receive a verification code.
                </p>
                <div className="input-group mb-12">
                  <span className="input-group-text fw-medium">+91</span>
                  <input
                    type="tel" inputMode="numeric" maxLength={10}
                    className="form-control" placeholder="10-digit mobile number"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setError(""); }}
                    required autoFocus
                  />
                </div>
                {error && <p className="text-danger text-caption-01 mb-8">{error}</p>}
                <button type="submit" className="tf-btn animate-btn w-100" disabled={loading}>
                  {loading ? "Sending…" : "Get OTP"}
                </button>
                <p className="text-center text-caption-01 cl-text-3 mt-12">
                  OTP will be sent via WhatsApp / SMS
                </p>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                {hint && <p className="text-success text-caption-01 mb-8">{hint}</p>}
                <p className="cl-text-2 text-caption-01 mb-4">
                  OTP sent to +91-{phone}
                </p>
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  className="form-control text-center fw-semibold mb-12"
                  style={{ fontSize: 24, letterSpacing: 12 }}
                  placeholder="1 2 3 4 5 6"
                  value={otp}
                  onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "")); setError(""); }}
                  required autoFocus
                />
                {error && <p className="text-danger text-caption-01 mb-8">{error}</p>}
                <button type="submit" className="tf-btn animate-btn w-100 mb-8" disabled={loading}>
                  {loading ? "Verifying…" : "Verify & Login"}
                </button>
                <button type="button" className="btn btn-link w-100 text-caption-01 p-0 cl-text-2"
                  onClick={() => { setStep("phone"); setOtp(""); setError(""); setHint(""); }}>
                  ← Change number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
