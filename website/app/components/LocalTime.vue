<template>
  <ClientOnly>
    <span
      class="inline-flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-(--muted)"
      :title="`${time} in Sofia — Sagar is ${isAwake ? 'probably about' : 'asleep'}`"
    >
      <span
        class="relative flex size-2"
        :aria-label="isAwake ? 'awake' : 'asleep'"
      >
        <span
          v-if="isAwake"
          class="absolute inline-flex size-full animate-ping rounded-full bg-teal-400 opacity-60 motion-reduce:hidden"
        />
        <span
          class="relative inline-flex size-2 rounded-full"
          :class="isAwake ? 'bg-teal-400' : 'bg-(--muted)'"
        />
      </span>
      <span class="text-(--color)">{{ time }}</span>
      <span class="hidden sm:inline">in Sofia · {{ status }}</span>
      <span
        class="ml-0.5"
        :title="`${phaseName}, ${illuminationPct}% lit — ${tideLabel}`"
        aria-hidden="true"
        >{{ emoji }}</span
      >
    </span>

    <template #fallback>
      <span class="font-mono text-xs tracking-[0.1em] text-(--muted)">
        somewhere near Sofia
      </span>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
const { time, isAwake, status } = useLocalTime();
const { emoji, phaseName, tideLabel, illuminationPct } = useMoon();
</script>
