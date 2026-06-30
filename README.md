# sagarkapoor.eu

My personal site, and deliberately not the company's. I run
[Weburz](https://weburz.com) over at [weburz.com](https://weburz.com); this is
the quieter place that's just me: what I'm writing, a handful of client projects
I'm actually proud of, and a way to reach me that doesn't leave my email sitting
in plain text for the bots to scrape.

![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)
![Tailwind v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white)
![MIT](https://img.shields.io/badge/License-MIT-fdd32a)

## What it runs on

Nothing exotic. Nuxt 4 with Nuxt UI 4 and Tailwind v4 on the front end, Nitro
server routes out back. The contact form posts to a Nitro route that hands off to
Resend, with Cloudflare Turnstile and a honeypot field doing the bouncer work.
Blog posts are plain markdown in `app/content/writing`, so there's no CMS to keep
alive. Everything ships to Cloudflare Pages.

And yes, the contact form is a literal message in a bottle. "Sagar" means ocean.
I had to.

## Running it locally

You'll want Node 22+, pnpm, [Task](https://taskfile.dev/), and
[pre-commit](https://pre-commit.com/).

```bash
task setup      # install dependencies and git hooks
task dev        # dev server at http://localhost:3000
task qa-checks  # lint and format
```

Commits follow Conventional Commits, and the `crisp` hook politely refuses
anything with a subject line over 50 characters. Branch, push, open a PR.

## License

MIT. Borrow anything that's useful; the full terms are in [LICENSE](./LICENSE).
