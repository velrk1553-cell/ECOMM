import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "/shopkart-api";

const http = axios.create({
  baseURL: BASE,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT + guest session ID to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("sk_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  let sid = localStorage.getItem("sk_sid");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).slice(2, 11);
    localStorage.setItem("sk_sid", sid);
  }
  config.headers["X-Session-ID"] = sid;
  return config;
});

// Clear auth on 401
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("sk_token");
      localStorage.removeItem("sk_user");
    }
    return Promise.reject(err);
  },
);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  ean?: string;
  subtitle?: string;
  model_name?: string;
  price: number;
  sale_price?: number;
  stock: number;
  min_order_qty?: number;
  procurement_type?: string;
  procurement_sla?: number;
  thumbnail?: string;
  images?: { id: number; image: string; alt?: string; sort_order: number }[];
  videos?: { id: number; url: string; title?: string }[];
  description?: string;
  short_desc?: string;
  features?: string[];
  category_attributes?: Record<string, string>;
  category_id: number;
  category_name?: string;
  brand_id?: number;
  brand_name?: string;
  featured: number;
  status: string;
  listing_status?: string;
  avg_rating: number;
  review_count: number;
  total_sold: number;
  tags?: string;
  // Packaging
  weight?: number;
  package_length?: number;
  package_breadth?: number;
  package_height?: number;
  hsn_code?: string;
  tax_code?: string;
  manufacturer_name?: string;
  manufacturer_address?: string;
  style_code?: string;
  // Fashion attributes
  sizes?: string[];
  brand_color?: string;
  pattern?: string;
  fit_type?: string;
  neck_type?: string;
  sleeve_length?: string;
  length_type?: string;
  pack_of?: number;
  pattern_type?: string;
  pattern_coverage?: string;
  ornamentation?: string;
  // Saree attributes
  saree_type?: string;
  fabric?: string;
  occasion?: string;
  work_type?: string;
  color?: string;
  color_hex?: string;
  color2?: string;
  saree_length?: number;
  blouse_included?: number;
  blouse_length?: number;
  set_contains?: string;
  border_type?: string;
  transparency?: string;
  wash_care?: string;
  origin_state?: string;
  weave_type?: string;
  net_weight?: number;
  zari_type?: string;
  suitable_for?: string;
  return_policy?: string;
  shipping_info?: string;
  colors_json?: { name: string; hex?: string; image?: string }[];
  related?: ApiProduct[];
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  mega_group?: string;     // Group name for mega menu columns
  category_id?: number;   // present on subcategories
  image?: string;
  image_url?: string;
  nav_products?: Array<{
    id: number;
    name: string;
    slug: string;
    thumbnail?: string;
    thumbnail_url?: string;
    price: number;
    sale_price?: number;
  }>;
  product_count?: number;
  children?: ApiCategory[]; // subcategories nested inside
}

