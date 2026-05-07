export const config = { runtime: "edge" };

const BACKEND = "https://superfinelabels.in/ecomm/shopkart-api";

// Public GET endpoints that can be cached at Vercel's CDN edge.
// First request in each window hits Hostinger; all others are served from cache.
const CACHE_SECS = 30;
const CACHEABLE_PREFIXES = [
  "/products",
  "/product/",
  "/categories",
  "/banners",
  "/offer-banner",
  "/collection-banners",
  "/testimonials",
  "/site-settings",
  "/search",
];

function isCacheable(method, path) {
  if (method !== "GET") return false;
  return CACHEABLE_PREFIXES.some((p) => path.startsWith(p));
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
  // Strip auth header for cacheable public endpoints so Vercel doesn't create
  // per-user cache keys on public data
  if (isCacheable(req.method, backendPath)) {
    headers.delete("authorization");
  }

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });

  const resHeaders = new Headers(upstream.headers);

  if (isCacheable(req.method, backendPath) && upstream.ok) {
    // Tell Vercel's CDN to cache this response at the edge
    resHeaders.set(
      "Cache-Control",
      `public, s-maxage=${CACHE_SECS}, stale-while-revalidate=${CACHE_SECS * 2}`
    );
  } else {
    // Auth-required or mutation endpoints — never cache
    resHeaders.set("Cache-Control", "private, no-store");
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: resHeaders,
  });
}
