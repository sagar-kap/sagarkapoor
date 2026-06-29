# Sagar Kapoor — Personal Site

The code behind [sagarkapoor.eu](https://www.sagarkapoor.eu) — the
human-behind-the-company site for **Sagar Kapoor**, founder of
[Weburz](https://weburz.com). Not the studio's site; the person's. ("Sagar"
means _ocean_ — which is why everything here runs deep teal.)

Built in public and MIT-licensed (see [LICENSE](./LICENSE)) — borrow whatever's
useful.

## What it is

A small, fast, opinionated corner of the web:

- **Selected work** — Weburz case studies, told founder-first, not
  portfolio-tile. Each one ends in a GSAP scroll-pinned walk through the
  project.
- **Writing** — long-form, markdown-driven, no trackers, no popups.
- **Contact** — a _message in a bottle_. Throw one into the ocean; he checks the
  tide most mornings.

No newsletter modal will ambush you. Promise.

## The stack

Boring where it counts, sharp where it shows:

- **[Nuxt 4](https://nuxt.com)** + **[Nuxt UI 4](https://ui.nuxt.com)** +
  **Tailwind v4** — the client.
- **Nitro server routes** — the contact form relays through
  [Resend](https://resend.com), gated by
  [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) and a
  honeypot, so the real inbox never sits in the page source.
- **[Cloudflare Pages](https://pages.cloudflare.com/)** — deployment, on the
  edge.
- **[GSAP](https://gsap.com)** — reserved for the one or two moments that
  actually earn motion.

## Run it locally

You'll want [Node.js](https://nodejs.org/en) 22+, [pnpm](https://pnpm.io/),
[Task](https://taskfile.dev/), and [pre-commit](https://pre-commit.com/).

```bash
task setup      # install dependencies + git hooks
task dev        # serve at http://localhost:3000
task qa-checks  # ESLint + Prettier, before you commit
```

Then fork, branch, and open a PR. Commit messages follow
[Conventional Commits](https://www.conventionalcommits.org/) with a 50-character
subject cap — the `crisp` pre-commit hook will gently nag you if you drift.

## Licensing & distribution

This source is published under the MIT License — use it, learn from it, ship
something good. The full terms live in the [LICENSE](./LICENSE) document.

<sub>🐚</sub>
