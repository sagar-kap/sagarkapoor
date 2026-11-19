<template>
  <section>
    <div class="flex flex-wrap items-baseline justify-between gap-4">
      <h2 class="font-display text-display-md font-semibold">More writing</h2>
      <UButton
        to="/writing"
        label="All posts"
        trailing-icon="i-lucide-arrow-right"
        color="neutral"
        variant="ghost"
        class="font-mono text-xs tracking-[0.12em] uppercase"
      />
    </div>

    <div class="mt-6">
      <PostTeaser v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { PostTeaserData } from "../PostTeaser.vue";
defineProps<{ posts: PostTeaserData[] }>();
</script>
