import type { WritingIndexDocument } from "#shared/utils/writing";

/**
 * The writing index as the app consumes it: flat post meta plus the tag list.
 * Fetched once from the prerendered /api/writing/index.json (server/api/writing)
 * and reused by the home, writing and contact pages.
 *
 * First load of a prerendered page: the data is already inlined in the HTML
 * payload, so nothing is fetched. Client-side navigation: the first page that
 * needs it requests the static JSON file (served by Pages, not the Worker);
 * getCachedData then keeps it for the rest of the session — Nuxt's default only
 * reuses payload data while hydrating, which would refetch on every navigation.
 * Safe because the content cannot change without a redeploy.
 */
export const useWritingIndex = async () => {
  const { data } = await useFetch("/api/writing/index.json", {
    key: "writing-index",
    transform: (doc: WritingIndexDocument) => ({
      posts: doc.data.map(({ id, attributes }) => ({
        slug: id,
        ...attributes,
      })),
      tags: doc.meta.tags,
    }),
    getCachedData: (key, nuxtApp) =>
      nuxtApp.payload.data[key] ?? nuxtApp.static.data[key],
  });

  return {
    posts: computed(() => data.value?.posts ?? []),
    tags: computed(() => data.value?.tags ?? []),
  };
};
