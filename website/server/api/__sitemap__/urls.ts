/**
 * Sitemap source for the writing posts — gives each /writing/[slug] URL a
 * lastmod taken from the frontmatter `updated` date, falling back to `date`.
 * Posts come from readWritingPosts (server/utils/writing.ts), the same source
 * as the RSS feed and /api/writing — so drafts are excluded here too.
 * Wired up via sitemap.sources in nuxt.config.ts.
 */

export default defineEventHandler(async () => {
  const posts = await readWritingPosts();

  return posts.map(({ meta }) => ({
    loc: `/writing/${meta.slug}`,
    lastmod: meta.updated ?? meta.date,
  }));
});
