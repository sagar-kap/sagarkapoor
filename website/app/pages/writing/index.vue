<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <header class="max-w-3xl">
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
    </header>

    <div class="mt-14 grid gap-10 lg:grid-cols-[1fr_14rem] lg:gap-16">
      <!-- Post list -->
      <div>
        <!-- Mobile tag filter -->
        <div v-if="tags.length" class="mb-8 flex flex-wrap gap-2 lg:hidden">
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

      <!-- Desktop tag sidebar -->
      <aside v-if="tags.length" class="hidden lg:block">
        <p class="font-mono text-xs tracking-[0.2em] text-(--muted) uppercase">
          Filter
        </p>
        <ul class="mt-4 space-y-1">
          <li v-for="chip in tags" :key="chip.slug">
            <button
              type="button"
              class="-my-1 py-1 font-mono text-sm transition-colors"
              :aria-pressed="selectedTag === chip.slug"
              :class="
                selectedTag === chip.slug
                  ? 'text-(--accent)'
                  : 'text-(--muted) hover:text-(--color)'
              "
              @click="toggleTag(chip.slug)"
            >
              {{ selectedTag === chip.slug ? "→ " : "" }}{{ chip.name }}
            </button>
          </li>
        </ul>
      </aside>
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
