import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { PasswordField } from "@/components/forms/PasswordField";
import { authAPI } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import type { ApiUser } from "@/services/api";

function Log() {
  const navigate             = useNavigate();
  const location             = useLocation();
  const { login, isLoggedIn } = useAuthStore();

  // Honour ?redirect= so e.g. /login?redirect=/checkout goes back there after login
  const redirectTo = new URLSearchParams(location.search).get("redirect") || "/account-page";

  useEffect(() => {
    if (isLoggedIn) navigate(redirectTo, { replace: true });
  }, [isLoggedIn]);

  const emailRef  = useRef<HTMLInputElement>(null);
  const passRef   = useRef<HTMLInputElement>(null);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authAPI.login({
        email: emailRef.current?.value.trim() ?? "",
        password: passRef.current?.value ?? "",
      });
      const { token, user } = (res.data as { success: boolean; data: { token: string; user: ApiUser } }).data;
      login(token, user);
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="section-log flat-spacing">
        <div className="container">
          <div className="row align-items-center gy-30">
            <div className="col-md-5 ms-auto">
              <div className="col-left">
                <h4 className="title mb-20">Login</h4>
                {redirectTo !== "/account-page" && (
                  <p className="cl-text-2 mb-16 text-caption-01">
                    Please sign in to continue.
                  </p>
                )}
                {error && (
                  <div className="alert alert-danger py-2 px-3 mb-16 text-caption-01" role="alert">
                    {error}
                  </div>
                )}
                <form className="form-log" onSubmit={handleSubmit}>
                  <div className="form-content">
                    <fieldset className="tf-field">
                      <label htmlFor="user-name-log-2" className="tf-lable fw-medium">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <input
                        ref={emailRef}
                        type="email"
                        id="user-name-log-2"
                        placeholder="your@email.com"
                        required
                      />
                    </fieldset>
                    <fieldset className="tf-field password-wrapper">
                      <label htmlFor="pass-log-2" className="tf-lable fw-medium">
                        Password <span className="text-primary">*</span>
                      </label>
                      <PasswordField inputRef={passRef} id="pass-log-2" placeholder="Password" required />
                    </fieldset>
                    <fieldset className="field-bottom">
                      <div className="checkbox-wrap">
                        <input className="tf-check style-2" type="checkbox" id="remember-2" />
                        <label htmlFor="remember-2"> Remember me </label>
                      </div>
                      <Link to="/forget-password" className="link text-decoration-underline">
                        <span className="text-caption-01 fw-semibold">Forgot Password?</span>
                      </Link>
                    </fieldset>
                  </div>
                  <button type="submit" className="tf-btn animate-btn" disabled={loading}>
                    {loading ? "Signing in…" : "Login"}
                  </button>
                </form>
              </div>
            </div>
            <div className="col-md-5 me-auto">
              <div className="col-right">
                <h4 className="mb-8">New Customer</h4>
                <p className="cl-text-2 mb-20">
                  Be part of our growing family of new customers! Join us today
                  and unlock a world of exclusive benefits, offers, and
                  personalized experiences.
                </p>
                <Link to={`/register`} className="tf-btn animate-btn">
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Log;
