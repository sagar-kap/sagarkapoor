<template>
  <figure class="rounded-lg border border-(--hairline) p-4 sm:p-6">
    <figcaption class="flex flex-wrap items-baseline justify-between gap-2">
      <span class="font-serif text-xl">Liquidity sweep replay</span>
      <span class="text-xs text-(--muted)">Illustrative data</span>
    </figcaption>
    <SweepChart
      class="my-4 h-auto w-full"
      :count="count"
      :marked="marked"
      :description="status"
    />
    <p aria-live="polite" class="text-sm text-(--muted)">{{ status }}</p>
    <div class="mt-3 flex flex-wrap items-center gap-2">
      <UButton
        label="Back"
        :disabled="count === start"
        variant="ghost"
        @click="count--"
      />
      <UButton
        label="Next candle"
        :disabled="count === candles.length"
        @click="count++"
      />
      <UButton label="Restart" variant="ghost" @click="restart" />
      <label class="inline-flex items-center gap-2 px-2 py-2 text-sm"
        ><input v-model="marked" type="checkbox" />Show markup</label
      >
    </div>
  </figure>
</template>
<script setup lang="ts">
import { candles } from "../data/sweep";
const start = 9;
const count = ref(start);
const marked = ref(false);
const status = computed(() => {
  const bar = candles[count.value - 1]!;
  const annotation = !marked.value
    ? ""
    : count.value < 14
      ? " Previous high: 66."
      : " Candle 14 swept the previous high of 66.";
  return `Candle ${count.value} of ${candles.length} · High ${bar.high} · Close ${bar.close}.${annotation}`;
});
const restart = () => {
  count.value = start;
  marked.value = false;
};
</script>
