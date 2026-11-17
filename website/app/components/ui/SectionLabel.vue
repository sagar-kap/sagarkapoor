<template>
  <component
    :is="as"
    class="font-mono text-sm tracking-[0.2em] uppercase"
    :class="muted ? 'text-(--muted)' : 'text-(--label)'"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
interface Props {
  /** Heading level to render as. */
  as?: "h2" | "h3";
  /** Use the muted text colour instead of the label colour. */
  muted?: boolean;
}

withDefaults(defineProps<Props>(), { as: "h2", muted: false });
</script>