export interface CartItem {
  cart_id: number;
  product_id: number;
  name: string;
  price: number;
  sale_price?: number;
  thumbnail?: string;
  quantity: number;
  subtotal: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface ApiAddress {
  id: number;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: number;
  label?: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

type AuthResponse = { success: boolean; message: string; data: { token: string; user: ApiUser } };

export const authAPI = {
  login:       (data: { email: string; password: string }) =>
    http.post<AuthResponse>("/login", data),
  register:    (data: { name: string; email: string; password: string; phone?: string; address?: { line1: string; city?: string; state?: string; pincode?: string } }) =>
    http.post<AuthResponse>("/register", data),
  forgotPassword: (data: { email: string }) => http.post("/forgot-password", data),
  otpRequest:  (data: { phone: string }) =>
    http.post<{ success: boolean; message: string }>("/otp-request", data),
  otpVerify:   (data: { phone: string; otp: string }) =>
    http.post<AuthResponse>("/otp-verify", data),
};

// ── Products ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
  q?: string;
  category_id?: number | string;
  subcategory_id?: number | string;
  category_slug?: string;
  brand_id?: number | string;
  featured?: number | string;
  nav_featured?: number | string;
  special_product?: number | string;
  min_price?: number | string;
  max_price?: number | string;
  sort?: string;
  fabric?: string;
  saree_type?: string;
  occasion?: string;
  page?: number;
  limit?: number;
}

export const productsAPI = {
  getAll: (params?: ProductFilters) =>
    http.get<{ success: boolean; data: { products: ApiProduct[]; total: number; page: number; total_pages: number } }>("/products", { params }),
  getOne: (slug: string) =>
    http.get<{ success: boolean; data: ApiProduct }>(`/product/${slug}`),
  search: (q: string) =>
    http.get<{ success: boolean; data: ApiProduct[] }>("/search", { params: { q } }),
};

// ── Categories ────────────────────────────────────────────────────────────────

export const categoriesAPI = {
  getAll: () => http.get<{ success: boolean; data: ApiCategory[] }>("/categories"),
};

// ── Cart ──────────────────────────────────────────────────────────────────────

export const cartAPI = {
  get:    () =>
    http.get<{ success: boolean; data: { items: CartItem[]; summary: CartSummary } }>("/cart"),
  add:    (data: { product_id: number; quantity: number }) => http.post("/cart/add", data),
  update: (data: { product_id: number; quantity: number }) => http.post("/cart/update", data),
  remove: (data: { product_id: number }) => http.post("/cart/remove", data),
  clear:  () => http.post("/cart/clear", {}),
};

// ── Wishlist ──────────────────────────────────────────────────────────────────

export const wishlistAPI = {
  get:    () => http.get("/wishlist"),
  toggle: (data: { product_id: number }) => http.post("/wishlist/toggle", data),
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const ordersAPI = {
  checkout:    (data: object) => http.post("/checkout", data),
  getAll:      () => http.get("/orders"),
  getOne:      (id: number) => http.get(`/order/${id}`),
  cancelOrder: (id: number) => http.post(`/order/${id}/cancel`, {}),
};

// ── Payment ───────────────────────────────────────────────────────────────────

export const paymentAPI = {
  createOrder: (data: { order_id: number }) => http.post("/payment/create-order", data),
  verify:      (data: object) => http.post("/payment/verify", data),
};

// ── Promo ─────────────────────────────────────────────────────────────────────

export const promoAPI = {
  apply: (data: { code: string; order_amount: number }) => http.post("/apply-coupon", data),
};

// ── User ──────────────────────────────────────────────────────────────────────

export const userAPI = {
  profile:        () => http.get<{ success: boolean; data: ApiUser }>("/user/profile"),
  updateProfile:  (data: object) => http.put("/user/profile", data),
  dashboard:      () => http.get("/user/dashboard"),
  changePassword: (data: { current_password: string; new_password: string; confirm_password: string }) =>
    http.post("/user/change-password", data),
  getAddresses:   () => http.get<{ success: boolean; data: ApiAddress[] }>("/user/addresses"),
  saveAddress:    (data: object) => http.post("/user/addresses", data),
  deleteAddress:  (id: number) => http.delete(`/user/addresses/${id}`),
};

export interface ApiBanner {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  cta_text: string;
  cta_link: string;
  image: string;
  image_url: string;
  sort_order: number;
  status: number;
}

export const bannersAPI = {
  getAll:        () => http.get<{ success: boolean; data: ApiBanner[] }>("/banners"),
  getOffer:      () => http.get<{ success: boolean; data: ApiBanner | null }>("/offer-banner"),
  getCollection: () => http.get<{ success: boolean; data: ApiBanner[] }>("/collection-banners"),
};

// ── Testimonials ──────────────────────────────────────────────────────────────

export interface ApiTestimonial {
  id: number;
  author_name: string;
  author_title?: string;
  quote: string;
  rating: number;
  product_id?: number;
  product_name?: string;
  product_slug?: string;
  product_price?: number;
  product_sale_price?: number;
  product_thumbnail?: string;
  product_image_url?: string;
}

export const testimonialsAPI = {
  getAll: () => http.get<{ success: boolean; data: ApiTestimonial[] }>("/testimonials"),
};

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface ApiReview {
  id: number;
  rating: number;
  title?: string;
  body: string;
  user_name: string;
  created_at: string;
}

export const reviewsAPI = {
  getByProduct: (productId: number) =>
    http.get<{ success: boolean; data: ApiReview[] }>(`/product/${productId}/reviews`),
  submit: (data: { product_id: number; rating: number; title?: string; body: string }) =>
    http.post<{ success: boolean; message: string }>("/reviews", data),
};

// ── Site Settings ─────────────────────────────────────────────────────────────

export interface ApiSiteSettings {
  newsletter_popup_enabled: boolean;
  site_name?: string;
  currency_symbol?: string;
  top_bar_enabled?: boolean;
  top_bar_text?: string;
  whatsapp_enabled?: boolean;
  whatsapp_number?: string;
}

export const siteSettingsAPI = {
  get: () => http.get<{ success: boolean; data: ApiSiteSettings }>("/site-settings"),
};

export default http;
