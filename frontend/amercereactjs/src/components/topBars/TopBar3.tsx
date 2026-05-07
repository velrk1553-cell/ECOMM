import { useSiteSettings } from "@/hooks/useApi";

export default function TopBar3() {
  const { settings } = useSiteSettings();
  
  if (settings && settings.top_bar_enabled === false) return null;

  const text = settings?.top_bar_text || "20% Off – Auto Applied at Checkout – Limited Time Only";

  return (
    <div className="tf-topbar topbar-s3 bg-dark">
      <div className="container-full">
        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: 36 }}>
          <p className="text-white text-line-clamp-1 text-center mb-0" style={{ fontSize: 13, letterSpacing: '0.5px' }}>
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
