import { useEffect, useState, useCallback } from "react";
import { productsAPI, categoriesAPI, bannersAPI, testimonialsAPI, siteSettingsAPI } from "@/services/api";
import type { ApiProduct, ApiCategory, ApiBanner, ApiTestimonial, ApiSiteSettings, ProductFilters } from "@/services/api";

// ── useProducts ───────────────────────────────────────────────────────────────

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsAPI.getAll(filters);
      const d = res.data.data;
      setProducts(d.products ?? []);
      setTotal(d.total ?? 0);
      setTotalPages(d.total_pages ?? 1);
    } catch {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return { products, total, totalPages, loading, error, refetch: fetch };
}

// ── useProduct ────────────────────────────────────────────────────────────────

export function useProduct(slug: string) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productsAPI.getOne(slug)
      .then((res) => setProduct(res.data.data))
      .catch(() => setError("Product not found."))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}

// ── useNavProducts — products flagged "Show in Navbar Menu" ──────────────────

export function useCollectionBanners() {
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bannersAPI.getCollection()
      .then((res) => setBanners(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { banners, loading };
}

export function useSpecialProducts(limit = 10) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    productsAPI.getAll({ special_product: 1, limit })
      .then((res) => setProducts(res.data.data.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [limit]);

  return { products, loading };
}

export function useNavProducts(limit = 4) {
  const [products, setProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    productsAPI.getAll({ nav_featured: 1, limit })
      .then((res) => setProducts(res.data.data.products ?? []))
      .catch(() => {});
  }, [limit]);

  return products;
}

// ── useCategories ─────────────────────────────────────────────────────────────

export function useCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoriesAPI.getAll()
      .then((res) => setCategories(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}

// ── useBanners ────────────────────────────────────────────────────────────────

export function useBanners() {
  const [banners, setBanners] = useState<ApiBanner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bannersAPI.getAll()
      .then((res) => setBanners(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { banners, loading };
}

// ── apiImageUrl ───────────────────────────────────────────────────────────────
/** Convert a backend thumbnail path like "images/products/..." to a full proxied URL. */
export function apiImageUrl(path?: string | null): string {
  if (!path) return "/assets/images/product/product-placeholder.jpg";
  if (path.startsWith("http")) return path;
  // Encode each path segment so filenames with spaces/brackets work
  const encoded = path.split("/").map(encodeURIComponent).join("/");
  return `/ecomm/${encoded}`;
}

// ── useTestimonials ───────────────────────────────────────────────────────────

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<ApiTestimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testimonialsAPI.getAll()
      .then((res) => setTestimonials(res.data.data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { testimonials, loading };
}

// ── useSiteSettings ───────────────────────────────────────────────────────────

export function useSiteSettings() {
  const [settings, setSettings] = useState<ApiSiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    siteSettingsAPI.get()
      .then((res) => setSettings(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
}

/** Map an ApiProduct to the ProductCardItem shape used by existing UI components. */
export function toProductCard(p: ApiProduct) {
  return {
    id: p.id,
    slug: p.slug,
    img: apiImageUrl(p.thumbnail),
    imgHover: p.images?.[1] ? apiImageUrl(p.images[1].image) : apiImageUrl(p.thumbnail),
    name: p.name,
    subtitle: p.subtitle,
    model_name: p.model_name,
    price: Number(p.sale_price ?? p.price),
    priceOld: p.sale_price ? Number(p.price) : undefined,
    badge: p.sale_price
      ? `-${Math.round(((p.price - p.sale_price) / p.price) * 100)}%`
      : (p.featured ? "NEW" : undefined),
    category: p.category_name,
    brand_name: p.brand_name,
    listing_status: p.listing_status,
    avg_rating: p.avg_rating ?? 0,
    review_count: p.review_count ?? 0,
    total_sold: p.total_sold ?? 0,
    rating: Math.round(p.avg_rating ?? 0),
    reviewsText: `(${p.review_count ?? 0} reviews)`,
    inStock: (p.stock ?? 0) > 0,
    isStockOut: (p.stock ?? 0) === 0,
    sku: p.sku,
    ean: p.ean,
    description: p.description ?? "",
    short_desc:  p.short_desc ?? "",
    features: p.features,
    category_attributes: p.category_attributes,
    videos: p.videos,
    filterBrands: p.brand_name ? [p.brand_name] : [],
    filterCategory: p.category_name ? [p.category_name] : [],
    filterColor: p.color ? [p.color] : [],
    // sizes: API may return a comma string (list) or parsed array (single) — normalise
    filterSizes: Array.isArray(p.sizes)
      ? p.sizes
      : (typeof (p.sizes as unknown) === "string" && p.sizes ? (p.sizes as unknown as string).split(",").map((s: string) => s.trim()) : []),
    sizes: (() => {
      if (Array.isArray(p.sizes)) return p.sizes.filter(Boolean);
      if (typeof (p.sizes as unknown) === "string" && p.sizes) return (p.sizes as unknown as string).split(",").map((s: string) => s.trim()).filter(Boolean);
      return undefined;
    })(),
    // Build color swatches — colors_json may be parsed array or raw JSON string
    colors: (() => {
      const thumb = apiImageUrl(p.thumbnail);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let cj: any[] | null = null;
      if (Array.isArray(p.colors_json) && p.colors_json.length > 0) {
        cj = p.colors_json;
      } else if (typeof (p as { colors_json?: unknown }).colors_json === "string") {
        try { cj = JSON.parse((p as unknown as { colors_json: string }).colors_json); } catch { cj = null; }
      }
      if (cj && cj.length > 0) {
        return cj.map((c: { name: string; hex?: string; image?: string }) => ({
          label: c.name,
          swatchClass: c.hex ? "" : "bg-gray",
          img: c.image ? apiImageUrl(c.image) : thumb,
        }));
      }
      const swatches = [];
      if (p.color) swatches.push({ label: p.color, swatchClass: "bg-gray", img: thumb });
      if (p.color2) swatches.push({ label: p.color2, swatchClass: "bg-gray", img: thumb });
      return swatches.length > 0 ? swatches : undefined;
    })(),
    tags: p.tags ? p.tags.split(",").map((t) => t.trim()) : [],
    cardVariant: "" as const,
    services: ["Free Delivery"],
    // Procurement / fulfillment
    min_order_qty: p.min_order_qty ?? 1,
    procurement_type: p.procurement_type,
    procurement_sla: p.procurement_sla,
    return_policy: p.return_policy,
    shipping_info: p.shipping_info,
    // Packaging
    weight: p.weight,
    package_length: p.package_length,
    package_breadth: p.package_breadth,
    package_height: p.package_height,
    hsn_code: p.hsn_code,
    tax_code: p.tax_code,
    manufacturer_name: p.manufacturer_name,
    manufacturer_address: p.manufacturer_address,
    style_code: p.style_code,
    // Fashion attributes
    color: p.color,
    color_hex: p.color_hex,
    color2: p.color2,
    brand_color: p.brand_color,
    pattern: p.pattern,
    fit_type: p.fit_type,
    neck_type: p.neck_type,
    sleeve_length: p.sleeve_length,
    length_type: p.length_type,
    pack_of: p.pack_of ?? 1,
    pattern_type: p.pattern_type,
    pattern_coverage: p.pattern_coverage,
    ornamentation: p.ornamentation,
    // Saree extras
    saree_type: p.saree_type,
    fabric: p.fabric,
    occasion: p.occasion,
    work_type: p.work_type,
    wash_care: p.wash_care,
    origin_state: p.origin_state,
    weave_type: p.weave_type,
    zari_type: p.zari_type,
    suitable_for: p.suitable_for,
  };
}
