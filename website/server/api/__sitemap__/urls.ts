/**
 * Sitemap source for the writing posts — gives each /writing/[slug] URL a
 * lastmod taken from the frontmatter date. Reads the markdown through the same
 * Nitro server asset as server/routes/rss.xml.get.ts (nitro.serverAssets in
 * nuxt.config.ts). Wired up via sitemap.sources in nuxt.config.ts.
 */

export default defineEventHandler(async () => {
  const storage = useStorage("assets:writing");
  const keys = await storage.getKeys();

  const urls: { loc: string; lastmod: string }[] = [];
  for (const key of keys) {
    if (!key.endsWith(".md")) continue;

    const raw = await storage.getItemRaw(key);
    const text = Buffer.isBuffer(raw) ? raw.toString("utf-8") : String(raw);

    const { data: fm } = splitFrontmatter(text);
    urls.push({
      loc: `/writing/${slugFromPath(key)}`,
      lastmod: toIsoDate(fm.date),
    });
  }

  return urls;
});
