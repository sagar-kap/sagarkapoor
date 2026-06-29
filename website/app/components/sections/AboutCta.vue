<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <div ref="el" class="reveal">
      <Divider class="max-w-xl" />
      <p
        class="mt-12 max-w-3xl font-display text-display-md font-semibold text-balance text-(--color)"
      >
        I build software I'd want to use myself, and let the work do the
        talking.
        <NuxtLink
          to="/about"
          class="text-teal-500 underline decoration-burz-yellow-500/60 decoration-2 underline-offset-4 transition-colors hover:text-coral-500"
        >
          More about me →
        </NuxtLink>
      </p>

      <div class="mt-10">
        <UButton
          to="/contact"
          label="Throw a message in the ocean"
          trailing-icon="i-lucide-arrow-right"
          color="primary"
          size="xl"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const el = ref<HTMLElement | null>(null);
useScrollReveal(el);
</script>
