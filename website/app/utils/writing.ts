import yaml from "js-yaml";
import { marked } from "marked";

/**
 * Git-controlled blog. Posts are plain markdown files under
 * app/content/writing/*.md with YAML frontmatter — no CMS, no database, no
 * runtime API. Vite globs them at build time; the list is bundled and every
 * /writing route prerenders to static HTML.
 *
 * Frontmatter:
 *   ---
 *   title: "…"
 *   date: "2026-05-18"   # quote it so it stays a string
 *   excerpt: "…"
 *   tags: ["studio"]
 *   ---
 */

export interface WritingPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readMinutes: number;
}

export interface WritingPostFull extends WritingPostMeta {
  html: string;
}

interface Frontmatter {
  title?: string;
  date?: string | Date;
  excerpt?: string;
  tags?: string[];
}

// Raw markdown, keyed by file path, resolved at build by Vite.
const files = import.meta.glob("../content/writing/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

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
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

const splitFrontmatter = (raw: string) => {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {} as Frontmatter, content: raw };
  return {
    data: (yaml.load(match[1] ?? "") ?? {}) as Frontmatter,
    content: match[2] ?? "",
  };
};

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
