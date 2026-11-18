<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <header ref="head" class="reveal max-w-3xl">
      <SectionEyebrow>Selected work</SectionEyebrow>
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
      <WorkCard
        v-for="study in caseStudies"
        :key="study.slug"
        :study="study"
        heading-tag="h2"
      />
    </div>

    <section class="mt-16">
      <h2 class="font-display text-2xl font-semibold">More projects</h2>
      <ul class="mt-4 flex flex-wrap gap-x-8 gap-y-3">
        <li v-for="project in linkedProjects" :key="project.url">
          <a class="underline underline-offset-4" :href="project.url">
            {{ project.name }}
          </a>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { caseStudies, linkedProjects } from "../../data/work";

useSeoMeta({
  title: "Work",
  description:
    "Selected Weburz case studies — the problem, the approach, and what changed for each engagement.",
});

const head = ref<HTMLElement | null>(null);
useScrollReveal(head);
</script>
