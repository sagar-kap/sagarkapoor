<template>
  <article class="mx-auto max-w-[44rem] px-6 pt-12 pb-24 md:pt-20 md:pb-32">
    <!-- Identity -->
    <header>
      <SectionEyebrow>About</SectionEyebrow>
      <h1
        class="mt-4 font-display text-display-lg font-semibold text-balance text-(--color)"
      >
        {{ about.identity }}
      </h1>
      <PixelScene
        scene="city"
        label="City lights below the mountains"
        class="mt-6"
      />
    </header>

    <!-- Now -->
    <section class="mt-10">
      <NowBlock :now="about.now" />
    </section>

    <!-- Things I've shipped -->
    <section class="mt-10">
      <SectionLabel>Things I've shipped</SectionLabel>
      <ul class="mt-6 space-y-4">
        <li
          v-for="thing in about.shipped"
          :key="thing.label"
          class="flex flex-col gap-1 border-t border-(--hairline) pt-4 sm:flex-row sm:items-baseline sm:gap-3"
        >
          <a
            :href="thing.href"
            target="_blank"
            rel="noopener noreferrer"
            class="-my-1 inline-block py-1 font-mono text-sm text-(--accent) transition-colors hover:text-(--accent-hover)"
          >
            {{ thing.label }} ↗
          </a>
          <span class="text-(--muted)">{{ thing.note }}</span>
        </li>
      </ul>
    </section>
    <TradingStudy />
  </article>
</template>

<script setup lang="ts">
import { aboutContent as about } from "../data/about";

useSeoMeta({
  title: "About",
  description: "A little about Sagar Kapoor, his interests, and his projects.",
});
</script>
