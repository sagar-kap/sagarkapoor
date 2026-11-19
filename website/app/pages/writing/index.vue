<template>
  <section class="mx-auto max-w-[54rem] px-6 pt-12 pb-24 md:pt-20 md:pb-32">
    <header class="grid items-center gap-5 sm:grid-cols-[1fr_15rem]">
      <div>
        <h1
          class="mt-4 font-display text-display-lg font-semibold text-(--color)"
        >
          Writing
        </h1>
        <!-- Plain anchor: /rss.xml is a prerendered file, not a route. -->
        <a
          href="/rss.xml"
          class="mt-6 inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-(--accent) uppercase transition-colors hover:text-(--accent-hover)"
        >
          <UIcon name="i-lucide-rss" class="size-3.5" />
          Subscribe via RSS
        </a>
      </div>
      <PixelScene scene="desk" label="Writing desk lamp" class="max-w-64" />
    </header>

    <div class="mt-8">
      <div
        v-if="tags.length"
        role="group"
        aria-label="Filter posts by tag"
        class="mb-6 flex flex-wrap gap-2"
      >
        <button
          v-for="chip in tags"
          :key="chip.slug"
          type="button"
          class="rounded-full border px-3 py-1.5 font-mono text-xs tracking-[0.1em] uppercase transition-colors"
          :aria-pressed="selectedTag === chip.slug"
          :class="
            selectedTag === chip.slug
              ? 'border-teal-500 text-(--accent)'
              : 'border-(--hairline) text-(--muted)'
          "
          @click="toggleTag(chip.slug)"
        >
          {{ chip.name }}
        </button>
      </div>

      <div v-if="posts.length">
        <PostTeaser
          v-for="post in posts"
          :key="post.slug"
          :post="post"
          heading-tag="h2"
        />
      </div>
      <p
        v-else
        class="border-t border-(--hairline) py-10 font-mono text-sm text-(--muted)"
      >
        Nothing under that tag yet — try another.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Writing",
  description: "Posts from Sagar Kapoor’s personal notebook.",
});

const route = useRoute();
const router = useRouter();

// The URL owns the filter — the ref used to be seeded from ?tag= once and then
// updated by hand, which meant Back/Forward moved the URL without moving the
// list. Deriving it keeps the two in step, and pushing (not replacing) makes
// Back clear the filter instead of leaving the site.
//
// The page is prerendered without a query (static hosting ignores it), so the
// server HTML always lists every post. The filter therefore only applies after
// mount: hydration renders what the server did, then the list narrows.
const mounted = ref(false);
onMounted(() => {
  mounted.value = true;
});

const selectedTag = computed(() =>
  mounted.value && typeof route.query.tag === "string"
    ? route.query.tag
    : undefined,
);

const { tags } = await useWritingTags();
const { posts } = await useWritingPosts({ tag: selectedTag });

const toggleTag = (slug: string) => {
  const next = selectedTag.value === slug ? undefined : slug;
  router.push({ query: next ? { tag: next } : {} });
};
</script>
