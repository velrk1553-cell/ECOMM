import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";
import "./SignIn.css";

const OTP_LENGTH = 6;

export default function SignIn({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const navigate  = useNavigate();
  const { login } = useAuthStore();

  const [tab, setTab]         = useState<"email" | "otp">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [phone, setPhone]     = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const emailRef   = useRef<HTMLInputElement>(null);
  const passRef    = useRef<HTMLInputElement>(null);
  const phoneRef   = useRef<HTMLInputElement>(null);
  const otpRefs    = useRef<(HTMLInputElement | null)[]>([]);

  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  function closeModal() {
    import("bootstrap").then(({ Modal }) => {
      const el = document.getElementById("sign");
      if (el) Modal.getInstance(el)?.hide();
    });
  }

  function switchTab(t: "email" | "otp") {
    setTab(t);
    setOtpSent(false);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setError("");
  }

  /* ── OTP digit input handling ── */
  const handleOtpDigit = useCallback((idx: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < OTP_LENGTH - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
  }, []);

  const handleOtpKeyDown = useCallback((idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  }, [otpDigits]);

  const handleOtpPaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtpDigits(next);
    const lastFilled = Math.min(pasted.length, OTP_LENGTH - 1);
    otpRefs.current[lastFilled]?.focus();
  }, []);

  const otpValue = otpDigits.join("");

  /* ── Email login ── */
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const email    = emailRef.current?.value.trim() ?? "";
    const password = passRef.current?.value ?? "";
    if (!email || !password) return;
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      closeModal();
      navigate("/account-page");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP request ── */
  async function handleOtpRequest(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const phoneVal = phoneRef.current?.value.trim() ?? "";
    if (!phoneVal) return;
    setLoading(true);
    try {
      await authAPI.otpRequest({ phone: phoneVal });
      setPhone(phoneVal);
      setOtpSent(true);
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  }

  /* ── OTP verify ── */
  async function handleOtpVerify(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!phone || otpValue.length < OTP_LENGTH) {
      setError(`Please enter all ${OTP_LENGTH} digits.`);
      return;
    }
    setLoading(true);
    try {
      const res = await authAPI.otpVerify({ phone, otp: otpValue });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      closeModal();
      const hasRealEmail = user.email && !user.email.startsWith("ph_");
      navigate(hasRealEmail ? "/account-page" : "/account-setting");
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade signin-modal"
      id="sign"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">

          {/* ── Brand header ── */}
          <div className="signin-brand">
            <button
              type="button"
              className="signin-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="signin-brand-icon">🛍️</div>
            <h3>Welcome Back</h3>
            <p>Sign in to continue shopping</p>
          </div>

          {/* ── Form body ── */}
          <div className="signin-body">

            {/* Tab switcher */}
            <div className="signin-tabs">
              <button
                type="button"
                className={`signin-tab ${tab === "email" ? "active" : ""}`}
                onClick={() => switchTab("email")}
              >
                ✉️ Email
              </button>
              <button
                type="button"
                className={`signin-tab ${tab === "otp" ? "active" : ""}`}
                onClick={() => switchTab("otp")}
              >
                📱 OTP
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="signin-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* ── Email form ── */}
            {tab === "email" && (
              <form onSubmit={handleEmailSubmit} noValidate>
                <div className="signin-field">
                  <label className="signin-label" htmlFor="si-email">Email Address</label>
                  <input
                    ref={emailRef}
                    id="si-email"
                    type="email"
                    className="signin-input"
                    placeholder="your@email.com"
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="signin-field">
                  <label className="signin-label" htmlFor="si-pass">Password</label>
                  <PasswordField
                    inputRef={passRef}
                    id="si-pass"
                    placeholder="Enter your password"
                    required
                    className="signin-input"
                  />
                </div>

                <div className="signin-row">
                  <label className="signin-remember">
                    <input type="checkbox" id="si-remember" />
                    Remember me
                  </label>
                  <a href="#modalForgot" data-bs-toggle="modal" className="signin-forgot">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  className={`signin-btn ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? <><span className="signin-spinner" /> Signing in…</> : <>Sign In →</>}
                </button>

                <div className="signin-divider">or</div>

                <a href="#register" data-bs-toggle="modal" className="signin-register">
                  Create New Account
                </a>
              </form>
            )}

            {/* ── OTP: phone entry ── */}
            {tab === "otp" && !otpSent && (
              <form onSubmit={handleOtpRequest} noValidate>
                <div className="signin-field">
                  <label className="signin-label" htmlFor="si-phone">Mobile Number</label>
                  <div className="signin-phone-wrap">
                    <span className="signin-phone-prefix">🇮🇳 +91</span>
                    <input
                      ref={phoneRef}
                      id="si-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="signin-phone-input"
                      placeholder="10-digit mobile number"
                      autoComplete="tel"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className={`signin-btn ${loading ? "loading" : ""}`}
                  disabled={loading}
                >
                  {loading ? <><span className="signin-spinner" /> Sending OTP…</> : <>Send OTP →</>}
                </button>

                <div className="signin-divider">or</div>

                <a href="#register" data-bs-toggle="modal" className="signin-register">
                  Create New Account
                </a>
              </form>
            )}

            {/* ── OTP: digit entry ── */}
            {tab === "otp" && otpSent && (
              <form onSubmit={handleOtpVerify} noValidate>
                <div className="otp-sent-info">
                  <p>OTP sent to <strong>+91-{phone}</strong></p>
                  <p style={{ fontSize: 12, color: "#94a3b8" }}>Enter the 6-digit code below</p>
                </div>

                <div className="otp-boxes" onPaste={handleOtpPaste}>
                  {otpDigits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      className={`otp-box ${d ? "filled" : ""}`}
                      onChange={(e) => handleOtpDigit(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  className={`signin-btn ${loading ? "loading" : ""}`}
                  disabled={loading || otpValue.length < OTP_LENGTH}
                >
                  {loading ? <><span className="signin-spinner" /> Verifying…</> : <>Verify & Sign In →</>}
                </button>

                <div className="signin-resend">
                  Didn't receive it?{" "}
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill("")); setError(""); }}
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="button"
                  className="signin-back"
                  onClick={() => { setOtpSent(false); setOtpDigits(Array(OTP_LENGTH).fill("")); setError(""); }}
                >
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
