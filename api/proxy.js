export const config = { runtime: "edge" };

const BACKEND = "https://superfinelabels.in/ecomm/shopkart-api";

// Cache fresh for 5 min; serve stale for up to 1 hour while revalidating in background.
// This means Hostinger only receives 1 background request per endpoint per 5 minutes,
// regardless of how many users are hitting the site.
const CACHE_FRESH_SECS  = 300;   // 5 minutes
const CACHE_STALE_SECS  = 3600;  // 1 hour stale-while-revalidate

const CACHEABLE_PREFIXES = [
  "/products", "/product/", "/categories", "/banners",
  "/offer-banner", "/collection-banners", "/testimonials",
  "/site-settings", "/search",
];

function isCacheable(method, path) {
  if (method !== "GET") return false;
  return CACHEABLE_PREFIXES.some((p) => path.startsWith(p));
}

// Retry once after 600 ms when Hostinger returns 429
async function fetchWithRetry(url, options) {
  const res = await fetch(url, options);
  if (res.status !== 429) return res;
  await new Promise((r) => setTimeout(r, 600));
  return fetch(url, options);
}

export default async function handler(req) {
  const url = new URL(req.url);
  const backendPath = url.pathname.replace(/^\/api/, "") + url.search;
  const target = BACKEND + backendPath;

  const clientIp =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  const headers = new Headers(req.headers);
  headers.set("X-Forwarded-For", clientIp);
  headers.set("X-Real-IP", clientIp);
  headers.delete("host");
  if (isCacheable(req.method, backendPath)) headers.delete("authorization");

  const upstream = await fetchWithRetry(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });

  const resHeaders = new Headers(upstream.headers);

  if (isCacheable(req.method, backendPath) && upstream.ok) {
    resHeaders.set(
      "Cache-Control",
      `public, s-maxage=${CACHE_FRESH_SECS}, stale-while-revalidate=${CACHE_STALE_SECS}`
    );
  } else {
    resHeaders.set("Cache-Control", "private, no-store");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}
