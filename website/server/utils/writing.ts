/**
 * Git-controlled blog, server side. Posts are plain markdown files under
 * app/content/writing/*.md with YAML frontmatter — no CMS, no database. They
 * are bundled into the Nitro build as a server asset (nitro.serverAssets in
 * nuxt.config.ts) and read here through useStorage. The RSS feed, the sitemap
 * source and the /api/writing routes all go through readWritingPosts, so the
 * markdown pipeline (js-yaml, marked) exists in exactly one place and never
 * reaches the client bundle.
 *
 * Frontmatter:
 *   ---
 *   title: "…"
 *   date: "2026-05-18"   # quote it so it stays a string
 *   excerpt: "…"
 *   tags: ["studio"]
 *   ---
 */

import type { WritingPostMeta } from "#shared/utils/writing";
import { load } from "js-yaml";
import { marked } from "marked";

interface Frontmatter {
  title?: string;
  date?: string | Date;
  excerpt?: string;
  tags?: string[];
}

export interface WritingSource {
  meta: WritingPostMeta;
  body: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

const toIsoDate = (value: string | Date | undefined) => {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
};

const slugFromPath = (path: string) =>
  path.split("/").pop()!.replace(/\.md$/, "");

// Split the `---` YAML frontmatter from the markdown body. We parse the YAML
// with js-yaml directly (NOT gray-matter, whose engine loader uses eval — which
// Cloudflare Workers reject at runtime).
const splitFrontmatter = (raw: string) => {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {} as Frontmatter, content: raw };
  return {
    data: (load(match[1] ?? "") ?? {}) as Frontmatter,
    content: match[2] ?? "",
  };
};

// Every post, reverse-chronological, with its raw markdown body.
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

    const { data: fm, content } = splitFrontmatter(text);
    const words = content.trim().split(/\s+/).filter(Boolean).length;

    posts.push({
      meta: {
        slug: slugFromPath(key),
        title: fm.title ?? "Untitled",
        date: toIsoDate(fm.date),
        excerpt: fm.excerpt ?? "",
        tags: fm.tags ?? [],
        readMinutes: Math.max(1, Math.round(words / 220)),
      },
      body: content,
    });
  }

  return posts.sort((a, b) => b.meta.date.localeCompare(a.meta.date));
};

// A <pre> that scrolls sideways is unreachable by keyboard unless it can take
// focus (WCAG 2.1.1). marked emits a bare <pre>, so stamp tabindex on the way
// out — a string pass over our own trusted output, no renderer subclassing.
export const renderPostHtml = (body: string) =>
  (marked.parse(body) as string).replaceAll("<pre>", '<pre tabindex="0">');
