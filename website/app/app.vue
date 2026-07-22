<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { identity } from "./data/site";

useHead({
  htmlAttrs: { lang: "en" },
  titleTemplate: (titleChunk) =>
    titleChunk ? `${titleChunk} · ${identity.name}` : identity.name,
  link: [
    { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/apple-touch-icon.png",
    },
    {
      rel: "alternate",
      type: "application/rss+xml",
      title: `${identity.name} — Writing`,
      href: "/rss.xml",
    },
  ],
});

const description = `${identity.name} — ${identity.role}. ${identity.bio}`;

// Static share card (public/og.png, 1200×630) — the footer shore, moon and
// all. Absolute URL: scrapers don't resolve relative og:image paths.
const ogImage = "https://sagarkapoor.eu/og.png";

useSeoMeta({
  title: identity.name,
  ogTitle: `${identity.name} — ${identity.role}`,
  description,
  ogDescription: description,
  ogType: "website",
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${identity.name} — ${identity.role}`,
  twitterCard: "summary_large_image",
  twitterImage: ogImage,
  themeColor: "#0b1418",
});
</script>

<style>
/*
 * Global <html>/<body> styling — these carry no template classes. The theme
 * surface vars (--background, --color) flip per color-mode in main.css.
 */
html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  font-family: var(--font-body);
  background-color: var(--background);
  color: var(--color);
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
</style>
