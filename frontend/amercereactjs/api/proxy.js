export const config = { runtime: "edge" };

const BACKEND = "https://superfinelabels.in/ecomm/shopkart-api";

export default async function handler(req) {
  const url = new URL(req.url);

  // Strip the leading /api prefix to get the backend path
  const backendPath = url.pathname.replace(/^\/api/, "") + url.search;
  const target = BACKEND + backendPath;

  // Forward real client IP so Hostinger rate-limits per user, not per Vercel IP
  const clientIp =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const headers = new Headers(req.headers);
  headers.set("X-Forwarded-For", clientIp);
  headers.set("X-Real-IP", clientIp);
  // Remove host header so it doesn't confuse the backend
  headers.delete("host");

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: upstream.headers,
  });
}
