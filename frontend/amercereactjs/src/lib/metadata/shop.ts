import type { DocumentMeta } from "@/lib/metadata/document-meta";
import {
  AMERCE_DEFAULT_DESCRIPTION,
  AMERCE_SITE_TITLE,
} from "@/lib/metadata/shop-product";

/** Default copy for Tops & Shirts–style shop listing routes */
export const SHOP_LISTING_DESCRIPTION =
  "Browse the Tops & Shirts collection with filters, sorting, and grid or list view.";

/** Title + description for shop listing / account-style routes (full document title). */
export function shopRouteMetadata(
  titleSegment: string,
  description: string = AMERCE_DEFAULT_DESCRIPTION,
): DocumentMeta {
  const desc = description.trim().slice(0, 160);
  return {
    title: `${titleSegment} | ${AMERCE_SITE_TITLE}`,
    description: desc,
  };
}
