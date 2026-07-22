import { marked } from "marked";

/**
 * Git-controlled blog. Posts are plain markdown files under
 * app/content/writing/*.md with YAML frontmatter — no CMS, no database, no
 * runtime API. Vite globs them at build time; the list is bundled and every
 * /writing route prerenders to static HTML.
 *
 * Frontmatter parsing (splitting the YAML block, ISO dates, slugs) lives in
 * shared/utils/writing.ts so the RSS feed's Nitro route can reuse it without
 * duplicating logic — see server/routes/rss.xml.get.ts.
 */

export type { WritingPostMeta } from "#shared/utils/writing";

export interface WritingPostFull extends WritingPostMeta {
  html: string;
}

// Raw markdown, keyed by file path, resolved at build by Vite.
const files = import.meta.glob("../content/writing/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

const parsed = Object.entries(files).map(([path, raw]) => {
  const { data: fm, content } = splitFrontmatter(raw);
  const words = content.trim().split(/\s+/).filter(Boolean).length;

  return {
    slug: slugFromPath(path),
    title: fm.title ?? "Untitled",
    date: toIsoDate(fm.date),
    excerpt: fm.excerpt ?? "",
    tags: fm.tags ?? [],
    readMinutes: Math.max(1, Math.round(words / 220)),
    body: content,
  };
});

// Reverse-chronological. Meta only — body is rendered on demand per post so
// the markdown renderer isn't run for every teaser.
export const allPosts: WritingPostMeta[] = parsed
  .map(({ body: _body, ...meta }) => meta)
  .sort((a, b) => b.date.localeCompare(a.date));

export const allTags = [...new Set(allPosts.flatMap((p) => p.tags))].sort();

export const getPost = (slug: string): WritingPostFull | null => {
  const post = parsed.find((p) => p.slug === slug);
  if (!post) return null;

  const { body, ...meta } = post;
  return { ...meta, html: marked.parse(body) as string };
};
