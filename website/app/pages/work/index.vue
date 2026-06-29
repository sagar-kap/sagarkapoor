<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <header ref="head" class="reveal max-w-3xl">
      <span
        class="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
      >
        <span class="h-px w-8 bg-burz-yellow-500" aria-hidden="true" />
        Selected work
      </span>
      <h1
        class="mt-4 font-display text-display-lg font-semibold text-(--color)"
      >
        Work I've built.
      </h1>
      <p class="mt-5 text-lg text-(--muted)">
        A handful of projects, and what each one needed at the time — the
        problem, the approach, and what changed once it shipped.
      </p>
    </header>

    <div class="mt-14 flex flex-col gap-6">
      <WorkCard v-for="study in caseStudies" :key="study.slug" :study="study" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { caseStudies } from "../../data/work";

useSeoMeta({
  title: "Work",
  description:
    "Selected Weburz case studies — the problem, the approach, and the measurable outcome for each engagement.",
});

const head = ref<HTMLElement | null>(null);
useScrollReveal(head);
</script>
