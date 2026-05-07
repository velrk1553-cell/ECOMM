import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { reviewsAPI } from "@/services/api";
import type { ApiReview } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="d-flex align-items-center gap-4">
      {[1, 2, 3, 4, 5].map((s) => (
        <i
          key={s}
          className={`icon icon-Star${s <= rating ? "" : ""} fs-14`}
          style={{ color: s <= rating ? "#f4a234" : "#ddd" }}
          aria-hidden
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="d-flex gap-6" style={{ cursor: "pointer" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{ fontSize: 28, color: s <= (hovered || value) ? "#f4a234" : "#ccc", lineHeight: 1 }}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductReviewsLive() {
  const { id = "" } = useParams<{ id: string }>();
  const { isLoggedIn } = useAuthStore();
  const numericId = Number(id);

  const [reviews, setReviews]       = useState<ApiReview[]>([]);
  const [loadingR, setLoadingR]     = useState(true);
  const [showForm, setShowForm]     = useState(false);

  // form state
  const [rating, setRating]   = useState(5);
  const [title, setTitle]     = useState("");
  const [body, setBody]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg]   = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!numericId) return;
    setLoadingR(true);
    reviewsAPI.getByProduct(numericId)
      .then((res) => setReviews(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoadingR(false));
  }, [numericId]);

  const avg = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length * 10) / 10
    : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const res = await reviewsAPI.submit({ product_id: numericId, rating, title, body });
      setSubmitMsg({ type: "success", text: res.data.message ?? "Review submitted for approval." });
      setTitle(""); setBody(""); setRating(5); setShowForm(false);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setSubmitMsg({ type: "error", text: msg ?? "Failed to submit review." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="product-desc_review">
      {/* Summary */}
      <div className="d-flex align-items-center gap-16 mb-24">
        <div className="text-center">
          <div style={{ fontSize: 48, fontWeight: 700, lineHeight: 1 }}>{avg || "—"}</div>
          <StarDisplay rating={Math.round(avg)} />
          <div className="text-muted small mt-4">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</div>
        </div>
        <div className="ms-auto">
          {!showForm && (
            <button
              className="tf-btn animate-btn btn-sm"
              onClick={() => {
                if (!isLoggedIn) { setSubmitMsg({ type: "error", text: "Please log in to write a review." }); return; }
                setShowForm(true); setSubmitMsg(null);
              }}
            >
              Write a Review
            </button>
          )}
        </div>
      </div>

      {/* Submit message */}
      {submitMsg && (
        <div className={`alert alert-${submitMsg.type === "success" ? "success" : "danger"} py-8 px-12 mb-16 text-caption-01`}>
          {submitMsg.text}
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="box-review-form mb-24 p-20" style={{ background: "#f9f9f9", borderRadius: 8 }}>
          <h6 className="mb-16">Your Review</h6>
          <form onSubmit={handleSubmit}>
            <div className="mb-12">
              <label className="tf-lable fw-medium mb-8 d-block">Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
            <div className="mb-12">
              <input
                type="text" className="form-control"
                placeholder="Review title (optional)"
                value={title} onChange={(e) => setTitle(e.target.value)}
                style={{ borderRadius: 6, border: "1px solid #ddd", padding: "8px 12px", width: "100%" }}
              />
            </div>
            <div className="mb-16">
              <textarea
                className="form-control" rows={4} required
                placeholder="Share your experience with this saree…"
                value={body} onChange={(e) => setBody(e.target.value)}
                style={{ borderRadius: 6, border: "1px solid #ddd", padding: "8px 12px", width: "100%", resize: "vertical" }}
              />
            </div>
            <div className="d-flex gap-12">
              <button type="submit" className="tf-btn animate-btn btn-sm" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
              <button type="button" className="tf-btn btn-stroke btn-sm" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews list */}
      {loadingR ? (
        <div className="text-muted small py-20 text-center">Loading reviews…</div>
      ) : reviews.length === 0 ? (
        <div className="text-muted small py-20 text-center">
          No reviews yet. Be the first to review this saree!
        </div>
      ) : (
        <div className="list-reviews">
          {reviews.map((r) => (
            <div key={r.id} className="review-item py-16" style={{ borderBottom: "1px solid #eee" }}>
              <div className="d-flex align-items-center gap-12 mb-8">
                <div
                  className="d-flex align-items-center justify-content-center fw-bold text-white"
                  style={{ width: 40, height: 40, borderRadius: "50%", background: "#2d6a4f", fontSize: 16, flexShrink: 0 }}
                >
                  {r.user_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <div className="fw-semibold lh-24">{r.user_name ?? "Customer"}</div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </div>
                </div>
                <div className="ms-auto">
                  <StarDisplay rating={r.rating} />
                </div>
              </div>
              {r.title && <div className="fw-medium mb-4">{r.title}</div>}
              <p className="cl-text-2 text-body-1 mb-0">{r.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
