<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
import { identity, socialLinks } from "./data/site";

const { umamiWebsiteId, shareImageOrigin } = useRuntimeConfig().public;

useHead({
  script: umamiWebsiteId
    ? [
        {
          defer: true,
          src: "https://umami.weburz.com/script.js",
          "data-website-id": umamiWebsiteId,
          "data-domains": "sagarkapoor.eu",
        },
      ]
    : [],
  htmlAttrs: { lang: "en" },
  titleTemplate: (titleChunk) =>
    titleChunk && titleChunk !== identity.name
      ? `${titleChunk} · ${identity.name}`
      : identity.name,
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

useSchemaOrg([
  definePerson({
    name: identity.name,
    sameAs: socialLinks.map((link) => link.href),
  }),
]);

const description = `${identity.name}. ${identity.bio}`;

// Pages previews can go live before the canonical domain points to Pages.
const ogImage = new URL("/og.png", shareImageOrigin || useSiteConfig().url)
  .href;

useSeoMeta({
  title: identity.name,
  description,
  ogType: "website",
  ogImage,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: identity.name,
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
