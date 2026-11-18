<template>
  <header class="grid items-center gap-8 md:grid-cols-[3fr_2fr] md:gap-14">
    <div>
      <h1 class="font-display text-display-xl text-(--color)">I'm Sagar.</h1>
      <p
        class="mt-5 max-w-lg text-lg leading-relaxed text-(--muted) md:text-xl"
      >
        {{ identity.bio }} This is where I keep my notes.
      </p>
    </div>
    <section
      class="notebook relative rounded-sm border border-(--hairline) border-l-4 border-l-(--accent) bg-(--surface) px-6 py-6 md:-rotate-1 md:px-8"
    >
      <div class="flex flex-wrap items-baseline justify-between gap-2">
        <SectionLabel>Notebook</SectionLabel>
        <time
          :datetime="about.now.updated"
          class="font-mono text-xs text-(--muted)"
          >{{ formatDate(about.now.updated) }}</time
        >
      </div>
      <ul class="mt-4 space-y-2 text-base leading-7">
        <li v-for="item in about.now.items" :key="item">{{ item }}</li>
      </ul>
      <NuxtLink
        to="/about"
        class="mt-5 inline-block text-sm underline underline-offset-4"
        >More about me</NuxtLink
      >
    </section>
  </header>
</template>

<script setup lang="ts">
import { aboutContent as about } from "../../data/about";
import { identity } from "../../data/site";

const { formatDate } = useFormattedDate();
</script>

<style scoped>
.notebook {
  background-image: radial-gradient(var(--hairline) 1px, transparent 1px);
  background-size: 10px 10px;
}
</style>
