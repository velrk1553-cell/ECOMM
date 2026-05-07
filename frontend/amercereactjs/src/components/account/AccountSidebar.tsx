import { Link, useLocation, useNavigate } from "react-router-dom";
import { ACCOUNT_NAV_ITEMS } from "./accountNav";
import { useAuthStore } from "@/store/authStore";

export default function AccountSidebar() {
  const { pathname }      = useLocation();
  const navigate          = useNavigate();
  const { logout }        = useAuthStore();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="sidebar-account">
      <div className="my-account-nav">
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`link-account ${active ? "active" : ""}`}
            >
              <i className={`icon ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={handleLogout}
          className="link-account"
          style={{ borderTop: "1px solid var(--line)", borderRadius: 0 }}
        >
          <i className="icon icon-SignOut" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
