<template>
  <article v-if="study">
    <!-- Header -->
    <header class="mx-auto max-w-[64rem] px-6 pt-12 pb-12 md:pt-20">
      <NuxtLink
        to="/work"
        class="-my-1.5 inline-flex items-center gap-2 py-1.5 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase transition-colors hover:text-(--accent)"
      >
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        All work
      </NuxtLink>

      <span
        class="mt-8 block font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
      >
        {{ study.client
        }}<template v-if="study.period"> · {{ study.period }}</template>
      </span>
      <h1
        class="mt-3 max-w-3xl font-display text-display-lg font-semibold text-(--color)"
      >
        {{ study.project }}
      </h1>
      <p
        v-if="study.role"
        class="mt-4 font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
      >
        {{ study.role }}
      </p>
      <figure
        class="mt-8 overflow-hidden rounded-lg border border-(--hairline) bg-(--surface)"
      >
        <figcaption class="flex items-center gap-2 px-4 py-2">
          <img
            src="/scenes/studio-lit.png"
            alt=""
            width="240"
            height="78"
            class="w-14 rounded-sm [image-rendering:pixelated]"
          />
          <a
            :href="study.url"
            class="ml-auto inline-flex items-center gap-2 text-sm text-(--accent) underline underline-offset-4"
            >Visit {{ study.client }} <UIcon name="i-lucide-arrow-up-right"
          /></a>
        </figcaption>
        <img
          :src="study.screenshot"
          :alt="study.client + ' homepage'"
          width="1280"
          height="720"
          class="w-full border-t border-(--hairline)"
        />
      </figure>
    </header>

    <!-- Problem / Approach / Outcome -->
    <div class="mx-auto max-w-[64rem] space-y-16 px-6 pb-16">
      <section>
        <SectionLabel>Problem</SectionLabel>
        <p class="mt-4 max-w-2xl text-lg leading-relaxed text-(--color)">
          {{ study.problem }}
        </p>
      </section>

      <section>
        <SectionLabel>Approach</SectionLabel>
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
        <SectionLabel>Outcome</SectionLabel>
        <p
          class="mt-4 max-w-2xl font-display text-display-md font-semibold text-(--color)"
        >
          {{ study.result }}
        </p>
      </section>
    </div>

    <!-- Project milestones, as a vertical timeline -->
    <CaseStudyMilestones
      v-if="study.milestones.length"
      :milestones="study.milestones"
    />

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
      <SectionLabel muted>Built with</SectionLabel>
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
          :href="study.url"
          label="Visit site"
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
  title: () =>
    study.value ? `${study.value.client} — ${study.value.project}` : "Work",
  description: () => study.value?.outcome ?? "",
});
</script>
