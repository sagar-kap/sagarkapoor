<template>
  <section class="mx-auto max-w-[72rem] px-6 py-16">
    <div
      ref="el"
      class="reveal grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-(--hairline) sm:grid-cols-3"
    >
      <div
        v-for="signal in trustSignals"
        :key="signal.label"
        class="bg-(--surface) px-6 py-8 text-center"
      >
        <p class="font-display text-display-md font-semibold text-(--color)">
          {{ signal.value }}
        </p>
        <p
          class="mt-1 font-mono text-xs tracking-[0.15em] text-(--muted) uppercase"
        >
          {{ signal.label }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { trustSignals } from "../../data/site";

const el = ref<HTMLElement | null>(null);
useScrollReveal(el);
</script>
