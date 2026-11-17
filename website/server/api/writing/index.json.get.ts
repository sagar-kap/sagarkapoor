/**
 * Writing index for the app — post meta (no bodies) plus the tag list.
 * Prerendered to a static file (nitro.routeRules in nuxt.config.ts), so it is
 * never computed at request time. Lives at /api/writing/index.json rather than
 * /api/writing because the prerender output is a file, and /api/writing/ is
 * also the directory holding the per-post files.
 */

import type { WritingIndexDocument } from "#shared/utils/writing";

export default defineEventHandler(async (): Promise<WritingIndexDocument> => {
  const posts = await readWritingPosts();

  return {
    data: posts.map(({ meta: { slug, ...attributes } }) => ({
      type: "posts",
      id: slug,
      attributes,
    })),
    meta: { tags: [...new Set(posts.flatMap((p) => p.meta.tags))].sort() },
  };
});
