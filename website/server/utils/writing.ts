/**
 * Git-controlled blog, server side. Posts are plain markdown files under
 * app/content/writing/*.md with YAML frontmatter — no CMS, no database. They
 * are bundled into the Nitro build as a server asset (nitro.serverAssets in
 * nuxt.config.ts) and read here through useStorage. The RSS feed, the sitemap
 * source and the /api/writing routes all go through readWritingPosts, so the
 * markdown pipeline (js-yaml, marked, shiki) exists in exactly one place and
 * never reaches the client bundle.
 *
 * Frontmatter (validated at build — see frontmatter.ts; an unknown key, a
 * missing required field or a malformed date fails the build, naming the file):
 *   ---
 *   title: "…"              # required
 *   date: "2026-05-18"      # required, YYYY-MM-DD (quote it to keep a string)
 *   excerpt: "…"            # required
 *   tags: ["studio"]        # optional, array of strings
 *   updated: "2026-06-02"   # optional, YYYY-MM-DD, shown on the post, feeds
 *                           # sitemap lastmod and JSON-LD dateModified
 *   draft: true             # optional; out of the index, feed, sitemap and
 *                           # prerendered routes in production, visible in dev
 *   ---
 *
 * Images: files live in website/public/writing/<slug>/ and are referenced by
 * root-relative path, with alt text:
 *   ![A whiteboard sketch](/writing/<slug>/sketch.png)
 * Optionally put the intrinsic size in the title as `WIDTHxHEIGHT` (so the
 * browser reserves space and the layout doesn't jump); anything after it
 * becomes the title attribute:
 *   ![A whiteboard sketch](/writing/<slug>/sketch.png "1600x900")
 *   ![A whiteboard sketch](/writing/<slug>/sketch.png "1600x900 First draft")
 * Images get loading="lazy" and decoding="async". The build fails on empty alt
 * text, on a local path outside /writing/<slug>/, and on a missing file.
 *
 * Headings: h2/h3 get a stable, per-post-unique id and a trailing "#" link.
 * Code fences are highlighted at render time with Shiki (see highlight.ts).
 */

import type { WritingPostLink, WritingPostMeta } from "#shared/utils/writing";
import { splitFrontmatter, validateFrontmatter } from "./frontmatter";

export interface WritingSource {
  meta: WritingPostMeta;
  body: string;
}

const CONTENT_DIR = "app/content/writing";

const slugFromPath = (path: string) =>
  path.split("/").pop()!.replace(/\.md$/, "");

// Every post, reverse-chronological, with its raw markdown body. Drafts are
// skipped everywhere except `nuxt dev`.
export const readWritingPosts = async (): Promise<WritingSource[]> => {
  const storage = useStorage("assets:writing");
  const keys = await storage.getKeys();

  const posts: WritingSource[] = [];
  for (const key of keys) {
    if (!key.endsWith(".md")) continue;

    // Server assets can come back as raw Buffers rather than strings —
    // getItemRaw + toString covers both cases.
    const raw = await storage.getItemRaw(key);
    const text = Buffer.isBuffer(raw) ? raw.toString("utf-8") : String(raw);

    const slug = slugFromPath(key);
    const file = `${CONTENT_DIR}/${slug}.md`;
    const { data, content } = splitFrontmatter(text, file);
    const fm = validateFrontmatter(data, file);
    if (fm.draft && !import.meta.dev) continue;

    const words = content.trim().split(/\s+/).filter(Boolean).length;

    posts.push({
      meta: {
        slug,
        title: fm.title,
        date: fm.date,
        ...(fm.updated && { updated: fm.updated }),
        excerpt: fm.excerpt,
        tags: fm.tags,
        readMinutes: Math.max(1, Math.round(words / 220)),
      },
      body: content,
    });
  }

  return posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
};

// The chronological neighbours of a post in the list readWritingPosts returns
// (newest first): `previous` is the next-older post, `next` the next-newer.
export const findNeighbours = (posts: WritingSource[], index: number) => {
  const link = (post: WritingSource | undefined): WritingPostLink | null =>
    post ? { slug: post.meta.slug, title: post.meta.title } : null;

  return {
    previous: link(posts[index + 1]),
    next: link(index > 0 ? posts[index - 1] : undefined),
  };
};
