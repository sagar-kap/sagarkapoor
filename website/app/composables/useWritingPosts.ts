import { allPosts, type WritingPostMeta } from "../utils/writing";

/**
 * The writing index, straight from the git-controlled markdown bundle (no fetch,
 * no CMS). Returned as a `computed` per house convention; pass a reactive `tag`
 * to filter or a `limit` for teasers (home, contact). Yields the full post
 * meta — consumers like PostTeaser declare the narrower shape they need and
 * TypeScript checks it structurally, so the data layer never depends on a
 * component.
 */
export const useWritingPosts = (
  options: { limit?: number; tag?: Ref<string | undefined> } = {},
) => {
  const { limit, tag } = options;

  const posts = computed<WritingPostMeta[]>(() => {
    let list = allPosts;
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
