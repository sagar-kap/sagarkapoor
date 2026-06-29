<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <header class="max-w-3xl">
      <span
        class="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
      >
        <span class="h-px w-8 bg-burz-yellow-500" aria-hidden="true" />
        Writing
      </span>
      <h1
        class="mt-4 font-display text-display-lg font-semibold text-(--color)"
      >
        Notes from the workshop.
      </h1>
      <p class="mt-5 text-lg text-(--muted)">
        Software, design, and the craft of running a studio. Written plainly,
        first person.
      </p>
    </header>

    <div class="mt-14 grid gap-10 lg:grid-cols-[1fr_14rem] lg:gap-16">
      <!-- Post list -->
      <div>
        <!-- Mobile tag filter -->
        <div v-if="tags.length" class="mb-8 flex flex-wrap gap-2 lg:hidden">
          <button
            v-for="chip in tagChips"
            :key="chip.slug"
            type="button"
            class="rounded-full border px-3 py-1 font-mono text-xs tracking-[0.1em] uppercase transition-colors"
            :class="
              selectedTag === chip.slug
                ? 'border-teal-500 text-teal-500'
                : 'border-(--hairline) text-(--muted)'
            "
            @click="toggleTag(chip.slug)"
          >
            {{ chip.name }}
          </button>
        </div>

        <div v-if="posts.length">
          <PostTeaser v-for="post in posts" :key="post.slug" :post="post" />
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
          <li v-for="chip in tagChips" :key="chip.slug">
            <button
              type="button"
              class="font-mono text-sm transition-colors"
              :class="
                selectedTag === chip.slug
                  ? 'text-teal-500'
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
  description:
    "Essays on building software and running a studio — engineering, design, clients, and pricing.",
});

const route = useRoute();
const router = useRouter();

// Selected tag is mirrored in the URL (?tag=) so filtered views are linkable.
const selectedTag = ref<string | undefined>(
  typeof route.query.tag === "string" ? route.query.tag : undefined,
);

const { tags } = useWritingTags();
const { posts } = useWritingPosts({ tag: selectedTag });

const tagChips = computed(() => tags.value);

const toggleTag = (slug: string) => {
  selectedTag.value = selectedTag.value === slug ? undefined : slug;
  router.replace({
    query: selectedTag.value ? { tag: selectedTag.value } : {},
  });
};
</script>
