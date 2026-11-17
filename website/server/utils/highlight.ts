/**
 * Server-side syntax highlighting for the writing posts. Shiki's fine-grained
 * core with the JavaScript regex engine: no WASM, no eval, and only the
 * languages listed here are bundled (this module is also bundled into the
 * Cloudflare Worker, so every grammar costs bytes). To use a new language in a
 * post, import its grammar below.
 *
 * Both themes are emitted as CSS variables (--shiki-light / --shiki-dark on
 * each token) rather than inline colours, so the page follows the colour-mode
 * toggle with pure CSS — the HTML is identical in both modes, which keeps SSR
 * and hydration in agreement. The variables are consumed in
 * app/assets/css/main.css.
 */

import { createHighlighterCoreSync } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import typescript from "shiki/langs/typescript.mjs";
import githubDark from "shiki/themes/github-dark-high-contrast.mjs";
import githubLight from "shiki/themes/github-light-high-contrast.mjs";

let highlighter: ReturnType<typeof createHighlighterCoreSync> | undefined;

// Built on first use: the Worker never renders posts at request time, so it
// should not pay for grammar setup at startup.
const getHighlighter = () =>
  (highlighter ??= createHighlighterCoreSync({
    themes: [githubLight, githubDark],
    langs: [typescript],
    engine: createJavaScriptRegexEngine(),
  }));

// Highlighted HTML for a fenced block, or undefined when the language is
// absent or not bundled (the caller falls back to a plain <pre><code>).
export const highlightCode = (code: string, lang: string | undefined) => {
  const shiki = getHighlighter();
  if (!lang || !shiki.getLoadedLanguages().includes(lang)) return undefined;

  return shiki.codeToHtml(code, {
    lang,
    themes: {
      light: "github-light-high-contrast",
      dark: "github-dark-high-contrast",
    },
    defaultColor: false,
  });
};
