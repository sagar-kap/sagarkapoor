<template>
  <div
    class="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase"
  >
    <time :datetime="post.date">{{ formatDate(post.date) }}</time>
    <span aria-hidden="true">·</span>
    <span>{{ post.readMinutes }} min read</span>
    <template v-if="tag">
      <span aria-hidden="true">·</span>
      <span class="text-(--accent)">{{ tag }}</span>
    </template>
    <template v-if="updated">
      <span aria-hidden="true">·</span>
      <span
        >Updated
        <time :datetime="updated">{{ formatDate(updated) }}</time></span
      >
    </template>
  </div>
</template>

<script setup lang="ts">
import type { WritingPostMeta } from "#shared/utils/writing";

defineProps<{
  post: Pick<WritingPostMeta, "date" | "readMinutes">;
  tag?: string;
  updated?: string;
}>();
</script>
