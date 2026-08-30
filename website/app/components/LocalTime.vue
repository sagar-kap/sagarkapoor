<template>
  <ClientOnly>
    <span
      class="inline-flex items-center gap-2 font-mono text-xs tracking-[0.1em] text-(--muted)"
      :title="`${time} in Sofia — Sagar is ${isAwake ? 'probably about' : 'asleep'}`"
    >
      <PresenceDot :is-awake="isAwake" />
      <span class="text-(--color)">{{ time }}</span>
      <span class="hidden sm:inline">in Sofia · {{ status }}</span>
      <span
        class="ml-0.5"
        :title="`${phaseName}, ${illuminationPct}% lit — ${tideLabel} · ${tideReport}`"
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
const { emoji, phaseName, tideLabel, illuminationPct, tideReport } = useMoon();
</script>
