<template>
  <ClientOnly>
    <UButton
      :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      color="neutral"
      variant="ghost"
      size="sm"
      class="size-11 justify-center"
      @click="toggle"
    />

    <!-- Reserve the slot during SSR so layout doesn't shift on hydration.
         Matches the rendered size-11 (44px) icon UButton. -->
    <template #fallback>
      <div class="size-11" aria-hidden="true" />
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
