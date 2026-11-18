<template>
  <NuxtLink
    :to="`/work/${study.slug}`"
    class="group block overflow-hidden rounded-xl border border-(--hairline) bg-(--surface) transition-colors hover:border-(--accent)"
  >
    <img
      :src="study.screenshot"
      alt=""
      width="1280"
      height="720"
      class="w-full border-b border-(--hairline)"
    />
    <div class="p-5">
      <component :is="headingTag" class="font-display text-2xl font-semibold">
        {{ study.client }}
      </component>
      <p class="mt-1 text-(--muted)">{{ study.project }}</p>
      <span class="mt-4 inline-flex items-center gap-2 text-sm text-(--accent)"
        >Read case study <UIcon name="i-lucide-arrow-right"
      /></span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { CaseStudy } from "../data/work";

withDefaults(defineProps<{ study: CaseStudy; headingTag?: "h2" | "h3" }>(), {
  headingTag: "h3",
});
</script>
