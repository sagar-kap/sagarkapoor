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
import { Marked, type Tokens } from "marked";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { splitFrontmatter, validateFrontmatter } from "./frontmatter";
import { highlightCode } from "./highlight";

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
    const { data, content } = splitFrontmatter(text);
    const fm = validateFrontmatter(data, `${CONTENT_DIR}/${slug}.md`);
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
export const findNeighbours = (posts: WritingSource[], slug: string) => {
  const index = posts.findIndex((p) => p.meta.slug === slug);
  const link = (post: WritingSource | undefined): WritingPostLink | null =>
    post ? { slug: post.meta.slug, title: post.meta.title } : null;

  return {
    previous: link(posts[index + 1]),
    next: link(index > 0 ? posts[index - 1] : undefined),
  };
};

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const unescapeHtml = (html: string) =>
  html
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&");

// GitHub-style heading slug: lowercase, accents folded, runs of anything that
// isn't a letter or digit collapsed to one hyphen.
const slugifyHeading = (text: string) =>
  text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "section";

// `WIDTHxHEIGHT` at the start of an image title, optionally followed by a real
// title: ![alt](/writing/slug/a.png "1600x900 Caption").
const IMAGE_SIZE_RE = /^(\d+)x(\d+)(?:\s+(.+))?$/;

// Local images must exist under public/ — checked while prerendering and in
// dev only (the Worker never renders posts, and has no filesystem to check).
const checkImageExists = (href: string, slug: string) => {
  if (!import.meta.prerender && !import.meta.dev) return;
  if (!existsSync(join(process.cwd(), "public", href))) {
    throw new Error(
      `${CONTENT_DIR}/${slug}.md: image "${href}" not found (expected public${href})`,
    );
  }
};

// A fresh Marked per post: heading-id de-duplication is per-post state, and
// extensions applied to the shared `marked` singleton would leak between posts.
const createMarked = (slug: string) => {
  const usedIds = new Map<string, number>();

  return new Marked({
    renderer: {
      // h2/h3 get an id and a trailing "#" link. The link sits after the text
      // so the heading's own text stays clean; its accessible name says where
      // it goes, since a bare "#" means nothing to a screen reader.
      heading({ tokens, depth }: Tokens.Heading) {
        const html = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3)
          return `<h${depth}>${html}</h${depth}>\n`;

        const text = unescapeHtml(html.replace(/<[^>]*>/g, "")).trim();
        const base = slugifyHeading(text);
        const seen = usedIds.get(base) ?? 0;
        usedIds.set(base, seen + 1);
        const id = seen ? `${base}-${seen}` : base;

        return (
          `<h${depth} id="${id}">${html} ` +
          `<a class="heading-anchor" href="#${id}" ` +
          `aria-label="Link to section: ${escapeHtml(text)}">#</a>` +
          `</h${depth}>\n`
        );
      },

      // Highlighted at render time (Shiki's <pre> is already focusable); an
      // unknown or missing language falls back to a plain block. A <pre> that
      // scrolls sideways is unreachable by keyboard unless it can take focus
      // (WCAG 2.1.1), hence the explicit tabindex on the fallback.
      code({ text, lang }: Tokens.Code) {
        const language = lang?.match(/^\S*/)?.[0];
        return (
          highlightCode(text, language) ??
          `<pre tabindex="0"><code>${escapeHtml(text)}\n</code></pre>\n`
        );
      },

      image({ href, title, text }: Tokens.Image) {
        const file = `${CONTENT_DIR}/${slug}.md`;
        if (!text.trim()) {
          throw new Error(`${file}: image "${href}" has empty alt text`);
        }

        if (!/^https?:\/\//.test(href)) {
          if (!href.startsWith(`/writing/${slug}/`)) {
            throw new Error(
              `${file}: image "${href}" must live under /writing/${slug}/ (public/writing/${slug}/)`,
            );
          }
          checkImageExists(href, slug);
        }

        const size = title?.match(IMAGE_SIZE_RE);
        const realTitle = size ? size[3] : title;
        const attrs = [
          `src="${escapeHtml(href)}"`,
          `alt="${escapeHtml(text)}"`,
          size && `width="${size[1]}" height="${size[2]}"`,
          realTitle && `title="${escapeHtml(realTitle)}"`,
          'loading="lazy"',
          'decoding="async"',
        ].filter(Boolean);
        return `<img ${attrs.join(" ")}>`;
      },
    },
  });
};

export const renderPostHtml = (body: string, slug: string) =>
  createMarked(slug).parse(body) as string;

// The feed is read outside the site, so root-relative URLs (images, links) and
// in-page anchors would resolve against the reader's own origin. Make them
// absolute against the site and the post's own URL respectively.
export const absolutizeHtml = (
  html: string,
  siteUrl: string,
  postUrl: string,
) =>
  html.replace(
    /(\s(?:href|src)=")(\/(?!\/)|#)([^"]*)"/g,
    (_match, attr: string, lead: string, rest: string) =>
      `${attr}${lead === "#" ? postUrl : siteUrl}${lead}${rest}"`,
  );
