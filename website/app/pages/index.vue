<template>
  <div>
    <HomeHero />
    <TrustSignals />
    <SelectedWorks />
    <RecentPosts />
    <AboutCta />
  </div>
</template>

<script setup lang="ts">
import { identity } from "../data/site";

useSeoMeta({
  title: `${identity.name} — ${identity.role}`,
  description:
    "I run Weburz, a studio that builds software for the web. Selected work, writing, and a way to get in touch.",
});
</script>
