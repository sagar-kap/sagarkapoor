<template>
  <section class="mx-auto max-w-[72rem] px-6 pt-12 pb-24 md:pt-16 md:pb-32">
    <header class="flex items-center justify-between gap-6">
      <h1 class="font-display text-display-lg font-semibold">Work</h1>
      <PixelScene
        scene="studio"
        label="Studio monitor power"
        class="max-w-32 sm:max-w-56"
      />
    </header>
    <div class="mt-8 grid gap-6 sm:grid-cols-2">
      <WorkCard
        v-for="study in caseStudies"
        :key="study.slug"
        :study="study"
        heading-tag="h2"
      />
    </div>

    <section class="mt-12">
      <h2 class="font-display text-2xl font-semibold">More projects</h2>
      <ul class="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="project in galleryProjects" :key="project.url">
          <a
            class="block overflow-hidden rounded-xl border border-(--hairline) bg-(--surface) transition-colors hover:border-(--accent)"
            :href="project.url"
          >
            <img
              :src="project.screenshot"
              alt=""
              width="1280"
              height="720"
              loading="lazy"
              class="w-full border-b border-(--hairline)"
            />
            <span
              class="flex items-center justify-between gap-2 p-4 font-display text-xl font-semibold"
              >{{ project.name }}
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4 text-(--accent)"
            /></span>
          </a>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { caseStudies, galleryProjects } from "../../data/work";

useSeoMeta({
  title: "Work",
  description:
    "Projects by Sagar Kapoor, with screenshots, links, and case studies.",
});
</script>
