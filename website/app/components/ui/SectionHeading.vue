<template>
  <div ref="el" class="reveal flex items-end justify-between gap-4">
    <div>
      <SectionEyebrow>{{ index }} — {{ eyebrow }}</SectionEyebrow>
      <h2
        class="mt-3 max-w-2xl font-display text-display-md font-semibold text-(--color)"
      >
        {{ title }}
      </h2>
    </div>
    <slot name="aside" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  /** Two-digit section index, e.g. "01". */
  index: string;
  /** Mono eyebrow label, e.g. "Selected work". */
  eyebrow: string;
  title: string;
}

defineProps<Props>();

const el = ref<HTMLElement | null>(null);
useScrollReveal(el);
</script>
