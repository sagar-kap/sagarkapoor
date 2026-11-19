/**
 * Frontmatter parsing and validation for the writing markdown — pure functions
 * with no Nitro globals, so server/utils/writing.ts and nuxt.config.ts (which
 * has to know which posts are drafts) can both import it. Server-only: js-yaml
 * must never reach the client bundle.
 */

import { load } from "js-yaml";

export interface Frontmatter {
  title: string;
  /** YYYY-MM-DD */
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  /** YYYY-MM-DD, when set. */
  updated?: string;
}

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const KNOWN_KEYS = new Set([
  "title",
  "date",
  "excerpt",
  "tags",
  "draft",
  "updated",
]);

// Split the `---` YAML frontmatter from the markdown body. We parse the YAML
// with js-yaml directly (NOT gray-matter, whose engine loader uses eval — which
// Cloudflare Workers reject at runtime). The data is unvalidated here; see
// validateFrontmatter.
export const splitFrontmatter = (raw: string, file: string) => {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { data: undefined, content: raw };
  return {
    data: load(match[1] ?? "", { filename: file }) ?? {},
    content: match[2] ?? "",
  };
};

// Unquoted dates are parsed by YAML into Date objects (at UTC midnight).
const asIsoDate = (value: unknown) =>
  value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toISOString().slice(0, 10)
    : value;

const isRealDate = (value: string) => {
  if (!ISO_DATE_RE.test(value)) return false;
  const timestamp = Date.parse(value);
  return (
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().startsWith(value)
  );
};

// Hand-written on purpose — five fields don't justify a schema library. Every
// problem is collected so one build run reports the whole file, and the error
// names the file so the offending post is obvious in the build log.
export const validateFrontmatter = (
  data: unknown,
  file: string,
): Frontmatter => {
  const problems: string[] = [];

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error(
      `${file}: missing or malformed frontmatter (expected a --- YAML block at the top)`,
    );
  }
  const fm = data as Record<string, unknown>;

  for (const key of Object.keys(fm)) {
    if (!KNOWN_KEYS.has(key)) {
      problems.push(
        `unknown field "${key}" (known: ${[...KNOWN_KEYS].join(", ")})`,
      );
    }
  }

  const requiredString = (key: "title" | "excerpt") => {
    const value = fm[key];
    if (typeof value === "string" && value.trim()) return value;
    problems.push(
      value === undefined
        ? `missing required field "${key}"`
        : `field "${key}" must be a non-empty string`,
    );
    return "";
  };

  const isoDate = (key: "date" | "updated", required: boolean) => {
    const value = asIsoDate(fm[key]);
    if (value === undefined || value === null) {
      if (required) problems.push(`missing required field "${key}"`);
      return "";
    }
    if (typeof value !== "string" || !isRealDate(value)) {
      problems.push(
        `field "${key}" must be a real date written YYYY-MM-DD, got ${JSON.stringify(value)}`,
      );
      return "";
    }
    return value;
  };

  const title = requiredString("title");
  const excerpt = requiredString("excerpt");
  const date = isoDate("date", true);
  const updated = isoDate("updated", false);

  if (date && updated && updated < date) {
    problems.push(`field "updated" (${updated}) is earlier than "date"`);
  }

  const tags = fm.tags ?? [];
  if (!Array.isArray(tags) || tags.some((tag) => typeof tag !== "string")) {
    problems.push(`field "tags" must be an array of strings`);
  }

  const draft = fm.draft ?? false;
  if (typeof draft !== "boolean") {
    problems.push(`field "draft" must be true or false`);
  }

  if (problems.length) {
    throw new Error(
      `${file}: invalid frontmatter\n${problems.map((p) => `  - ${p}`).join("\n")}`,
    );
  }

  return {
    title,
    date,
    excerpt,
    tags: tags as string[],
    draft: draft as boolean,
    ...(updated && { updated }),
  };
};
