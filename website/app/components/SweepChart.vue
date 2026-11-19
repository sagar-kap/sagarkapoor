<template>
  <svg
    viewBox="0 0 240 84"
    width="240"
    height="84"
    role="img"
    :aria-label="description"
    class="max-w-full text-(--color)"
  >
    <g
      v-for="(bar, i) in candles.slice(0, count)"
      :key="i"
      :transform="`translate(${8 + i * 11},0)`"
    >
      <line
        x1="0"
        x2="0"
        :y1="86 - bar.high"
        :y2="86 - bar.low"
        stroke="currentColor"
      />
      <rect
        x="-2.5"
        width="5"
        :y="86 - Math.max(bar.open, bar.close)"
        :height="Math.abs(bar.close - bar.open)"
        stroke="currentColor"
        :fill="bar.close > bar.open ? 'var(--background)' : 'currentColor'"
      />
    </g>
    <path
      v-if="marked && count >= 6"
      :d="`M63 20H${8 + (Math.min(count, 14) - 1) * 11}`"
      fill="none"
      stroke="var(--muted)"
      stroke-dasharray="2 3"
    />
    <circle
      v-if="marked && count >= 14"
      cx="151"
      cy="6"
      r="3"
      fill="var(--accent)"
    />
    <text
      v-if="marked && count >= 14"
      x="161"
      y="10"
      fill="var(--muted)"
      font-size="10"
    >
      sweep
    </text>
  </svg>
</template>

<script setup lang="ts">
import { candles } from "../data/sweep";
defineProps<{ count: number; marked: boolean; description: string }>();
</script>
