<template>
  <header class="mx-auto max-w-[72rem] px-6 pt-16 md:pt-24">
    <h1 class="font-display text-display-xl text-(--color)">I'm Sagar.</h1>
    <p class="mt-5 max-w-2xl text-lg text-(--muted) md:text-xl">
      {{ identity.bio }} This is where I keep my notes.
    </p>
  </header>
</template>

<script setup lang="ts">
import { identity } from "../../data/site";
</script>
