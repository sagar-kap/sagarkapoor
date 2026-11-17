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

export interface WritingPostDocument {
  data: WritingPostResource<WritingPostFull>;
}
