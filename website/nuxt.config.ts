import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { splitFrontmatter } from "./server/utils/frontmatter";

const writingDir = fileURLToPath(
  new URL("./app/content/writing", import.meta.url),
);

const writingFiles = readdirSync(writingDir).filter((file) =>
  file.endsWith(".md"),
);

// Drafts (`draft: true` in frontmatter) must stay out of the prerendered
// routes. Only that one flag is read here — full validation happens when the
// posts are rendered (server/utils/frontmatter.ts), which fails the build.
const draftFiles = writingFiles.filter(
  (file) =>
    (
      splitFrontmatter(readFileSync(join(writingDir, file), "utf-8")).data as
        { draft?: unknown } | undefined
    )?.draft === true,
);

// One static JSON file per post (see server/api/writing/[slug].get.ts). Nitro
// can't discover these by crawling — nothing links to them — so list them here.
// `nuxt dev` serves drafts live and never prerenders, so filtering is harmless.
const writingDataRoutes = writingFiles
  .filter((file) => !draftFiles.includes(file))
  .map((file) => `/api/writing/${file.replace(/\.md$/, "")}.json`);

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
    public: {
      umamiWebsiteId: "",
      shareImageOrigin: process.env.CF_PAGES_URL || "",
    },
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

  // Post URLs (with lastmod) come from server/api/__sitemap__/urls.ts. Image
  // discovery is off: the only <img> on a post is the byline avatar, which
  // isn't content worth listing against every URL.
  sitemap: {
    xsl: false,
    discoverImages: false,
    sources: ["/api/__sitemap__/urls"],
  },

  // @nuxtjs/seo bundles nuxt-og-image, which pulls the takumi WASM renderer for
  // generated share cards. We don't render custom OG images (meta tags come from
  // useSeoMeta), so disable it to keep the edge Worker lean. Re-enable + add
  // the takumi renderer package if branded share cards are wanted later.
  ogImage: { enabled: false },

  // Working light + dark toggle (deliberately unlike natrix's dark-only). Dark
  // is the default/fallback; the toggle in the header/footer flips to sea-foam.
  colorMode: {
    preference: "dark",
    fallback: "dark",
    storageKey: "sk-color",
  },

  // Hybrid Cloudflare Pages deploy (the Weburz house pattern). `nuxt build`
  // prerenders the homepage into dist/ AND emits a Worker that runs the
  // server routes — so POST /api/contact has a runtime. A pure `nuxt generate`
  // ships no Worker and the contact form would 405. CF Pages build command must
  // be `pnpm build`; output directory is `dist`.
  // DEPLOY NOTE: the emitted Worker uses Node built-ins, so the Cloudflare Pages
  // project must have the `nodejs_compat` compatibility flag enabled (Pages →
  // Settings → Functions → Compatibility flags, for both production & preview).
  nitro: {
    preset: "cloudflare-pages",
    // Old Hugo URLs are handled by public/_redirects. Pages only applies
    // _redirects to requests it serves as assets, so these paths must be
    // excluded from the Worker in _routes.json or the Worker 404s them first.
    cloudflare: {
      pages: {
        routes: {
          exclude: [
            "/index.xml",
            "/api/writing/*",
            "/blog/*",
            "/posts/*",
            "/tags/*",
            "/categories/*",
            "/raspberry-pi4-headless-ubuntu-from-usb",
            "/raspberry-pi4-headless-ubuntu-from-usb/",
            "/getting-started-with-git",
            "/getting-started-with-git/",
            "/how-to-scrape-with-python",
            "/how-to-scrape-with-python/",
          ],
        },
      },
    },
    // Bundle the writing markdown into the Nitro server build so
    // server/utils/writing.ts can read it via useStorage("assets:writing") —
    // the RSS feed, the sitemap source and /api/writing all go through it, and
    // the markdown never reaches the client. `dir` is an absolute path so it
    // doesn't depend on Nitro's srcDir resolution (which is nuxt's serverDir,
    // i.e. server/, not the project root). Declared per environment in
    // $development / $production below.
    prerender: {
      crawlLinks: true,
      routes: ["/", "/api/writing/index.json", ...writingDataRoutes],
      // Blog posts are local markdown (app/content/writing/*.md), read by
      // server/utils/writing.ts and prerendered to static HTML, as is the
      // /api/writing/*.json data the pages fetch (see writingDataRoutes). A
      // page that fails to prerender must fail the build — otherwise it is
      // silently missing from the deploy.
      failOnError: true,
      // Emit about.html, not about/index.html: Pages redirects the bare path
      // of a directory index to a trailing slash, but canonicals, sitemap,
      // RSS and internal links are all slash-free.
      autoSubfolderIndex: false,
    },
    routeRules: {
      // Never cache the contact endpoint at the edge.
      "/api/**": { headers: { "Cache-Control": "no-store" } },
      // Feed is generated from static markdown at build time — bake it to a
      // static file too, same philosophy as the static og.png.
      "/rss.xml": { prerender: true },
    },
  },

  // Page data is inlined in each prerendered HTML file instead of a sibling
  // _payload.json per route: those would each add a _routes.json rule (100-rule
  // cap). Client-side navigation fetches the shared /api/writing/*.json files.
  experimental: {
    payloadExtraction: false,
  },

  // Pre-bundle the GSAP entrypoints Vite would otherwise discover on first
  // request (which forces a dev page reload).
  vite: {
    optimizeDeps: {
      include: ["gsap", "gsap/SplitText"],
    },
  },

  // Dev serves drafts, so every post is a server asset. Production builds
  // leave drafts out of the bundle entirely — otherwise an unpublished post
  // would still ship, as source, inside _worker.js.
  $development: {
    nitro: { serverAssets: [{ baseName: "writing", dir: writingDir }] },
  },
  $production: {
    nitro: {
      serverAssets: [
        { baseName: "writing", dir: writingDir, ignore: draftFiles },
      ],
    },
  },

  compatibilityDate: "2025-06-01",
});
