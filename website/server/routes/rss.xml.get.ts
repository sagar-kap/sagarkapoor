/**
 * RSS 2.0 feed for the writing section — one <item> per markdown post under
 * app/content/writing/*.md. The route is prerendered (nitro.routeRules in
 * nuxt.config.ts), so this handler only ever runs once, at build time; it
 * costs the edge Worker nothing at request time.
 *
 * Nitro can't use Vite's import.meta.glob (that's app-side, see
 * app/utils/writing.ts), so the markdown is bundled in separately as a Nitro
 * server asset (nitro.serverAssets in nuxt.config.ts) and read here through
 * useStorage. Frontmatter parsing is shared with the app via
 * shared/utils/writing.ts so the two don't drift.
 */

import { Feed } from "rivu";
import { identity } from "../../app/data/site";

interface FeedPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export default defineEventHandler(async (event) => {
  const storage = useStorage("assets:writing");
  const keys = await storage.getKeys();

  const posts: FeedPostMeta[] = [];
  for (const key of keys) {
    if (!key.endsWith(".md")) continue;

    // Server assets can come back as raw Buffers rather than strings —
    // getItemRaw + toString covers both cases.
    const raw = await storage.getItemRaw(key);
    const text = Buffer.isBuffer(raw) ? raw.toString("utf-8") : String(raw);

    const { data: fm } = splitFrontmatter(text);
    posts.push({
      slug: slugFromPath(key),
      title: fm.title ?? "Untitled",
      date: toIsoDate(fm.date),
      excerpt: fm.excerpt ?? "",
      tags: fm.tags ?? [],
    });
  }

  // Reverse-chronological — same ordering as allPosts app-side.
  posts.sort((a, b) => b.date.localeCompare(a.date));

  const description = `${identity.name} — ${identity.role}. ${identity.bio}`;

  const feed = new Feed({
    title: identity.name,
    link: "https://sagarkapoor.eu/",
    description,
    language: "en",
    lastBuildDate: new Date(),
    docs: "https://www.rssboard.org/rss-specification",
    items: posts.map((post) => ({
      title: post.title,
      link: `https://sagarkapoor.eu/writing/${post.slug}`,
      guid: `https://sagarkapoor.eu/writing/${post.slug}`,
      description: post.excerpt,
      pubDate: new Date(post.date),
      category: post.tags[0],
    })),
  });

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return feed.generate();
});
