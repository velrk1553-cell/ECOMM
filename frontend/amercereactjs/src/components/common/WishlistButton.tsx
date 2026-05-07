import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { Product } from "@/context/Context";

interface WishlistButtonProps {
  product?: Product;
  variant?: "default" | "button" | "toolbar";
  className?: string;
}

function openSignInModal() {
  import("bootstrap").then(({ Modal }) => {
    const el = document.getElementById("sign");
    if (el) Modal.getOrCreateInstance(el).show();
  });
}

export default function WishlistButton({
  product,
  variant = "default",
  className,
}: WishlistButtonProps) {
  const { isLoggedIn } = useAuthStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const isAdded = product ? isWishlisted(product.id) : false;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      openSignInModal();
      return;
    }
    if (product) toggle(product);
  };

  if (variant === "toolbar") {
    return (
      <Link to="/wishlist">
        <span className="toolbar-icon">
          <i className="icon icon-HeartStraight" />
        </span>
        <span className="toolbar-label">Wishlist</span>
      </Link>
    );
  }

  const baseClass =
    variant === "button"
      ? "hover-tooltip box-icon btn-add-wishlist"
      : "hover-tooltip tooltip-left box-icon";
  const activeClass = isAdded ? "active" : "";

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`tf-btn-reset ${className || baseClass} ${activeClass}`.trim()}
      suppressHydrationWarning
      aria-label={isAdded ? "Remove from Wishlist" : "Add to Wishlist"}
    >
      <span
        className={`icon ${isAdded ? "icon-trash" : "icon-heart"}`}
        aria-hidden
        suppressHydrationWarning
      />
      <span className="tooltip" suppressHydrationWarning>
        {isLoggedIn
          ? isAdded ? "Remove from Wishlist" : "Add to Wishlist"
          : "Login to save"}
      </span>
    </button>
  );
}
