<template>
  <nav
    v-if="previous || next"
    aria-label="More writing"
    class="grid gap-8 sm:grid-cols-2"
  >
    <NuxtLink
      v-if="previous"
      :to="`/writing/${previous.slug}`"
      rel="prev"
      class="group block py-1"
    >
      <span
        class="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase transition-colors group-hover:text-(--accent)"
      >
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        Previous
      </span>
      <span
        class="mt-2 block font-display text-lg font-semibold text-(--color) transition-colors group-hover:text-(--accent)"
      >
        {{ previous.title }}
      </span>
    </NuxtLink>

    <NuxtLink
      v-if="next"
      :to="`/writing/${next.slug}`"
      rel="next"
      class="group block py-1 sm:col-start-2 sm:text-right"
    >
      <span
        class="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase transition-colors group-hover:text-(--accent)"
      >
        Next
        <UIcon name="i-lucide-arrow-right" class="size-3.5" />
      </span>
      <span
        class="mt-2 block font-display text-lg font-semibold text-(--color) transition-colors group-hover:text-(--accent)"
      >
        {{ next.title }}
      </span>
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import type { WritingPostLink } from "#shared/utils/writing";

interface Props {
  /** The next-older post, or null on the oldest. */
  previous: WritingPostLink | null;
  /** The next-newer post, or null on the newest. */
  next: WritingPostLink | null;
}

defineProps<Props>();
</script>
