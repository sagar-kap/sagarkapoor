/**
 * Long-form bio content for /about. First person, opinionated, specific. The
 * `now` block is meant to be hand-updated every few weeks (nownownow.com style).
 *
 * Draft copy in Sagar's voice — refine before launch.
 */

export const aboutContent = {
  identity: "I run Weburz from Sofia, and I make things on the side.",

  origin: [
    "I started Weburz to build software the way I think it should be built — properly, in the open, by the people actually writing the code.",
    "We keep it focused: a handful of projects at a time, done well, with you talking straight to the people building it.",
    "Open source, our own products, and client work I'd put my name on. The throughline is trust — you can see exactly how it's made.",
  ],

  beliefs: [
    "I'd rather give you a date I believe than the one that's easiest to hear.",
    "Sturdy, proven tools beat clever ones. I pick boring on purpose.",
    "I build in the open, so you can see how something's made before you trust it.",
    "Design should help you do the thing, then get out of the way.",
    "Good software takes the time it takes. I'd rather be honest about that than rush it.",
  ],

  now: {
    updated: "2026-06-01",
    items: [
      "Building a particle-canvas module and a few small Nuxt tools in the open.",
      "Shipping client work across Bulgaria and beyond from the Sofia office.",
      "Reading more about game design than is strictly justifiable for a studio founder.",
      "Prototyping a side game in Unreal — slowly, on purpose.",
      "Trying to write here more often than I rebuild the site.",
    ],
  },

  shipped: [
    {
      label: "@weburz/particle-canvas",
      note: "Open-source ambient particle field for Nuxt.",
      href: "https://github.com/Weburz",
    },
    {
      label: "@weburz/carousel",
      note: "Platform-aware media carousel.",
      href: "https://github.com/Weburz",
    },
    {
      label: "BurzBlog",
      note: "Self-hosted headless CMS the writing here runs on.",
      href: "https://github.com/Weburz",
    },
  ],
} as const;
