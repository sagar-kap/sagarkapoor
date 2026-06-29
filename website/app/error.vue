<template>
  <NuxtLayout>
    <section
      class="mx-auto flex min-h-[60vh] max-w-[72rem] flex-col justify-center px-6 py-24"
    >
      <BottleSvg
        v-if="isNotFound"
        class="bob mb-2 h-20 w-auto text-(--muted)"
        aria-hidden="true"
      />
      <p
        class="font-mono text-sm tracking-[0.25em] text-burz-yellow-500 uppercase"
      >
        {{ error.statusCode }}
      </p>
      <h1
        class="mt-4 max-w-2xl font-display text-display-lg font-semibold text-balance text-(--color)"
      >
        {{ heading }}
      </h1>
      <p class="mt-5 max-w-xl text-lg text-(--muted)">
        {{ subline }}
      </p>

      <div class="mt-10 flex flex-wrap items-center gap-3">
        <UButton
          label="Back to home"
          to="/"
          color="primary"
          size="xl"
          @click="handleClear"
        />
        <UButton
          label="Read the writing"
          to="/writing"
          color="neutral"
          variant="ghost"
          size="xl"
          class="font-mono text-xs tracking-[0.12em] uppercase"
          @click="handleClear"
        />
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const isNotFound = computed(() => props.error.statusCode === 404);

const heading = computed(() =>
  isNotFound.value ? "This page drifted off." : "Something went under.",
);

const subline = computed(() =>
  isNotFound.value
    ? "The tide took it somewhere I can't follow. Try home, or read something instead."
    : "An unexpected current — try again, or head back to shore.",
);

const handleClear = () => clearError();
</script>

<style scoped>
/* The lost bottle bobs on the tide while you decide where to go. */
.bob {
  animation: bob 4s ease-in-out infinite;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0) rotate(-4deg);
  }
  50% {
    transform: translateY(-10px) rotate(4deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bob {
    animation: none;
  }
}
</style>
