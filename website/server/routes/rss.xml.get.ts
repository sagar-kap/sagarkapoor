/**
 * RSS 2.0 feed for the writing section — one <item> per markdown post under
 * app/content/writing/*.md. The route is prerendered (nitro.routeRules in
 * nuxt.config.ts), so this handler only ever runs once, at build time; it
 * costs the edge Worker nothing at request time.
 *
 * Posts come from readWritingPosts (server/utils/writing.ts), which reads the
 * markdown from the Nitro server asset (nitro.serverAssets in nuxt.config.ts)
 * — the same source as the sitemap and the /api/writing routes.
 */

import { identity } from "#shared/utils/identity";
import { Feed } from "rivu";
import { withArticleContent } from "../utils/feed";

export default defineEventHandler(async (event) => {
  // Already reverse-chronological.
  const posts = await readWritingPosts();

  const siteUrl = getSiteConfig(event).url;
  const postUrl = (slug: string) => `${siteUrl}/writing/${slug}`;
  const description = `${identity.name}. ${identity.bio}`;

  const feed = new Feed({
    title: identity.name,
    link: `${siteUrl}/`,
    description,
    language: "en",
    lastBuildDate: new Date(),
    docs: "https://www.rssboard.org/rss-specification",
    items: posts.map(({ meta: post }) => ({
      title: post.title,
      link: postUrl(post.slug),
      guid: postUrl(post.slug),
      description: post.excerpt,
      pubDate: new Date(post.date),
      category: post.tags[0],
    })),
  });

  // Rivu generates the standard RSS fields. Attach full text to the
  // corresponding GUID so readers can also display the original excerpt.
  const fullText = new Map(
    posts.map(({ meta, body }) => {
      const url = postUrl(meta.slug);
      return [
        url,
        absolutizeHtml(renderPostHtml(body, meta.slug), siteUrl, url),
      ];
    }),
  );

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return withArticleContent(feed.generate(), fullText);
});
