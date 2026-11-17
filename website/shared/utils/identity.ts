/**
 * Who the site is about. Lives in shared/ because both the app (via
 * app/data/site.ts) and the RSS route need it. Pure data — no DOM, no Node
 * APIs — so it runs in the browser bundle and the Cloudflare Worker alike.
 */

export const identity = {
  name: "Sagar Kapoor",
  monogram: "SK",
  role: "Founder, Weburz",
  city: "Sofia",
  foundedYear: 2019,
  // Short, human one-liner — used for SEO + the writing byline.
  bio: "I run Weburz, a studio that builds software for the web. Sometimes I make games.",
} as const;
