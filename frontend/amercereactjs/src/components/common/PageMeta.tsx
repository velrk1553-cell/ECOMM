import { useLayoutEffect } from "react";

export type PageMetaProps = {
  title: string;
  description?: string;
};

function upsertHeadMeta(
  attr: "name" | "property",
  key: string,
  content: string,
) {
  const selector =
    attr === "name" ? `meta[name="${key}"]` : `meta[property="${key}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets `document.title` and primary SEO / social tags when the route renders.
 * Use on each page (or layout) instead of Next.js `metadata` / `generateMetadata`.
 */
export default function PageMeta({ title, description = "" }: PageMetaProps) {
  useLayoutEffect(() => {
    document.title = title;
    upsertHeadMeta("name", "description", description);
    upsertHeadMeta("property", "og:title", title);
    upsertHeadMeta("property", "og:description", description);
    upsertHeadMeta("property", "og:type", "website");
    upsertHeadMeta("name", "twitter:card", "summary_large_image");
    upsertHeadMeta("name", "twitter:title", title);
    upsertHeadMeta("name", "twitter:description", description);
  }, [title, description]);

  return null;
}
