export default defineAppConfig({
  ui: {
    colors: {
      primary: "teal", // Sagar's sibling-blue — structure, links, default accent
      neutral: "slate", // cool-grey UI scaffolding
      success: "green",
      info: "teal",
      warning: "amber",
      error: "coral", // the wildcard, reserved for true errors + the submit CTA
    },
    // Buttons/inputs read rounded-md; cards rounded-xl (brief §7). Nuxt UI
    // derives radii from --ui-radius; per-component classes handle the rest.
    button: {
      defaultVariants: {
        size: "lg",
      },
    },
  },
});
