<template>
  <figure
    id="trading"
    class="mt-10 flex scroll-mt-24 flex-wrap items-center justify-between gap-x-8 gap-y-2 border-y border-(--hairline) py-5"
  >
    <figcaption>
      <h2 class="font-serif text-2xl text-(--color)">Trading notes</h2>
      <p class="mt-1 text-sm text-(--muted)">
        <NuxtLink
          to="/writing/reading-a-sweep"
          class="underline underline-offset-4"
          >Replay the liquidity sweep →</NuxtLink
        >
      </p>
    </figcaption>
    <SweepChart
      :count="candles.length"
      marked
      description="Price briefly trades above the previous high before falling back below it."
    />
  </figure>
</template>
<script setup lang="ts">
import { candles } from "../data/sweep";
</script>
