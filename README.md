# Sagar Kapoor — Personal Site

> The human behind the company. Not the studio's site — the person's.

The source behind **[sagarkapoor.eu](https://www.sagarkapoor.eu)**: the personal
site of **Sagar Kapoor**, founder of [Weburz](https://weburz.com). _Sagar_ means
**ocean** — so the whole thing runs deep teal, and the contact form is, fittingly,
a message in a bottle.

Built in public. MIT-licensed. Borrow whatever floats your boat.

![Nuxt](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![Nuxt UI](https://img.shields.io/badge/Nuxt_UI-4-00DC82?logo=nuxt&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-fdd32a)

## What's here

A small, fast, opinionated corner of the web — and nothing it doesn't need:

- **Work** — Weburz case studies, told founder-first, not portfolio-tile, each
  closing on a vertical milestone walk through how it actually went.
- **Writing** — long-form, markdown-driven. No trackers. No popups. No "you have
  1 unread newsletter."
- **Contact** — toss a message into the ocean; he reads the tide most mornings.

What you _won't_ find: a cookie wall, a newsletter modal, or a single `mailto:`
sitting around for the scrapers.

## Under the hood

Boring where it counts, sharp where it shows:

| Layer    | Tech                                                     |
| -------- | -------------------------------------------------------- |
| Frontend | Nuxt 4 · Nuxt UI 4 · Tailwind v4                         |
| Server   | Nitro routes → Resend, behind Cloudflare Turnstile + a honeypot |
| Hosting  | Cloudflare Pages, on the edge                            |
| Motion   | GSAP — rationed to the moments that earn it              |

The real inbox never appears in the page source, so scrapers go home hungry.

## Run it locally

Bring [Node 22+](https://nodejs.org/en), [pnpm](https://pnpm.io/),
[Task](https://taskfile.dev/), and [pre-commit](https://pre-commit.com/). Then:

```bash
task setup      # dependencies + git hooks, once
task dev        # http://localhost:3000
task qa-checks  # ESLint + Prettier, before you commit
```

Fork → branch → PR. Commits ride
[Conventional Commits](https://www.conventionalcommits.org/) with a 50-character
subject cap; the `crisp` pre-commit hook will tap you on the shoulder if you
start to ramble.

## License

MIT — take it, learn from it, ship something good. Full terms in the
[LICENSE](./LICENSE) document.

<sub>Made with salt water and stubbornness. 🐚</sub>
