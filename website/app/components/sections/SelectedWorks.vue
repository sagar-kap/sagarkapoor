<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <SectionHeading index="01" eyebrow="Work" title="Things I've built.">
      <template #aside>
        <UButton
          to="/work"
          label="All work"
          trailing-icon="i-lucide-arrow-right"
          color="neutral"
          variant="ghost"
          class="hidden font-mono text-xs tracking-[0.12em] uppercase sm:inline-flex"
        />
      </template>
    </SectionHeading>

    <div class="mt-12 flex flex-col gap-6">
      <WorkCard
        v-for="study in featuredCaseStudies"
        :key="study.slug"
        :study="study"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { featuredCaseStudies } from "../../data/work";
</script>
