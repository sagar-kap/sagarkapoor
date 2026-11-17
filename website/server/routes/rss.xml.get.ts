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

export default defineEventHandler(async (event) => {
  // Already reverse-chronological.
  const posts = await readWritingPosts();

  const siteUrl = getSiteConfig(event).url;
  const postUrl = (slug: string) => `${siteUrl}/writing/${slug}`;
  const description = `${identity.name} — ${identity.role}. ${identity.bio}`;

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

  // rivu has no support for content:encoded (or custom XML namespaces; checked
  // through 1.3.1), so the full post HTML is spliced into the generated XML:
  // declare the namespace on <rss> (whatever attributes rivu emits there) and
  // add the element at the end of each <item>. Items come out in the order
  // given above, so they pair with `posts` by index. The splice is
  // string-based, so verify it applied rather than ship a malformed feed.
  const contentNamespace = "http://purl.org/rss/1.0/modules/content/";
  const contents = posts.map(({ meta, body }) =>
    absolutizeHtml(
      renderPostHtml(body, meta.slug),
      siteUrl,
      postUrl(meta.slug),
    ),
  );
  let index = 0;
  const xml = feed
    .generate()
    .replace(/<rss\b([^>]*)>/, (tag, attributes: string) =>
      attributes.includes("xmlns:content=")
        ? tag
        : `<rss${attributes} xmlns:content="${contentNamespace}">`,
    )
    .replaceAll(/([ \t]*)<\/item>/g, (_match, indent: string) => {
      // A literal "]]>" would end the CDATA section early.
      const html = (contents[index++] ?? "").replaceAll(
        "]]>",
        "]]]]><![CDATA[>",
      );
      return `${indent}  <content:encoded><![CDATA[${html}]]></content:encoded>\n${indent}</item>`;
    });

  if (!/<rss\b[^>]*\sxmlns:content="/.test(xml)) {
    throw new Error("rss.xml: <rss> root does not declare xmlns:content");
  }
  if (index !== posts.length) {
    throw new Error(
      `rss.xml: inserted ${index} <content:encoded> elements for ${posts.length} posts`,
    );
  }

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return xml;
});
