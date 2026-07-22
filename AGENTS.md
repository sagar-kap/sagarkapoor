# AGENTS.md

Working notes for coding agents (and forgetful humans) on this repo. Read this
before touching anything — most of the sharp edges below were discovered the
hard way.

## What this is

[sagarkapoor.eu](https://sagarkapoor.eu) — Sagar Kapoor's personal site. A
Nuxt 4 app living entirely under `website/`, built for Cloudflare Pages
(`nitro` preset outputs `dist/_worker.js`). Writing is local markdown parsed
at build time — there is no CMS behind it.

## Layout

```
website/
  app/       # Vue app: pages, components, composables
  server/    # Nitro server routes (e.g. rss.xml)
  shared/    # code imported by BOTH app and server via the #shared alias
  public/    # static assets (og.png lives here)
Taskfile.yml # go-task wrapper for setup/dev/qa
```

Anything in `shared/` must run in the client bundle *and* the Cloudflare
Worker — no Node-only APIs, no `eval` (Workers reject it; this is why
frontmatter is parsed with js-yaml directly instead of gray-matter).

## Commands

Everything runs from `website/` with pnpm (pinned via `packageManager`,
currently pnpm 11). Node ≥ 22 required.

| What | How |
| --- | --- |
| Install | `pnpm install` |
| Dev server | `PORT=3210 pnpm dev` — **never** `pnpm dev --port 3210` |
| Lint + typecheck | `pnpm lint` (runs `nuxt typecheck` then `eslint .`) |
| Format | `pnpm format` (write) / `pnpm format:check` |
| Build | `pnpm build` |

Why the PORT= rule: the dev script is `nuxt dev --host`, so a trailing
`--port` gets eaten by `--host` and the port number becomes a rootDir — you
get a blank Nuxt welcome page and a stray `website/<port>/` junk directory.
Delete those directories if you find them; they are gitignored garbage.

`task setup` (go-task) installs pre-commit hooks + dependencies in one shot.

## Git workflow

Every change: branch → PR → green CI → **squash-merge** → delete branch.
No direct pushes to `main`. No AI attribution anywhere — commits, PR bodies,
comments, nothing.

Pre-commit hooks to expect:

- **crisp** (commit-msg): Conventional Commits with a **50-char header cap**.
  Keep subjects short or the commit is rejected.
- **prettier**: may reformat staged files and abort the first attempt —
  `git add -A` and commit again with the same message.

## CI

Two workflows, both running the `[FRONT END] Code Quality Check` job on
Node 22 + pnpm 11:

- `qa-checks.yml` (PRs): lint, format check, **and a full `pnpm build`**.
- `staging-deploy.yml` (push to main): lint + format check only — despite the
  name it does not deploy anything yet. Actual deployment (CF Pages + DNS
  cutover) is still pending.

## Dependency management

- **Supply-chain age gate.** pnpm 11 enforces a default 24-hour
  `minimumReleaseAge`. CI fails with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`
  when any locked version is younger than a day — common on fresh Dependabot
  PRs. No code change needed: wait out the window and re-run the failed jobs.
- **Security overrides** live in the `overrides:` block of
  `website/pnpm-workspace.yaml`, pinning transitive deps past known
  advisories. Prune entries once the direct dependents catch up on their own.
- **Build scripts** are allow-listed in the same file (`allowBuilds:` map) —
  pnpm 11 only honors this in `pnpm-workspace.yaml`, not `package.json`.
- **TypeScript stays on 6.x** for now: TS 7 (the native compiler) drops
  `./lib/tsc`, which vue-tsc 3.x still needs. The Dependabot major is ignored
  (`@dependabot unignore this major version` on the closed PR when vue-tsc
  catches up).
- **js-yaml is v5** — no default export; use named imports
  (`import { load } from "js-yaml"`).

## Conventions

- Arrow functions only (`const fn = () => {}`), including composables.
- `eslint.config.mjs` overrides `vue/html-self-closing` to match Prettier —
  don't "fix" self-closing tags by hand.
- `dist/` and `.output/` are build artifacts; never edit or commit them.
