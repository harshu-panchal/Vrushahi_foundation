import { programs } from "./programs";

export const mainNav = [
  { href: "/", label: "Home" },
  {
    label: "About",
    items: [
      { href: "/about", label: "Our Story" },
      { href: "/about/founder", label: "Founder" },
      { href: "/about/trustees", label: "Trustees" },
    ],
  },
  {
    label: "Programs",
    items: [
      { href: "/programs", label: "All Programs" },
      ...programs.map((p) => ({ href: `/programs/${p.slug}`, label: p.title })),
    ],
  },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/stories", label: "Stories" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
];

export const legalLinks = [
  { href: "/legal/privacy-policy", label: "Privacy Policy" },
  { href: "/legal/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/legal/disclaimer", label: "Disclaimer" },
  { href: "/legal/refund-policy", label: "Cancellation & Refund Policy" },
];
