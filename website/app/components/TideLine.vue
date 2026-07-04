<template>
  <!-- A calm tide — gentle, low-amplitude swells that fade downward (gradient,
       not a flat slab), layered at different wavelengths/speeds for depth, with
       a soft BurzYellow crest on the front layer. Freezes under reduced-motion. -->
  <div
    class="tide pointer-events-none relative w-full overflow-hidden"
    :style="{ height, '--swell': strength, '--level': level }"
    aria-hidden="true"
  >
    <div class="wave wave-back" />
    <div class="wave wave-mid" />
    <div class="wave wave-front" />
  </div>
</template>

<script setup lang="ts">
// `strength` (0 = slack neap, 1 = peak spring) scales the swell; `level`
// (0 = low water, 1 = high water) moves the waterline itself. Both default to
// a neutral mid so SSR + first paint match before the real values settle in.
withDefaults(
  defineProps<{ height?: string; strength?: number; level?: number }>(),
  {
    height: "6rem",
    strength: 0.6,
    level: 0.5,
  },
);
</script>

<style scoped>
.wave {
  position: absolute;
  inset: 0;
  background-repeat: repeat-x;
  background-position: 0 bottom;
  /* Swell: scale the wave height by the real spring/neap strength, anchored to
     the waterline. Front layer reacts most. Eases when the moon value settles.
     Water level: the whole waterline sinks as the real tide ebbs (translateY
     before scaleY, so the swell still scales about the waterline). level=1 is
     pixel-identical to the old rendering, so the crest can never clip; at
     level=0 the front layer drops ~1.9rem and the sea visibly pulls out. */
  transform-origin: bottom;
  transition: transform 1.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.wave-back {
  transform: translateY(calc((1 - var(--level, 0.5)) * 1.1rem))
    scaleY(calc(0.78 + var(--swell, 0.6) * 0.32));
}

.wave-mid {
  transform: translateY(calc((1 - var(--level, 0.5)) * 1.5rem))
    scaleY(calc(0.74 + var(--swell, 0.6) * 0.46));
}

.wave-front {
  transform: translateY(calc((1 - var(--level, 0.5)) * 1.9rem))
    scaleY(calc(0.7 + var(--swell, 0.6) * 0.62));
}

/* Gentle swell, gradient-filled (teal, fading down). Used by back + mid. Each
   layer scrolls by EXACTLY its own tile width so the loop never jumps. */
.wave-back,
.wave-mid {
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1440'%20height='200'%20viewBox='0%200%201440%20200'%20preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='0'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%230e7c86'%20stop-opacity='.5'/%3E%3Cstop%20offset='1'%20stop-color='%230e7c86'%20stop-opacity='.06'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath%20d='M0%2052C120%2052%20240%2076%20360%2076%20480%2076%20600%2052%20720%2052%20840%2052%20960%2076%201080%2076%201200%2076%201320%2052%201440%2052L1440%20200%200%20200Z'%20fill='url(%23g)'/%3E%3C/svg%3E");
}

/* Front layer: same swell plus a soft BurzYellow crest line on the surface. */
.wave-front {
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1440'%20height='200'%20viewBox='0%200%201440%20200'%20preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient%20id='f'%20x1='0'%20y1='0'%20x2='0'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%230e7c86'%20stop-opacity='.55'/%3E%3Cstop%20offset='1'%20stop-color='%230e7c86'%20stop-opacity='.1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath%20d='M0%2052C120%2052%20240%2076%20360%2076%20480%2076%20600%2052%20720%2052%20840%2052%20960%2076%201080%2076%201200%2076%201320%2052%201440%2052L1440%20200%200%20200Z'%20fill='url(%23f)'/%3E%3Cpath%20d='M0%2052C120%2052%20240%2076%20360%2076%20480%2076%20600%2052%20720%2052%20840%2052%20960%2076%201080%2076%201200%2076%201320%2052%201440%2052'%20fill='none'%20stroke='%23fdd32a'%20stroke-opacity='.4'%20stroke-width='1.5'/%3E%3C/svg%3E");
}

.wave-back {
  background-size: 1600px 100%;
  opacity: 0.45;
  animation: drift-1600 26s linear infinite;
}

.wave-mid {
  background-size: 1280px 100%;
  opacity: 0.6;
  animation: drift-1280 18s linear infinite reverse;
}

.wave-front {
  background-size: 1040px 100%;
  opacity: 0.85;
  animation: drift-1040 13s linear infinite;
}

@keyframes drift-1600 {
  to {
    background-position-x: -1600px;
  }
}

@keyframes drift-1280 {
  to {
    background-position-x: -1280px;
  }
}

@keyframes drift-1040 {
  to {
    background-position-x: -1040px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wave {
    animation: none !important;
  }
}
</style>
