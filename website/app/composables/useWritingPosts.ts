import type { PostTeaserData } from "../components/PostTeaser.vue";
import { allPosts } from "../utils/writing";

/**
 * The writing index, straight from the git-controlled markdown bundle (no fetch,
 * no CMS). Returned as a `computed` per house convention; pass a reactive `tag`
 * to filter or a `limit` for teasers (home, contact).
 */
export const useWritingPosts = (
  options: { limit?: number; tag?: Ref<string | undefined> } = {},
) => {
  const { limit, tag } = options;

  const posts = computed<PostTeaserData[]>(() => {
    let list = allPosts;
    if (tag?.value) {
      list = list.filter((post) => post.tags.includes(tag.value as string));
    }
    if (limit) {
      list = list.slice(0, limit);
    }
    return list.map((post) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      date: post.date,
      readMinutes: post.readMinutes,
      tags: post.tags,
    }));
  });

  return { posts };
};
