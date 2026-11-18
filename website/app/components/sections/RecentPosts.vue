<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <div class="flex flex-wrap items-baseline justify-between gap-4">
      <h2 class="font-display text-display-md font-semibold">Latest posts</h2>
      <UButton
        to="/writing"
        label="All posts"
        trailing-icon="i-lucide-arrow-right"
        color="neutral"
        variant="ghost"
        class="font-mono text-xs tracking-[0.12em] uppercase"
      />
    </div>

    <div class="mt-10">
      <PostTeaser v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Three most recent posts, from the prerendered writing data.
const { posts } = await useWritingPosts({ limit: 3 });
</script>
