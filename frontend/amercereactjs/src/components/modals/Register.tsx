import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";

const INDIA_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan",
  "Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Delhi","Jammu and Kashmir","Ladakh","Puducherry",
];

export default function Register({
  registerModalElement,
}: {
  registerModalElement?: (el: HTMLElement | null) => void;
}) {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const nameRef     = useRef<HTMLInputElement>(null);
  const phoneRef    = useRef<HTMLInputElement>(null);
  const emailRef    = useRef<HTMLInputElement>(null);
  const passRef     = useRef<HTMLInputElement>(null);
  const confirmRef  = useRef<HTMLInputElement>(null);
  const line1Ref    = useRef<HTMLInputElement>(null);
  const cityRef     = useRef<HTMLInputElement>(null);
  const pincodeRef  = useRef<HTMLInputElement>(null);
  const [addrState, setAddrState] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const name    = nameRef.current?.value.trim() ?? "";
    const phone   = phoneRef.current?.value.trim() ?? "";
    const email   = emailRef.current?.value.trim() ?? "";
    const pass    = passRef.current?.value ?? "";
    const confirm = confirmRef.current?.value ?? "";
    const line1   = line1Ref.current?.value.trim() ?? "";
    const city    = cityRef.current?.value.trim() ?? "";
    const pincode = pincodeRef.current?.value.trim() ?? "";

    if (pass !== confirm) { setError("Passwords do not match."); return; }
    if (pass.length < 6)  { setError("Password must be at least 6 characters."); return; }
    if (pincode && !/^\d{6}$/.test(pincode)) { setError("Enter a valid 6-digit PIN code."); return; }

    setLoading(true);
    try {
      const payload: Parameters<typeof authAPI.register>[0] = {
        name, email, password: pass, phone,
      };
      if (line1) {
        payload.address = { line1, city, state: addrState, pincode };
      }
      const res = await authAPI.register(payload);
      if ((res.data as { success?: boolean }).success) {
        import("bootstrap").then(({ Modal }) => {
          const el = document.getElementById("register");
          if (el) Modal.getInstance(el)?.hide();
        });
        navigate("/account-page");
      } else {
        setError((res.data as { message?: string }).message ?? "Registration failed.");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e?.response?.data?.message ?? e?.message ?? "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      ref={registerModalElement}
      className="modal modalCentered fade modal-log"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <span className="icon-close-popup" data-bs-dismiss="modal">
            <i className="icon-X2" />
          </span>
          <div className="modal-heading text-center">
            <h3 className="title-pop mb-8">Create Account</h3>
            <p className="desc-pop cl-text-2">Be part of our growing family!</p>
          </div>
          <div className="modal-main">
            <form className="form-log" onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger py-2 px-3 mb-12 text-caption-01" role="alert">
                  {error}
                </div>
              )}
              <div className="form-content">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <fieldset className="tf-field mb-0">
                    <label className="tf-lable fw-medium">Full Name <span className="text-primary">*</span></label>
                    <input ref={nameRef} type="text" placeholder="Your full name" required />
                  </fieldset>
                  <fieldset className="tf-field mb-0">
                    <label className="tf-lable fw-medium">Phone Number <span className="text-primary">*</span></label>
                    <input ref={phoneRef} type="tel" placeholder="+91 9876543210" required />
                  </fieldset>
                </div>
                <fieldset className="tf-field">
                  <label className="tf-lable fw-medium">Email Address <span className="text-primary">*</span></label>
                  <input ref={emailRef} type="email" placeholder="your@email.com" required />
                </fieldset>

                <fieldset className="tf-field">
                  <label className="tf-lable fw-medium">Street Address / Landmark</label>
                  <input ref={line1Ref} type="text" placeholder="House No., Street, Area..." />
                </fieldset>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <fieldset className="tf-field mb-0">
                    <label className="tf-lable fw-medium">City</label>
                    <input ref={cityRef} type="text" placeholder="City" />
                  </fieldset>
                  <fieldset className="tf-field mb-0">
                    <label className="tf-lable fw-medium">State</label>
                    <select value={addrState} onChange={(e) => setAddrState(e.target.value)}
                      style={{ width: "100%", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", fontSize: 14, color: "#334155", background: "#fff" }}>
                      <option value="">Select State</option>
                      {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </fieldset>
                  <fieldset className="tf-field mb-0">
                    <label className="tf-lable fw-medium">PIN Code</label>
                    <input ref={pincodeRef} type="text" inputMode="numeric" maxLength={6} placeholder="6-digit PIN" />
                  </fieldset>
                </div>

                <fieldset className="tf-field password-wrapper" style={{ marginTop: 12 }}>
                  <label className="tf-lable fw-medium">Password <span className="text-primary">*</span></label>
                  <PasswordField inputRef={passRef} id="register-password" placeholder="Min. 6 characters" required />
                </fieldset>
                <fieldset className="tf-field password-wrapper">
                  <label className="tf-lable fw-medium">Confirm Password <span className="text-primary">*</span></label>
                  <PasswordField inputRef={confirmRef} id="register-password-confirm" placeholder="Repeat password" required />
                </fieldset>
              </div>
              <div className="group-action">
                <button type="submit" className="action-create-account tf-btn animate-btn w-100" disabled={loading}>
                  {loading ? "Creating…" : "Create Account"}
                </button>
                <a href="#sign" data-bs-toggle="modal" className="tf-btn btn-stroke">Login</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
