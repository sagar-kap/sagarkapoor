<template>
  <div
    ref="el"
    class="reveal rounded-xl border border-(--hairline) bg-(--surface) p-6 sm:p-8"
  >
    <div class="flex items-baseline justify-between gap-4">
      <SectionLabel as="h3">Now</SectionLabel>
      <span
        class="font-mono text-xs tracking-[0.12em] text-(--muted) uppercase"
      >
        Updated {{ formatDate(now.updated) }}
      </span>
    </div>

    <ul class="mt-6 space-y-3">
      <li
        v-for="item in now.items"
        :key="item"
        class="flex gap-3 text-(--color)"
      >
        <span
          class="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-500"
          aria-hidden="true"
        />
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  now: { updated: string; items: readonly string[] };
}>();

const el = ref<HTMLElement | null>(null);
useScrollReveal(el);
</script>
