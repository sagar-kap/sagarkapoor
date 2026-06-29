import { allTags } from "../utils/writing";

export interface WritingTag {
  name: string;
  slug: string;
}

/**
 * Tags drawn from the markdown frontmatter across all posts. Returned as a
 * `computed` so the /writing filter stays typed. Name and slug are the same
 * here (tags are simple lowercase strings).
 */
export const useWritingTags = () => {
  const tags = computed<WritingTag[]>(() =>
    allTags.map((tag) => ({ name: tag, slug: tag })),
  );

  return { tags };
};
