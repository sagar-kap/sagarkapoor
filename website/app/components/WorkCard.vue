<template>
  <div ref="el" class="reveal">
    <NuxtLink
      :to="`/work/${study.slug}`"
      class="group block rounded-xl border border-(--hairline) bg-(--surface) p-6 transition-all duration-300 hover:border-burz-yellow-500/40 hover:shadow-[0_18px_50px_oklch(from_var(--color-teal-500)_l_c_h_/_0.18)] sm:p-8"
    >
      <div class="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div class="min-w-0 flex-1">
          <span
            class="font-mono text-xs tracking-[0.2em] text-(--muted) uppercase"
          >
            {{ study.client }} · {{ study.period }}
          </span>
          <h3
            class="mt-3 font-display text-2xl font-semibold text-(--color) md:text-3xl"
          >
            {{ study.project }}
          </h3>
          <p class="mt-2 max-w-xl text-(--muted)">{{ study.outcome }}</p>
          <span
            class="mt-5 inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-teal-500 uppercase transition-colors group-hover:text-coral-500"
          >
            Read case study
            <UIcon
              name="i-lucide-arrow-right"
              class="size-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>

        <!-- Small chrome-framed visual placeholder; swap in real shots later. -->
        <BrowserFrame
          class="w-full shrink-0 sm:w-56 md:w-64"
          :label="study.client"
        />
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { CaseStudy } from "../data/work";

defineProps<{ study: CaseStudy }>();

const el = ref<HTMLElement | null>(null);
useScrollReveal(el);
</script>
