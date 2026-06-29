// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  rules: {
    // Prettier owns tag formatting and self-closes void elements (`<input />`),
    // which the default rule (`void: "never"`) flags. Align eslint with Prettier
    // so the two don't fight; Prettier stays the source of truth via format:check.
    "vue/html-self-closing": [
      "warn",
      {
        html: { void: "always", normal: "always", component: "always" },
        svg: "always",
        math: "always",
      },
    ],
  },
});
// Your custom configs here
