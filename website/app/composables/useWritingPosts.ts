import type { WritingPostMeta } from "#shared/utils/writing";

/**
 * The writing index, read from the prerendered /api/writing data (see
 * useWritingIndex) — no CMS, no markdown in the client. Returned as a
 * `computed` per house convention; pass a reactive `tag` to filter or a `limit`
 * for teasers (home, contact). Yields the full post meta — consumers like
 * PostTeaser declare the narrower shape they need and TypeScript checks it
 * structurally, so the data layer never depends on a component.
 *
 * Async: await it in `<script setup>` so the list is there before first render
 * on client-side navigation too.
 */
export const useWritingPosts = async (
  options: { limit?: number; tag?: Ref<string | undefined> } = {},
) => {
  const { limit, tag } = options;
  const { index } = await useWritingIndex();

  const posts = computed<WritingPostMeta[]>(() => {
    let list = index.value?.posts ?? [];
    const selected = tag?.value;
    if (selected) {
      list = list.filter((post) => post.tags.includes(selected));
    }
    if (limit) {
      list = list.slice(0, limit);
    }
    return list;
  });

  return { posts };
};
