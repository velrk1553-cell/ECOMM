import { Link } from "react-router-dom";
import TfSwiper from "@/components/ui/TfSwiper";
import { features } from "@/data/features";
import {
  footerStore,
  footerCompanyLinks,
  footerCustomerLinks,
  footerAccountLinksPage,
  footerPaymentIcons,
} from "@/data/footer";
import FooterAccordionWrapper, {
  FooterAccordionItem,
} from "./FooterAccordionWrapper";

export default function Footer9({
  parentClass = "tf-footer footer-s5 bg-dark",
}) {
  const isDark           = parentClass.includes("bg-dark");
  const textColorClass   = isDark ? "cl-text-3" : "cl-text-2";
  const hrColorClass     = isDark ? "" : "cl-nor";
  const headingColorClass= isDark ? "text-white" : "";
  const lineClass        = isDark ? "bg-white_10" : "";

  return (
    <footer className={parentClass}>

      {/* ── Feature strip ── */}
      <div className="flat-spacing-4">
        <div className="container-full">
          <TfSwiper
            preview={4}
            tablet={3}
            mobileSm={2}
            mobile={1}
            spaceLg={30}
            spaceMd={20}
            space={10}
            pagination={1}
            paginationSm={2}
            paginationMd={3}
            paginationLg={4}
            paginationClassName="sw-line-default style-2 tf-sw-pagination"
          >
            {features.map((item) => (
              <div key={item.title} className="box-icon_V01 style-3 wow fadeInLeft">
                <span className="icon">
                  <i className={`${item.icon}${isDark ? " text-white" : ""}`} aria-hidden />
                </span>
                <div className="content">
                  <div className={`h6 title ${isDark ? "text-white" : ""}`}>{item.title}</div>
                  <p className={`text ${textColorClass}`}>{item.text}</p>
                </div>
              </div>
            ))}
          </TfSwiper>
        </div>
      </div>

      {/* ── Main footer links ── */}
      <div className="position-relative">
        <div className={`br-line fake-class top-0 ${lineClass}`} />
        <div className={`br-line fake-class bottom-0 ${lineClass} d-none d-sm-flex`} />
        <div className="container-full">
          <FooterAccordionWrapper>
            <div className="footer-inner flat-spacing">

              {/* Store info */}
              <div className="col-left">
                <FooterAccordionItem
                  id="footer9-store"
                  className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-start`}
                  heading="OUR STORE"
                  headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                >
                  <p className={`${textColorClass} mb-4`}>{footerStore.supportLabel}</p>
                  <a href={footerStore.phoneHref} className={`${isDark ? "text-white" : ""} link h4 fw-medium mb-12`}>
                    {footerStore.phone}
                  </a>
                  <a
                    href={footerStore.addressHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${textColorClass} link mb-4`}
                  >
                    {footerStore.address}
                  </a>
                  <a href={`mailto:${footerStore.email}`} className={`${textColorClass} link`}>
                    {footerStore.email}
                  </a>
                </FooterAccordionItem>
              </div>

              <div className={`br-line type-vertical ${hrColorClass}`} />

              {/* Link columns */}
              <div className="col-center">
                <div className="footer-link-list">

                  <FooterAccordionItem
                    id="footer9-company"
                    className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-2`}
                    heading={footerCompanyLinks.title}
                    headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                  >
                    <ul className="footer-menu-list">
                      {footerCompanyLinks.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link to={link.href} className={`${textColorClass} link`}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>

                  <FooterAccordionItem
                    id="footer9-customer"
                    className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-3`}
                    heading={footerCustomerLinks.title}
                    headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                  >
                    <ul className="footer-menu-list">
                      {footerCustomerLinks.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link to={link.href} className={`${textColorClass} link`}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>

                  <FooterAccordionItem
                    id="footer9-account"
                    className={`footer-col-block ${isDark ? "type-white" : ""} footer-wrap-4`}
                    heading={footerAccountLinksPage.title}
                    headingClassName={`footer-heading footer-heading-mobile ${headingColorClass}`}
                  >
                    <ul className="footer-menu-list">
                      {footerAccountLinksPage.links.map((link) => (
                        <li key={link.href + link.label}>
                          <Link to={link.href} className={`${textColorClass} link`}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </FooterAccordionItem>

                </div>
              </div>

            </div>
          </FooterAccordionWrapper>
        </div>
      </div>

      {/* ── Footer bottom bar ── */}
      <div className="footer-bottom border-top-0">
        <div className="container-full">
          <div className="inner-bottom">
            <p className={`text-nocopy ${textColorClass}`}>
              ©{new Date().getFullYear()} ShopKart. All Rights Reserved.
            </p>
            <ul className="tf-list payment-list">
              {footerPaymentIcons.map((icon) => (
                <li key={icon.src}>
                  <img src={icon.src} alt={icon.alt} width={38} height={24} loading="lazy" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

    </footer>
  );
}
