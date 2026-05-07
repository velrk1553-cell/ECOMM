import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

interface AccountIconProps {
  hasText?: boolean;
}

export default function AccountIcon({ hasText = false }: AccountIconProps) {
  const { isLoggedIn, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  if (isLoggedIn) {
    return (
      <Link to="/account-page" className={`nav-icon-item link ${hasText ? "has-text" : ""}`}>
        <i className="icon icon-User" />
        {hasText && <span className="d-none d-xl-block"> {user?.name?.split(" ")[0] ?? "Account"} </span>}
      </Link>
    );
  }

  return (
    <a
      href="#sign"
      data-bs-toggle="modal"
      className={`nav-icon-item link ${hasText ? "has-text" : ""}`}
    >
      <i className="icon icon-User" />
      {hasText && <span className="d-none d-xl-block"> Login/Register </span>}
    </a>
  );
}
