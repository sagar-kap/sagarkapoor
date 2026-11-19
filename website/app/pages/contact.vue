<template>
  <section class="mx-auto max-w-[44rem] px-6 pt-12 pb-24 md:pt-20 md:pb-32">
    <h1
      class="mb-8 font-display text-display-lg font-semibold text-balance text-(--color)"
    >
      Get in touch
    </h1>

    <!-- The signature interaction. The page owns the form state (see
           useContactForm); BottleForm is a stateless render of it plus the
           cast choreography. -->
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
</script>
