<template>
  <div
    class="overflow-hidden rounded-lg border border-(--hairline) bg-(--background)"
  >
    <div
      class="flex items-center gap-1.5 border-b border-(--hairline) px-3 py-2"
    >
      <span class="size-2.5 rounded-full bg-coral-400" />
      <span class="size-2.5 rounded-full bg-burz-yellow-400" />
      <span class="size-2.5 rounded-full bg-teal-400" />
    </div>

    <!-- Default: a calm ocean-gradient placeholder with the client mark. Pass a
         #default slot to drop in a real screenshot instead. -->
    <slot>
      <div
        class="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-teal-500/10 via-transparent to-burz-yellow-500/10"
      >
        <span
          class="font-mono text-xs tracking-[0.2em] text-(--muted) uppercase"
        >
          {{ label }}
        </span>
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label?: string }>();
</script>
