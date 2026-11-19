<template>
  <button
    type="button"
    aria-label="Make a ripple in the pixel-art bay"
    title="Make a ripple"
    class="relative mt-5 block w-full max-w-lg cursor-crosshair overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent)"
    @click="makeRipple"
  >
    <img
      src="/shoreline.png"
      width="320"
      height="66"
      alt=""
      class="block w-full [image-rendering:pixelated]"
    />
    <span
      v-if="ripple"
      :key="ripple.id"
      aria-hidden="true"
      class="ripple"
      :style="{ left: ripple.x + '%', top: ripple.y + '%' }"
      @animationend="ripple = null"
    />
  </button>
</template>

<script setup lang="ts">
const ripple = ref<{ id: number; x: number; y: number } | null>(null);

const makeRipple = (event: MouseEvent) => {
  const bounds = (
    event.currentTarget as HTMLButtonElement
  ).getBoundingClientRect();
  const x = event.detail
    ? ((event.clientX - bounds.left) / bounds.width) * 100
    : 64;
  const y = event.detail
    ? ((event.clientY - bounds.top) / bounds.height) * 100
    : 80;
  ripple.value = {
    id: event.timeStamp,
    x: Math.max(5, Math.min(95, x)),
    y: Math.max(70, Math.min(94, y)),
  };
};
</script>

<style scoped>
.ripple {
  position: absolute;
  pointer-events: none;
  width: 3.5rem;
  height: 0.7rem;
  border: 2px double #ffe2ac;
  border-radius: 50%;
  translate: -50% -50%;
  animation: ripple 1s ease-out forwards;
}
@keyframes ripple {
  from {
    scale: 0.12;
  }
  to {
    scale: 1.4;
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .ripple {
    animation: still 0.6s step-end forwards;
  }
  @keyframes still {
    to {
      opacity: 0;
    }
  }
}
</style>
