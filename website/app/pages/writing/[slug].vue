<template>
  <article v-if="post" class="px-6 py-24 md:py-32">
    <!-- Hero -->
    <header class="mx-auto max-w-[44rem]">
      <NuxtLink
        to="/writing"
        class="inline-flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase transition-colors hover:text-teal-500"
      >
        <UIcon name="i-lucide-arrow-left" class="size-3.5" />
        Writing
      </NuxtLink>

      <h1
        class="mt-8 font-display text-display-lg font-semibold text-balance text-(--color)"
      >
        {{ post.title }}
      </h1>

      <div
        class="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-[0.12em] text-(--muted) uppercase"
      >
        <span v-if="post.date">{{ formatDate(post.date) }}</span>
        <span v-if="readLabel" aria-hidden="true">·</span>
        <span v-if="readLabel">{{ readLabel }}</span>
      </div>
    </header>

    <!-- Body. Markdown is first-party (these files live in the repo) and is
         rendered to HTML at build time by marked. -->
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="prose-ocean mx-auto mt-12 max-w-[44rem]" v-html="post.html" />

    <!-- Byline -->
    <footer class="mx-auto mt-16 max-w-[44rem]">
      <Divider />
      <div class="mt-10 flex items-start gap-4">
        <UAvatar
          src="https://github.com/Sagar-Kap.png"
          :alt="identity.name"
          size="lg"
        />
        <div>
          <p class="font-display font-semibold text-(--color)">
            Written by {{ identity.name }}
          </p>
          <p class="mt-1 max-w-md text-sm text-(--muted)">
            {{ identity.bio }}
            <NuxtLink
              to="/about"
              class="text-teal-500 transition-colors hover:text-coral-500"
            >
              More about me →
            </NuxtLink>
          </p>
        </div>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { identity } from "../../data/site";
import { getPost } from "../../utils/writing";

const route = useRoute();
const { formatDate } = useFormattedDate();
const { formatReadTime } = useFormattedReadTime();

const post = getPost(route.params.slug as string);

if (!post) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

const readLabel = computed(() => formatReadTime({ minutes: post.readMinutes }));

useSeoMeta({
  title: post.title,
  description: post.excerpt,
  ogType: "article",
});
</script>

<style scoped>
/* Long-form reading measure: ~64ch, generous leading, JetBrains Mono for code.
   Targets the server-rendered markdown HTML. */
.prose-ocean {
  font-size: 1.0625rem;
  line-height: 1.75;
  color: var(--color);
}

.prose-ocean :deep(p),
.prose-ocean :deep(ul),
.prose-ocean :deep(ol),
.prose-ocean :deep(blockquote) {
  margin-block: 1.4em;
}

.prose-ocean :deep(h2) {
  margin-block: 2em 0.6em;
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.prose-ocean :deep(h3) {
  margin-block: 1.6em 0.5em;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 600;
}

.prose-ocean :deep(a) {
  color: var(--color-teal-500);
  text-decoration: underline;
  text-decoration-color: color-mix(
    in oklch,
    var(--color-burz-yellow-500),
    transparent 40%
  );
  text-underline-offset: 3px;
}

.prose-ocean :deep(a:hover) {
  color: var(--color-coral-500);
}

.prose-ocean :deep(ul),
.prose-ocean :deep(ol) {
  padding-inline-start: 1.4em;
}

.prose-ocean :deep(ul) {
  list-style: disc;
}

.prose-ocean :deep(ol) {
  list-style: decimal;
}

.prose-ocean :deep(li) {
  margin-block: 0.4em;
}

.prose-ocean :deep(blockquote) {
  border-inline-start: 2px solid var(--color-burz-yellow-500);
  padding-inline-start: 1.2em;
  font-style: italic;
  color: var(--muted);
}

.prose-ocean :deep(code) {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: color-mix(in oklch, currentColor, transparent 92%);
  padding: 0.15em 0.4em;
  border-radius: 0.25rem;
}

.prose-ocean :deep(pre) {
  margin-block: 1.6em;
  overflow-x: auto;
  border: 1px solid var(--hairline);
  border-radius: 0.75rem;
  background: var(--surface);
  padding: 1.1rem 1.25rem;
}

.prose-ocean :deep(pre code) {
  background: transparent;
  padding: 0;
  font-size: 0.85rem;
  line-height: 1.6;
}

.prose-ocean :deep(img) {
  margin-block: 1.8em;
  border-radius: 0.75rem;
}

.prose-ocean :deep(hr) {
  margin-block: 2.5em;
  border: 0;
  border-top: 1px solid var(--hairline);
}
</style>
