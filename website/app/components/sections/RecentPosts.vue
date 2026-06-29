<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <SectionHeading
      index="02"
      eyebrow="Writing"
      title="Things worth writing down."
    >
      <template #aside>
        <UButton
          to="/writing"
          label="All posts"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          class="hidden font-mono text-xs tracking-[0.12em] uppercase sm:inline-flex"
        />
      </template>
    </SectionHeading>

    <div class="mt-10">
      <PostTeaser v-for="post in posts" :key="post.slug" :post="post" />
    </div>
  </section>
</template>

<script setup lang="ts">
// Three most recent posts from the git-controlled markdown bundle.
const { posts } = useWritingPosts({ limit: 3 });
</script>
