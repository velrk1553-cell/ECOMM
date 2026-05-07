import type {
  FooterLinkGroup,
  FooterStore,
  FooterPaymentIcon,
} from "@/types/footer";

export const footerStore: FooterStore = {
  supportLabel: "24/7 Support Center:",
  phone: "+91 98765 43210",
  phoneHref: "tel:+919876543210",
  address: "12, Silk Market Road, Kancheepuram, Tamil Nadu - 631502",
  addressHref: "https://www.google.com/maps?q=Kancheepuram,Tamil+Nadu",
  email: "support@shopkart.com",
};

export const footerCompanyLinks: FooterLinkGroup = {
  title: "COMPANY",
  links: [
    { label: "About Us",    href: "/about" },
    { label: "Our Store",   href: "/our-store" },
    { label: "Contact Us",  href: "/contact" },
    { label: "Blog",        href: "/blog" },
    { label: "My Account",  href: "/account-page" },
  ],
};

export const footerCustomerLinks: FooterLinkGroup = {
  title: "CUSTOMER",
  links: [
    { label: "Track Order",       href: "/track-order" },
    { label: "Return & Refund",   href: "/contact" },
    { label: "Privacy Policy",    href: "/about" },
    { label: "Terms & Conditions",href: "/about" },
    { label: "Orders FAQs",       href: "/contact" },
  ],
};

/** Account links for Footer7 (modal triggers) */
export const footerAccountLinksModal: FooterLinkGroup = {
  title: "MY ACCOUNT",
  links: [
    { label: "Login",       href: "#sign" },
    { label: "Sign up",     href: "#register" },
    { label: "My Account",  href: "/account-page" },
    { label: "Wish List",   href: "/wishlist" },
  ],
};

/** Account links for Footer9 (page links) */
export const footerAccountLinksPage: FooterLinkGroup = {
  title: "MY ACCOUNT",
  links: [
    { label: "Login",       href: "/login" },
    { label: "Sign up",     href: "/register" },
    { label: "My Account",  href: "/account-page" },
    { label: "My Orders",   href: "/account-orders" },
    { label: "Wish List",   href: "/wishlist" },
    { label: "View Cart",   href: "/view-cart" },
  ],
};

export const footerPaymentIcons: FooterPaymentIcon[] = [
  { src: "/assets/images/payment/visa.svg",        alt: "Visa" },
  { src: "/assets/images/payment/master-card.svg", alt: "Mastercard" },
  { src: "/assets/images/payment/amex.svg",        alt: "Amex" },
  { src: "/assets/images/payment/paypal.svg",      alt: "PayPal" },
  { src: "/assets/images/payment/discover.svg",    alt: "Discover" },
];
