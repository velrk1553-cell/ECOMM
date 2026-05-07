import { Link, useNavigate } from "react-router-dom";
import { PreventDefaultForm } from "@/components/forms/PreventDefaultForm";
import { useCategories } from "@/hooks/useApi";
import type { ApiCategory } from "@/services/api";

function catLink(c: ApiCategory) {
  return `/shop-default?category_id=${c.id}`;
}
function subLink(s: ApiCategory) {
  return `/shop-default?subcategory_id=${s.id}`;
}

export default function MobileMenu({
  registerOffcanvasElement,
}: {
  registerOffcanvasElement?: (el: HTMLElement | null) => void;
}) {
  const navigate = useNavigate();
  const { categories } = useCategories(); // GET /shopkart-api/categories

  return (
    <div
      ref={registerOffcanvasElement}
      className="offcanvas offcanvas-start canvas-mb"
      id="mobileMenu"
    >
      {/* Search bar */}
      <div className="canvas-header">
        <span className="icon-close-popup" data-bs-dismiss="offcanvas">
          <i className="icon icon-X2" aria-hidden />
        </span>
        <PreventDefaultForm
          className="form-search-nav"
          onSubmit={(e) => {
            const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
            navigate(q ? `/search-result?query=${encodeURIComponent(q)}` : "/search-result");
          }}
        >
          <fieldset>
            <input type="text" name="q" placeholder="What are you looking for?" required />
          </fieldset>
          <button type="submit" className="btn-action">
            <i className="icon icon-MagnifyingGlass" aria-hidden />
          </button>
        </PreventDefaultForm>
      </div>

      <div className="canvas-body">
        <div className="mb-content-top">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">

            {/* Dynamic categories from API */}
            {categories.map((cat, _idx) => {
              const hasSub = (cat.children ?? []).length > 0;
              const collapseId = `mb-cat-${cat.id}`;

              return (
                <li key={cat.id} className="nav-mb-item">
                  {hasSub ? (
                    <>
                      <a
                        href={`#${collapseId}`}
                        className="mb-menu-link collapsed"
                        data-bs-toggle="collapse"
                        aria-expanded="false"
                        aria-controls={collapseId}
                      >
                        <span>{cat.name}</span>
                        <span className="icon ic-custom" aria-hidden />
                      </a>
                      <div id={collapseId} className="collapse">
                        <ul className="sub-nav-menu">
                          {/* "View all" link for the parent category */}
                          <li>
                            <Link to={catLink(cat)} className="sub-nav-link" data-bs-dismiss="offcanvas">
                              <span className="cus-text">View All {cat.name}</span>
                            </Link>
                          </li>
                          {/* Subcategory links */}
                          {cat.children!.map((sub) => (
                            <li key={sub.id}>
                              <Link to={subLink(sub)} className="sub-nav-link" data-bs-dismiss="offcanvas">
                                <span className="cus-text">{sub.name}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  ) : (
                    <Link to={catLink(cat)} className="mb-menu-link" data-bs-dismiss="offcanvas">
                      <span>{cat.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}

          </ul>
        </div>

        {/* Contact info */}
        <div className="need-help-wrap">
          <p className="nd-title h6 fw-medium mb-16">Need Help?</p>
          <a href="mailto:support@shopkart.com" className="cl-text-2 link mb-8">
            support@shopkart.com
          </a>
        </div>
      </div>

      {/* Footer — no currency/language switchers */}
    </div>
  );
}
