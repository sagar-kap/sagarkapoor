<template>
  <section ref="el" class="reveal mx-auto max-w-[64rem] px-6 py-16 md:py-20">
    <span
      class="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
    >
      <span class="h-px w-8 bg-burz-yellow-500" aria-hidden="true" />
      How it went
    </span>

    <ol class="timeline mt-10">
      <li
        v-for="(milestone, i) in milestones"
        :key="milestone.label"
        class="grid grid-cols-[2.75rem_1fr] gap-x-5 sm:grid-cols-[3.25rem_1fr]"
      >
        <!-- Node + connector -->
        <div class="flex flex-col items-center">
          <span
            class="flex size-11 shrink-0 items-center justify-center rounded-full border border-burz-yellow-500/60 bg-(--surface) font-mono text-xs font-semibold text-burz-yellow-500 sm:size-13"
          >
            {{ milestone.label }}
          </span>
          <span
            v-if="i < milestones.length - 1"
            class="mt-2 w-px flex-1 bg-(--hairline)"
            aria-hidden="true"
          />
        </div>

        <!-- Content -->
        <div class="pt-1.5 pb-10">
          <h3
            class="font-display text-xl font-semibold text-(--color) md:text-2xl"
          >
            {{ milestone.title }}
          </h3>
          <p class="mt-2 max-w-xl text-(--muted)">{{ milestone.body }}</p>
        </div>
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import type { Milestone } from "../data/work";

defineProps<{ milestones: Milestone[] }>();

const el = ref<HTMLElement | null>(null);
useScrollReveal(el);
</script>
