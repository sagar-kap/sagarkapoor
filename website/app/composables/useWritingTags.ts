export interface WritingTag {
  name: string;
  slug: string;
}

/**
 * Tags drawn from the markdown frontmatter across all posts (via the
 * prerendered /api/writing data, see useWritingIndex). Returned as a
 * `computed` so the /writing filter stays typed. Name and slug are the same
 * here (tags are simple lowercase strings). Async — await it in
 * `<script setup>`.
 */
export const useWritingTags = async () => {
  const { index } = await useWritingIndex();

  const tags = computed<WritingTag[]>(() =>
    (index.value?.tags ?? []).map((tag) => ({ name: tag, slug: tag })),
  );

  return { tags };
};
