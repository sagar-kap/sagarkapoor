<template>
  <article
    class="group"
    :class="featured ? 'pt-4 pb-7' : 'border-t border-(--hairline) py-7'"
  >
    <NuxtLink :to="`/writing/${post.slug}`" class="block">
      <component
        :is="headingTag"
        class="font-serif leading-tight text-balance text-(--color) transition-colors group-hover:text-(--accent)"
        :class="featured ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'"
      >
        {{ post.title }}
      </component>
      <p
        class="mt-2 max-w-2xl text-(--muted)"
        :class="{ 'line-clamp-2': !featured }"
      >
        {{ post.excerpt }}
      </p>
      <PostMetadata :post="post" :tag="post.tags[0]" class="mt-4" />
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
import type { WritingPostMeta } from "#shared/utils/writing";

/**
 * `headingTag` keeps the document outline honest: on the home page these
 * teasers sit under a section <h2>, so h3 is right; on /writing they sit
 * directly under the page <h1>, where h3 would skip a level.
 */
withDefaults(
  defineProps<{
    post: WritingPostMeta;
    headingTag?: "h2" | "h3";
    featured?: boolean;
  }>(),
  { headingTag: "h3" },
);
</script>
