/**
 * Who the site is about. Lives in shared/ because both the app (via
 * app/data/site.ts) and the RSS route need it. Pure data — no DOM, no Node
 * APIs — so it runs in the browser bundle and the Cloudflare Worker alike.
 */

export const identity = {
  name: "Sagar Kapoor",
  monogram: "SK",
  // Short, human one-liner — used for SEO + the writing byline.
  bio: "I live in Sofia and build software for the web. I’m also into trading, Kabbalah, and making games.",
} as const;
