<template>
  <article class="mx-auto max-w-[44rem] px-6 py-24 md:py-32">
    <!-- Identity -->
    <header>
      <span
        class="flex items-center gap-3 font-mono text-xs tracking-[0.22em] text-(--muted) uppercase"
      >
        <span class="h-px w-8 bg-burz-yellow-500" aria-hidden="true" />
        About
      </span>
      <h1
        class="mt-4 font-display text-display-lg font-semibold text-balance text-(--color)"
      >
        {{ about.identity }}
      </h1>
    </header>

    <!-- Why Weburz exists -->
    <section class="mt-16">
      <h2
        class="font-mono text-sm tracking-[0.2em] text-burz-yellow-500 uppercase"
      >
        Why Weburz exists
      </h2>
      <div class="mt-5 space-y-5">
        <p
          v-for="(para, i) in about.origin"
          :key="i"
          class="text-lg leading-[1.7] text-(--color)"
        >
          {{ para }}
        </p>
      </div>
    </section>

    <!-- What I believe -->
    <section class="mt-16">
      <h2
        class="font-mono text-sm tracking-[0.2em] text-burz-yellow-500 uppercase"
      >
        What I believe
      </h2>
      <ul class="mt-6 space-y-5">
        <li
          v-for="(belief, i) in about.beliefs"
          :key="i"
          class="border-l-2 border-(--hairline) pl-5 text-lg leading-[1.6] text-(--color)"
        >
          {{ belief }}
        </li>
      </ul>
    </section>

    <!-- Now -->
    <section class="mt-16">
      <NowBlock :now="about.now" />
    </section>

    <!-- Things I've shipped -->
    <section class="mt-16">
      <h2
        class="font-mono text-sm tracking-[0.2em] text-burz-yellow-500 uppercase"
      >
        Things I've shipped
      </h2>
      <ul class="mt-6 space-y-4">
        <li
          v-for="thing in about.shipped"
          :key="thing.label"
          class="flex flex-col gap-1 border-t border-(--hairline) pt-4 sm:flex-row sm:items-baseline sm:gap-3"
        >
          <a
            :href="thing.href"
            target="_blank"
            rel="noopener noreferrer"
            class="font-mono text-sm text-teal-500 transition-colors hover:text-coral-500"
          >
            {{ thing.label }} ↗
          </a>
          <span class="text-(--muted)">{{ thing.note }}</span>
        </li>
      </ul>
    </section>

    <!-- CTA -->
    <section class="mt-20">
      <Divider />
      <div class="mt-10">
        <UButton
          to="/contact"
          label="Throw a message in the ocean"
          trailing-icon="i-lucide-arrow-right"
          color="primary"
          size="xl"
        />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { aboutContent as about } from "../data/about";

useSeoMeta({
  title: "About",
  description:
    "How I think about software, clients, and pricing — and what I'm doing now. The founder behind Weburz.",
});
</script>
