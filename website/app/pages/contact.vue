<template>
  <section class="mx-auto max-w-[72rem] px-6 py-24 md:py-32">
    <div class="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
      <!-- Hook -->
      <div ref="hook" class="reveal">
        <h1
          class="mt-4 max-w-lg font-display text-display-lg font-semibold text-balance text-(--color)"
        >
          Get in touch
        </h1>
      </div>

      <!-- The signature interaction. The page owns the form state (see
           useContactForm); BottleForm is a stateless render of it plus the
           cast choreography. -->
      <div>
        <BottleForm
          v-model:name="fields.name"
          v-model:email="fields.email"
          v-model:subject="fields.subject"
          v-model:message="fields.message"
          v-model:token="fields.token"
          v-model:cork="fields.cork"
          :state="state"
          :field-error="fieldError"
          :error-msg="errorMsg"
          :fail-count="failCount"
          :turnstile-enabled="turnstileEnabled"
          :latest-post-slug="latestPostSlug"
          @submit="submit"
          @cast-complete="markSent"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "Contact",
  description: "Send Sagar Kapoor a message.",
});

const { posts } = await useWritingPosts({ limit: 1 });
const latestPostSlug = computed(() => posts.value[0]?.slug ?? "");

const {
  fields,
  state,
  fieldError,
  errorMsg,
  failCount,
  turnstileEnabled,
  submit,
  markSent,
} = useContactForm();

const hook = ref<HTMLElement | null>(null);
useScrollReveal(hook);
</script>
