<template>
  <article v-if="study">
    <!-- Header -->
    <header class="mx-auto max-w-[64rem] px-6 pt-24 pb-12 md:pt-32">
      <NuxtLink
        to="/work"
        class="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase transition-colors hover:text-teal-500"
      >
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        All work
      </NuxtLink>

      <span
        class="mt-8 block font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
      >
        {{ study.client }} · {{ study.period }}
      </span>
      <h1
        class="mt-3 max-w-3xl font-display text-display-lg font-semibold text-(--color)"
      >
        {{ study.project }}
      </h1>
      <p
        class="mt-4 font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
      >
        {{ study.role }}
      </p>
    </header>

    <!-- Problem / Approach / Outcome -->
    <div class="mx-auto max-w-[64rem] space-y-16 px-6 pb-16">
      <section>
        <h2
          class="font-mono text-sm tracking-[0.2em] text-burz-yellow-500 uppercase"
        >
          Problem
        </h2>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-(--color)">
          {{ study.problem }}
        </p>
      </section>

      <section>
        <h2
          class="font-mono text-sm tracking-[0.2em] text-burz-yellow-500 uppercase"
        >
          Approach
        </h2>
        <div class="mt-4 max-w-2xl space-y-4">
          <p
            v-for="(para, i) in study.approach"
            :key="i"
            class="text-lg leading-relaxed text-(--muted)"
          >
            {{ para }}
          </p>
        </div>
      </section>

      <section>
        <h2
          class="font-mono text-sm tracking-[0.2em] text-burz-yellow-500 uppercase"
        >
          Outcome
        </h2>
        <p
          class="mt-4 max-w-2xl font-display text-display-md font-semibold text-(--color)"
        >
          {{ study.result }}
        </p>
      </section>
    </div>

    <!-- Project milestones, as a scroll-pinned horizontal walk (desktop);
         a static vertical stack on mobile / reduced motion. -->
    <CaseStudyMilestones :milestones="study.milestones" />

    <!-- Pull quote -->
    <div v-if="study.quote" class="mx-auto max-w-[64rem] px-6 py-16 md:py-24">
      <Divider class="max-w-md" />
      <blockquote class="mt-12 max-w-3xl">
        <p
          class="font-display text-display-md font-semibold text-balance text-(--color)"
        >
          “{{ study.quote.text }}”
        </p>
        <footer
          class="mt-5 font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
        >
          {{ study.quote.author }} · {{ study.quote.role }}
        </footer>
      </blockquote>
    </div>

    <!-- Stack -->
    <div class="mx-auto max-w-[64rem] px-6 pb-24">
      <h2 class="font-mono text-sm tracking-[0.2em] text-(--muted) uppercase">
        Built with
      </h2>
      <div class="mt-4 flex flex-wrap gap-2">
        <UBadge
          v-for="tech in study.stack"
          :key="tech"
          :label="tech"
          color="neutral"
          variant="subtle"
          class="font-mono text-xs tracking-[0.1em] uppercase"
        />
      </div>

      <div class="mt-16">
        <UButton
          to="/contact"
          label="Say hello"
          trailing-icon="i-lucide-arrow-right"
          color="primary"
          size="xl"
        />
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { findCaseStudy } from "../../data/work";

const route = useRoute();
const study = computed(() => findCaseStudy(route.params.slug as string));

if (!study.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Case study not found",
    fatal: true,
  });
}

useSeoMeta({
  title: () => (study.value ? `${study.value.project} — Work` : "Work"),
  description: () => study.value?.outcome ?? "",
});
</script>
