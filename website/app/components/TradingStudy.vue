<template>
  <figure
    id="trading"
    class="mt-10 flex scroll-mt-24 flex-wrap items-center justify-between gap-x-8 gap-y-2 border-y border-(--hairline) py-5"
  >
    <figcaption>
      <h2 class="font-serif text-2xl text-(--color)">Trading notes</h2>
      <p class="mt-1 text-sm text-(--muted)">
        An ICT study of a liquidity sweep.
      </p>
    </figcaption>
    <svg
      viewBox="0 0 240 84"
      width="240"
      height="84"
      role="img"
      aria-label="Price briefly trades above the previous high before falling back below it."
      class="max-w-full text-(--color)"
    >
      <g
        v-for="(bar, i) in candles"
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
        d="M63 20H151"
        fill="none"
        stroke="var(--muted)"
        stroke-dasharray="2 3"
      />
      <circle cx="151" cy="6" r="3" fill="var(--accent)" />
      <text x="161" y="10" fill="var(--muted)" font-size="10">sweep</text>
    </svg>
  </figure>
</template>

<script setup lang="ts">
// Hand-drawn OHLC values in chart coordinates, independent of market data.
const bars: [number, number, number, number][] = [
  [21, 36, 17, 32],
  [32, 38, 23, 26],
  [26, 44, 24, 40],
  [40, 51, 34, 47],
  [47, 57, 42, 53],
  [53, 66, 48, 60],
  [60, 63, 45, 49],
  [49, 54, 37, 42],
  [42, 48, 32, 35],
  [35, 45, 30, 41],
  [41, 53, 37, 48],
  [48, 58, 44, 54],
  [54, 63, 49, 59],
  [59, 80, 53, 62],
  [62, 64, 43, 45],
  [45, 48, 28, 32],
  [32, 39, 23, 26],
  [26, 35, 18, 30],
  [30, 33, 16, 20],
  [20, 27, 12, 24],
];
const candles = bars.map(([open, high, low, close]) => ({
  open,
  high,
  low,
  close,
}));
</script>
