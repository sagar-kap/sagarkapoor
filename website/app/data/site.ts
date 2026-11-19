export { identity } from "#shared/utils/identity";

export interface NavLink {
  label: string;
  to: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

// Header nav — real routes, not anchors. No CTA button lives in the header.
export const navLinks: NavLink[] = [
  { label: "Writing", to: "/writing" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

// Footer socials — GitHub + one other. No public email anywhere on the site.
export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/Sagar-Kap",
    icon: "i-simple-icons-github",
  },
  {
    label: "X",
    href: "https://x.com/SagarKapr",
    icon: "i-simple-icons-x",
  },
];
