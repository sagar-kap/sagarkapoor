/**
 * Frontmatter parsing shared between the app (Vite-globbed markdown, see
 * app/utils/writing.ts) and the server (Nitro server assets, see
 * server/routes/rss.xml.get.ts). Lives under shared/ so both sides — the
 * client bundle and the Nitro server bundle — can import it via the
 * #shared alias without duplicating the parsing logic.
 *
 * Frontmatter:
 *   ---
 *   title: "…"
 *   date: "2026-05-18"   # quote it so it stays a string
 *   excerpt: "…"
 *   tags: ["studio"]
 *   ---
 */

import { load } from "js-yaml";

export interface WritingPostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  readMinutes: number;
}

export interface Frontmatter {
  title?: string;
  date?: string | Date;
  excerpt?: string;
  tags?: string[];
}

export const toIsoDate = (value: string | Date | undefined) => {
  if (!value) return "";
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
};

export const slugFromPath = (path: string) =>
  path.split("/").pop()!.replace(/\.md$/, "");

// Split the `---` YAML frontmatter from the markdown body. We parse the YAML
// with js-yaml directly (NOT gray-matter, whose engine loader uses eval — which
// Cloudflare Workers reject at runtime).
export const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export const splitFrontmatter = (raw: string) => {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: {} as Frontmatter, content: raw };
  return {
    data: (load(match[1] ?? "") ?? {}) as Frontmatter,
    content: match[2] ?? "",
  };
};
