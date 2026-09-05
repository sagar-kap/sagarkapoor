<template>
  <article ref="el" class="reveal group border-t border-(--hairline) py-7">
    <NuxtLink :to="`/writing/${post.slug}`" class="block">
      <component
        :is="headingTag"
        class="font-display text-xl font-semibold text-(--color) transition-colors group-hover:text-(--accent) md:text-2xl"
      >
        {{ post.title }}
      </component>
      <p class="mt-2 line-clamp-2 max-w-2xl text-(--muted)">
        {{ post.excerpt }}
      </p>
      <div
        class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase"
      >
        <span v-if="post.date">{{ formatDate(post.date) }}</span>
        <span v-if="readLabel" aria-hidden="true">·</span>
        <span v-if="readLabel">{{ readLabel }}</span>
        <span v-if="firstTag" aria-hidden="true">·</span>
        <span v-if="firstTag" class="text-(--accent)">{{ firstTag }}</span>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
export interface PostTeaserData {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date string. */
  date: string;
  readMinutes?: number;
  tags?: string[];
}

/**
 * `headingTag` keeps the document outline honest: on the home page these
 * teasers sit under a section <h2>, so h3 is right; on /writing they sit
 * directly under the page <h1>, where h3 would skip a level.
 */
const props = withDefaults(
  defineProps<{ post: PostTeaserData; headingTag?: "h2" | "h3" }>(),
  { headingTag: "h3" },
);

const { formatDate } = useFormattedDate();
const { formatReadTime } = useFormattedReadTime();

const readLabel = computed(() =>
  formatReadTime({ minutes: props.post.readMinutes }),
);

const firstTag = computed(() => props.post.tags?.[0]);

const el = ref<HTMLElement | null>(null);
useScrollReveal(el);
</script>
