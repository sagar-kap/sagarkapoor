// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/eslint", "@nuxt/ui", "@nuxtjs/seo", "@nuxtjs/turnstile"],

  // Components live under sections/ ui/ — pathPrefix:false keeps flat
  // auto-import names (<HomeHero>, not <SectionsHomeHero>).
  components: [{ path: "~/components", pathPrefix: false }],

  css: ["~/assets/css/main.css"],

  // Server-only secrets for the contact form (server/api/contact). Nothing is
  // committed — all injected via env at deploy on Cloudflare Pages:
  //   NUXT_RESEND_API_KEY=re_...               (Resend transactional key)
  //   NUXT_CONTACT_TO=sagar@private-inbox       (where messages land — never in DOM)
  //   NUXT_CONTACT_FROM="Sagar Kapoor <noreply@verified-domain>"
  // The Turnstile secret is added to runtimeConfig by @nuxtjs/turnstile itself
  //   (NUXT_TURNSTILE_SECRET_KEY); the site key below is public.
  runtimeConfig: {
    resendApiKey: "",
    contactTo: "",
    contactFrom: "",
  },

  // Cloudflare Turnstile — site key is public, secret is server-side (above).
  turnstile: {
    siteKey: "", // NUXT_PUBLIC_TURNSTILE_SITE_KEY
  },

  // Public site identity — drives sitemap, robots, canonical URLs, og:url.
  site: {
    url: "https://sagarkapoor.eu",
    name: "Sagar Kapoor",
    defaultLocale: "en",
  },

  // @nuxtjs/seo bundles nuxt-og-image, which pulls the takumi WASM renderer for
  // generated share cards. We don't render custom OG images (meta tags come from
  // useSeoMeta), so disable it to keep the edge Worker lean. Re-enable + add
  // @takumi-rs/wasm if branded share cards are wanted later.
  ogImage: { enabled: false },

  // Working light + dark toggle (deliberately unlike natrix's dark-only). Dark
  // is the default/fallback; the toggle in the header/footer flips to sea-foam.
  colorMode: {
    preference: "dark",
    fallback: "dark",
    storageKey: "sk-color",
  },

  // Hybrid Cloudflare Pages deploy (the Weburz house pattern). `nuxt build`
  // prerenders the homepage into .output/public AND emits a Worker that runs the
  // server routes — so POST /api/contact has a runtime. A pure `nuxt generate`
  // ships no Worker and the contact form would 405. CF Pages build command must
  // be `pnpm build`; output dir stays `.output/public`.
  // DEPLOY NOTE: the emitted Worker uses Node built-ins, so the Cloudflare Pages
  // project must have the `nodejs_compat` compatibility flag enabled (Pages →
  // Settings → Functions → Compatibility flags, for both production & preview).
  nitro: {
    preset: "cloudflare-pages",
    compressPublicAssets: true,
    prerender: {
      crawlLinks: true,
      routes: ["/"],
      // Blog posts are CMS-backed and rendered on-demand by the Worker (so new
      // posts appear without a rebuild). If the crawler hits a /writing/[slug]
      // while the CMS is unreachable at build time, skip it rather than fail.
      failOnError: false,
    },
    routeRules: {
      // Never cache the contact endpoint at the edge.
      "/api/**": { headers: { "Cache-Control": "no-store" } },
    },
  },

  // Pre-bundle the GSAP entrypoints Vite would otherwise discover on first
  // request (which forces a dev page reload).
  vite: {
    optimizeDeps: {
      include: ["gsap", "gsap/SplitText", "gsap/ScrollTrigger"],
    },
  },

  compatibilityDate: "2025-06-01",
});
