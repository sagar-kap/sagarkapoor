<template>
  <header class="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] md:gap-14">
    <div>
      <h1 class="font-display text-display-xl text-(--color)">I'm Sagar.</h1>
      <p
        class="mt-5 max-w-lg text-lg leading-relaxed text-(--muted) md:text-xl"
      >
        {{ identity.bio }} This is where I keep my notes.
      </p>
      <PixelShoreline />
    </div>
    <section
      v-if="post"
      class="feature relative min-w-0 rounded-lg border border-(--hairline) border-t-2 border-t-(--accent) bg-(--surface) px-6 sm:px-9"
    >
      <p
        class="pt-6 font-mono text-xs tracking-[0.18em] text-(--label) uppercase"
      >
        Latest essay
      </p>
      <PostTeaser :post="post" heading-tag="h2" featured />
    </section>
  </header>
</template>

<script setup lang="ts">
import { identity } from "../../data/site";
import type { PostTeaserData } from "../PostTeaser.vue";

defineProps<{ post?: PostTeaserData }>();
</script>

<style scoped>
.feature {
  background-image: radial-gradient(
    ellipse at top right,
    color-mix(in srgb, var(--accent) 11%, transparent),
    transparent 65%
  );
}
</style>
