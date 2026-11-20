/**
 * Navigation stays in code on purpose: menu entries map to routes that exist
 * as files, so making them editable would let an admin orphan a page or
 * point a link at nothing. The Programmes submenu is built from the live
 * programme records, so adding a programme in the admin panel still updates
 * the menu — and the legal link row is built from the legal pages.
 */

const aboutNav = {
  label: "About",
  items: [
    { href: "/about", label: "Our Story" },
    { href: "/about/founder", label: "Founder" },
    { href: "/about/trustees", label: "Trustees" },
  ],
};

const tailNav = [
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/stories", label: "Stories" },
  { href: "/donors", label: "Donors" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
];

/** Builds the header navigation, with one submenu entry per programme. */
export function buildMainNav(programs = []) {
  return [
    { href: "/", label: "Home" },
    aboutNav,
    {
      label: "Programs",
      items: [
        { href: "/programs", label: "All Programs" },
        ...programs.map((p) => ({
          href: `/programs/${p.slug}`,
          label: p.title,
        })),
      ],
    },
    ...tailNav,
  ];
}

export const footerLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/donors", label: "Donors" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
];
