<template>
  <div class="mx-auto max-w-[72rem] px-6 pt-12 pb-24 md:pt-20 md:pb-32">
    <HomeHero :post="posts[0]" />
    <div
      class="mt-14 grid items-start gap-12 border-t border-(--hairline) pt-10 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] lg:gap-16"
    >
      <RecentPosts :posts="posts.slice(1)" />
      <aside class="lg:border-l lg:border-(--hairline) lg:pl-8">
        <SectionLabel>Projects</SectionLabel>
        <ul class="mt-4">
          <li v-for="project in linkedProjects" :key="project.url">
            <a
              :href="project.url"
              class="group flex items-center justify-between gap-4 border-b border-(--hairline) py-4 font-display text-xl hover:text-(--accent)"
            >
              {{ project.name }}
              <UIcon
                name="i-lucide-arrow-up-right"
                class="size-4 text-(--accent)"
              />
            </a>
          </li>
        </ul>
        <NuxtLink
          to="/work"
          class="mt-5 inline-block text-sm underline underline-offset-4"
          >More projects</NuxtLink
        >
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { linkedProjects } from "../data/work";

const { posts } = await useWritingPosts({ limit: 4 });
</script>
