<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    :aria-pressed="lit"
    class="relative block w-full overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--accent)"
    @click="lit = !lit"
  >
    <img
      :src="`/scenes/${scene}.png`"
      alt=""
      width="240"
      height="78"
      class="block w-full [image-rendering:pixelated]"
    />
    <img
      :src="`/scenes/${scene}-lit.png`"
      alt=""
      width="240"
      height="78"
      class="absolute inset-0 w-full [image-rendering:pixelated]"
      :class="lit ? 'opacity-100' : 'opacity-0'"
    />
  </button>
</template>

<script setup lang="ts">
defineProps<{ scene: "desk" | "city" | "studio" | "beacon"; label: string }>();
const lit = ref(false);
</script>
