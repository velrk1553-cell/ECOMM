import { products } from "@/data/products/products";
import type { DocumentMeta } from "@/lib/metadata/document-meta";

export const AMERCE_SITE_TITLE =
  "Amerce - Multipurpose eCommerce Reactjs Template";

export const AMERCE_DEFAULT_DESCRIPTION =
  "Amerce - Multipurpose eCommerce Reactjs Template";

export function buildShopProductMetadata(
  id: string,
  pageLabel: string,
): DocumentMeta {
  const product = products.find((p) => p.id === Number(id)) || products[0];
  const title = `${product.name} | ${pageLabel} | ${AMERCE_SITE_TITLE}`;
  const rawDesc =
    product.description && product.description.trim().length > 0
      ? `${product.name} — ${product.description}`
      : `${product.name} — ${AMERCE_DEFAULT_DESCRIPTION}`;
  const description = rawDesc.slice(0, 160);
  return { title, description };
}
