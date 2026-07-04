<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      color="neutral"
      variant="ghost"
      size="sm"
      @click="toggle"
    />

    <!-- Reserve the slot during SSR so layout doesn't shift on hydration.
         Matches the rendered sm icon UButton (28px), not a round size-8. -->
    <template #fallback>
      <div class="size-7" aria-hidden="true" />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed(() => colorMode.value === "dark");

const toggle = () => {
  colorMode.preference = isDark.value ? "light" : "dark";
};
</script>
