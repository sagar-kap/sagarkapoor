<template>
  <!-- The "is Sagar around?" pulse — teal and pinging while awake, muted and
       still while asleep. Stateless: awake-ness comes in as a prop; pass a
       `title` (falls through to the root span) for the hover explainer. -->
  <!-- role="img": aria-label is ignored on a bare <span>, so assistive tech
       announced nothing at all. The dot is a picture of a status, so give it
       an image role and let the label stand as its alt text. -->
  <span
    class="relative flex size-2"
    role="img"
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
</template>

<script setup lang="ts">
defineProps<{ isAwake: boolean }>();
</script>
