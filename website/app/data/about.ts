export const aboutContent = {
  identity: "I'm Sagar Kapoor. I live in Sofia.",

  now: {
    updated: "2026-06-01",
    items: [
      "Building a particle-canvas module and a few small Nuxt tools in the open.",
      "Reading about game design.",
      "Prototyping a side game in Unreal — slowly, on purpose.",
      "Trying to write here more often than I rebuild the site.",
    ],
  },

  shipped: [
    {
      label: "@weburz/particle-canvas",
      note: "Open-source ambient particle field for Nuxt.",
      href: "https://github.com/weburz/particle-canvas",
    },
    {
      label: "@weburz/carousel",
      note: "Platform-aware media carousel.",
      href: "https://github.com/weburz/carousel",
    },
    {
      label: "BurzBlog",
      note: "Self-hosted headless CMS.",
      href: "https://burzblog.weburz.com",
    },
  ],
} as const;
