import { Link } from "react-router-dom";
import CartIconCount from "./CartIconCount";
import AccountIcon from "./AccountIcon";
import Nav from "./Nav";
import { useHeaderSticky } from "@/hooks/useHeaderSticky";

export default function Header1() {
  const headerSticky = useHeaderSticky();

  return (
    <header
      className={`tf-header header-s2 scr-box-shadow${headerSticky ? " header-sticky" : ""}`}
      style={{ top: headerSticky ? "0px" : "-80px", transition: "top 0.3s ease-in-out" }}
    >
      <div className="container-full">
        <div className="header-inner">

          {/* Mobile hamburger */}
          <div className="box-open-menu-mobile d-xl-none">
            <a href="#mobileMenu" data-bs-toggle="offcanvas" className="btn-open-menu">
              <i className="icon icon-List" />
            </a>
          </div>

          {/* Logo + Desktop nav grouped left */}
          <div className="header-left d-flex align-items-center">
            <Link to="/" className="logo-site flex-shrink-0 me-4">
              <img
                loading="lazy"
                width={150}
                height={30}
                src="/assets/images/logo/logo.svg"
                alt="ShopKart"
              />
            </Link>
            {/* Divider */}
            <span
              className="d-none d-xl-block flex-shrink-0 me-4"
              style={{ width: 1, height: 24, background: "#e5e7eb" }}
            />
            <nav className="box-navigation d-none d-xl-block">
              <ul className="box-nav-menu">
                <Nav />
              </ul>
            </nav>
          </div>

          {/* Right icons — no currency, no language */}
          <div className="header-right">
            <ul className="nav-icon-list">
              <li className="d-none d-sm-block">
                <a href="#search" data-bs-toggle="modal" className="nav-icon-item link">
                  <i className="icon icon-MagnifyingGlass" />
                </a>
              </li>
              <li>
                <AccountIcon />
              </li>
              <li className="d-none d-sm-block">
                <Link to="/wishlist" className="nav-icon-item link">
                  <i className="icon icon-HeartStraight" />
                </Link>
              </li>
              <li>
                <a href="#shoppingCart" data-bs-toggle="offcanvas" className="nav-icon-item link shop-cart">
                  <i className="icon icon-Handbag" />
                  <CartIconCount />
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </header>
  );
}
