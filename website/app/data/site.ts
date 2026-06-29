/**
 * Single source of truth for site-wide chrome: identity, navigation, socials,
 * and the home trust-signals. Edit here, not in components.
 */

export interface NavLink {
  label: string;
  to: string;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export const identity = {
  name: "Sagar Kapoor",
  monogram: "SK",
  role: "Founder, Weburz",
  city: "Sofia",
  foundedYear: 2019,
  // Short, human one-liner — used for SEO + the writing byline.
  bio: "I run Weburz, a studio that builds software for the web. Sometimes I make games.",
} as const;

// Header nav — real routes, not anchors. No CTA button lives in the header.
export const navLinks: NavLink[] = [
  { label: "Work", to: "/work" },
  { label: "Writing", to: "/writing" },
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
    href: "https://x.com/sagarkapoor",
    icon: "i-simple-icons-x",
  },
];

// Home "signals" — quiet truths rather than a metrics flex. No counters.
export const trustSignals = [
  { value: "since 2019", label: "building Weburz" },
  { value: "Sofia", label: "& worldwide" },
  { value: "open source", label: "by default" },
] as const;
