/**
 * Wire types for the writing API (server/api/writing), shared so the Nitro
 * routes that produce them and the composables/pages that consume them can't
 * drift. Types only — the markdown pipeline (js-yaml, marked) lives in
 * server/utils/writing.ts and must never be imported from client code.
 *
 * Responses follow the JSON:API document shape (`data` resource objects with
 * `type`/`id`/`attributes`, `meta` for non-resource data).
 */

export interface WritingPostMeta {
  slug: string;
  title: string;
  date: string;
  /** YYYY-MM-DD, only present when the post has been revised. */
  updated?: string;
  excerpt: string;
  tags: string[];
  readMinutes: number;
}

export interface WritingPostFull extends WritingPostMeta {
  html: string;
}

export interface WritingPostResource<T extends WritingPostMeta> {
  type: "posts";
  id: string;
  attributes: Omit<T, "slug">;
}

export interface WritingIndexDocument {
  data: WritingPostResource<WritingPostMeta>[];
  meta: { tags: string[] };
}

/** A chronological neighbour, enough to render a link. */
export interface WritingPostLink {
  slug: string;
  title: string;
}

export interface WritingPostDocument {
  data: WritingPostResource<WritingPostFull>;
  /** `previous` is the next-older post, `next` the next-newer; null at the ends. */
  meta: {
    previous: WritingPostLink | null;
    next: WritingPostLink | null;
  };
}
