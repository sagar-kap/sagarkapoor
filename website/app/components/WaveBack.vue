<template>
  <!-- The brief's one allowed emoji easter egg. Click the wave to wave back —
       it spawns a little drift of bubbles and shells. -->
  <button
    type="button"
    class="wave-btn relative inline-flex size-7 items-center justify-center rounded-full text-base transition-transform hover:scale-110"
    :class="{ waving: animating }"
    aria-label="Wave back"
    @click="waveBack"
  >
    <span aria-hidden="true">🌊</span>

    <span
      v-for="bubble in bubbles"
      :key="bubble.id"
      class="bubble pointer-events-none absolute text-sm"
      :style="bubble.style"
      aria-hidden="true"
      >{{ bubble.glyph }}</span
    >
  </button>
</template>

<script setup lang="ts">
interface Bubble {
  id: number;
  glyph: string;
  style: Record<string, string>;
}

const GLYPHS = ["🫧", "🐚", "🌊", "💧"];

const animating = ref(false);
const bubbles = ref<Bubble[]>([]);
let seed = 0;

const waveBack = () => {
  // Respect reduced motion — no confetti of bubbles, just a tiny acknowledgement.
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  animating.value = true;
  window.setTimeout(() => (animating.value = false), 600);
  if (reduce) return;

  const batch: Bubble[] = Array.from({ length: 5 }, (_, i) => {
    seed += 1;
    const drift = (i - 2) * 14;
    const delay = i * 60;
    return {
      id: seed,
      glyph: GLYPHS[(seed + i) % GLYPHS.length] as string,
      style: {
        "--drift": `${drift}px`,
        animationDelay: `${delay}ms`,
      },
    };
  });

  bubbles.value.push(...batch);
  const ids = new Set(batch.map((b) => b.id));
  window.setTimeout(() => {
    bubbles.value = bubbles.value.filter((b) => !ids.has(b.id));
  }, 1500);
};
</script>

<style scoped>
.wave-btn.waving span:first-child {
  animation: wave-hand 0.6s ease-in-out;
  transform-origin: 70% 80%;
}

@keyframes wave-hand {
  0%,
  100% {
    transform: rotate(0);
  }
  25% {
    transform: rotate(-18deg);
  }
  50% {
    transform: rotate(14deg);
  }
  75% {
    transform: rotate(-10deg);
  }
}

.bubble {
  left: 50%;
  top: 0;
  animation: bubble-up 1.4s ease-out forwards;
}

@keyframes bubble-up {
  0% {
    opacity: 0;
    transform: translate(-50%, 0) scale(0.6);
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate(calc(-50% + var(--drift, 0px)), -3.5rem) scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .wave-btn.waving span:first-child {
    animation: none;
  }
}
</style>
