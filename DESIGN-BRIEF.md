# sagarkapoor.eu — Design Brief

A complete brief for prototyping the personal site of Sagar Kapoor — CEO of [Weburz](https://weburz.com), independent game-dev on the side. Hand this document to a design-prototyping tool as a single self-contained input.

---

## 1. What this site is

The personal site of **Sagar Kapoor**, founder/CEO of **Weburz** (a small dev studio). It is **not** Weburz's company site (that lives at weburz.com). This is the human-behind-the-company surface — a place for:

- Showing who Sagar is and what he stands for as a founder.
- Showcasing selected Weburz client work as case studies (CEO-led, not portfolio-tile).
- Long-form writing (the blog).
- One way to reach him (a contact form — no public email).

A `/games` route for indie game work is planned but explicitly **out of scope for v1** — do not design or stub it.

---

## 2. Positioning

**Founder with personality — not "slickback-haired CEO," not "junior portfolio."**

The two failure modes to actively avoid:

| Avoid: Corporate-CEO cliché | Avoid: Junior-portfolio cliché |
|---|---|
| Stripe-template hero, navy + grey, "We empower enterprises" | three.js bg, card-tilt, mouse-trail particles, sparkle-emoji copy |
| Generic agency stock photography | Floating particles, animated WebGL gimmicks |
| Anonymous "we" voice | "✨ I build cool stuff ✨" |

**Land between them.** Confident, warm, opinionated, distinctively human. The reader should leave thinking *"I want to work with that specific person"* — not *"that's a competent founder"* and not *"that's a portfolio."*

Reference vibes (study the **moves**, not the surface): Pieter Levels (levels.io), Tobias van Schneider, Maggie Appleton, Cabel Sasser, Andy Bell, Rauno Freiberg, Anthony Fu, Robin Sloan. Each is a *specific person* on the page.

---

## 3. The through-line: **Ocean**

"Sagar" means **ocean** (Sanskrit/Hindi). This is the personal anchor — meaningful, not arbitrary, and structurally distinct from Weburz (which owns engineering-blue + yellow). It manifests in:

- **Palette** (see §5)
- **A single signature interaction** on `/contact` — "message in a bottle" (see §9)
- **Subtle voice/copy notes** (depth, drift, currents, tide-as-metaphor — used *sparingly*, never twee)

**Hard constraints on the ocean theme — do NOT cross these lines:**

- No WebGL water shaders.
- No parallax waves on the hero.
- No animated foam, no mouse-trail droplets, no rippling backgrounds.
- No literal beach photography. No palm-tree icons. No anchors / nautical wheels / lighthouses.
- The word "ocean" or "sea" should not appear in any heading.

Ocean lives in **color, type weight, copy register, and one well-placed interaction.** Not in literal water effects.

---

## 4. Design continuity with Weburz: **sibling, not clone**

The Weburz main site uses:

- **Sofia Sans** (display + body) + **JetBrains Mono** (code/terminal)
- **BurzYellow `#fdd32a`** + **BurzBlue `#557ca2`** on a dark-first palette
- **Nuxt UI 4** components, generous airy layouts, GSAP staggered reveals
- Two signature visual moves: an animated terminal + an interactive particle constellation
- Voice: "Built from experience. Priced for reality." — direct, dev-credible, founder-tone, no fluff

This site **keeps the typography, the BurzYellow accent, the dark-first Nuxt UI 4 layout rhythm, and the founder-voice register** so family resemblance is unmistakable.

This site **does NOT use the animated terminal component or the particle constellation** under any circumstances. Those are Weburz's identity; reusing them would make this read as a Weburz subdomain.

This site differentiates via palette (§5) and one signature interaction (§9) — both ocean-anchored.

---

## 5. Color system

Dark-first with a working light mode toggle.

### Brand palette

| Role | Color | Hex | Notes |
|---|---|---|---|
| Shared accent (family signal) | BurzYellow | `#fdd32a` | Same as Weburz. Used for primary CTAs, highlights, sunlight-on-water moments. |
| Sibling-blue (Sagar's, not Weburz's) | Deep teal | `#0E7C86` | Warmer + greener than BurzBlue. Used for structural color, secondary buttons, links on dark mode. |
| Personal accent — the wildcard | Coral | `#E8745C` | The "alive" color. Used sparingly: hover states, emphasis, the contact-form submit CTA. ≤5% of any screen. |
| Warm neutral | Sea-foam cream | `#F4EFE6` | Body background in light mode; paper feel for `/writing`. |

### Neutrals

| Mode | Background | Surface | Body text | Muted text |
|---|---|---|---|---|
| Dark | `#0B1418` (deep ocean) | `#0F1A1F` | `#E8EDF0` | `#8A9BA3` |
| Light | `#F4EFE6` (sea-foam) | `#FFFFFF` | `#0B1418` | `#5A6B73` |

### Semantic colors

Use Nuxt UI 4's defaults (green/blue/amber/red), recolored to harmonize: prefer `#3FB950` (success), `#0E7C86` (info, = teal), `#F2B137` (warning), `#E8745C` (error, = coral).

---

## 6. Typography

**Sofia Sans** for everything except inline code and the contact form input field (see §9). Available via Google Fonts or `@fontsource/sofia-sans`.

**JetBrains Mono** for inline code, code blocks in `/writing`, and the contact form's typewriter input. Available via `@fontsource/jetbrains-mono`.

### Type scale (rem, mobile → desktop)

| Token | Size (mobile) | Size (desktop) | Weight | Letter-spacing | Use |
|---|---|---|---|---|---|
| `display-xl` | 3.5rem | 6rem | 600 | -0.04em | Hero on `/` only |
| `display-lg` | 2.5rem | 4rem | 600 | -0.03em | Page H1s |
| `display-md` | 2rem | 3rem | 600 | -0.02em | Section headers |
| `body-lg` | 1.125rem | 1.25rem | 400 | 0 | Lead paragraphs, hero subtitle |
| `body` | 1rem | 1.0625rem | 400 | 0 | Default body |
| `body-sm` | 0.875rem | 0.9375rem | 400 | 0 | Metadata, captions |
| `mono` | 0.875rem | 0.9375rem | 400 | 0 | Code, contact input |

Line-height: 1.15 on display, 1.6 on body, 1.7 on `/writing` long-form.

---

## 7. Layout & spacing

- **Container max-width:** `min(72rem, 100vw - 3rem)` for content; `64rem` for `/writing` article body; full-bleed allowed for hero only.
- **Vertical rhythm:** generous. Section padding `py-24` (mobile) / `py-32` (desktop). Never `py-12` on a primary section.
- **Grid:** 12-col with `gap-6` (mobile) / `gap-8` (desktop). Most layouts use 1-2-3 col stacks, not grid maximalism.
- **Corner radius:** `rounded-xl` on cards, `rounded-md` on buttons/inputs, `rounded-full` on avatars only.
- **Borders:** prefer `1px` borders in `oklch(from currentColor l c h / 0.12)` for surfaces over heavy drop-shadows. One soft shadow for hover.
- **Mobile-first.** Everything works at 360px wide before it works at 1440px.

---

## 8. Information architecture (5 routes)

### `/` — Home

The 8-second pitch. Above the fold should answer "who is this person and why should I care."

Sections, in order:
1. **Hero** — One strong sentence (not a slogan). One supporting sentence. One primary CTA ("See what we build" → `/work`) + one secondary link ("Read what I write" → `/writing`).
2. **3 trust signals** — pick ONE form: either 3 client logos, OR 3 numbers (e.g., "12 shipped products · 8 countries · since 2019"), OR a single short pull-quote. Do not mix forms.
3. **3 selected works** — three case-study teasers as cards, each linking into `/work/[slug]`. Each card: client name, one-line problem, one-line outcome, a small visual.
4. **3 recent posts** — three teasers from BurzBlog `/v1/posts?limit=3`, each linking into `/writing/[slug]`. Each: title, 2-line excerpt, read time, date.
5. **One-line about + CTA** — single paragraph ending in a link to `/about`, and a link to `/contact`.
6. **Footer** — minimal: copyright, two social links (GitHub + one other), light/dark toggle. No public email.

Banned: services blocks, testimonial walls, newsletter popups, "trusted by" logo bars with >3 logos, animated number counters, "scroll to explore" arrows.

### `/work` — Selected Weburz case studies

Index page = vertical stack of case-study cards (NOT a grid of tiles). Each case study lives at `/work/[slug]` with this skeleton:

1. Client + project name + dates
2. **Problem** — 2-3 sentences. What was broken or absent.
3. **Approach** — 2-3 paragraphs. What Weburz did, the key technical / strategic decisions.
4. **Outcome** — measurable result (metric, launch, deal). One sentence is enough.
5. Pull quote from the client (optional).
6. Stack chip-list at the bottom (technologies used).

One signature design beat is allowed here: a **GSAP scroll-pinned horizontal walk** through 3-4 key milestones of the project. Use it once per case study, max.

### `/about` — Long-form founder bio

Editorial layout. Single column. Generous line-height. Section structure:

1. **One-line identity** ("I run Weburz from [city], and I make things on the side.")
2. **Why Weburz exists** — origin story, 3-5 paragraphs.
3. **What I believe** — 3-5 short opinions about the work (engineering, design, clients, pricing). First-person, opinionated, link-worthy quotes.
4. **What I'm doing now** — a "now" block ([nownownow.com](https://nownownow.com) format): currently building, currently reading, currently playing. Updates manually. ~5 bullets.
5. **Things I've shipped** — bullet list with links (open-source projects, talks, side things). Anchors credibility without becoming a portfolio.

### `/writing` (and `/writing/[slug]`) — Blog

Data source: **BurzBlog public REST API** at `/v1/posts` and `/v1/posts/[slug]`.

`/writing` index:
- Reverse-chronological list. Each entry: title (linked), 2-line excerpt, date, read time, optional tags.
- No featured-image grid. This is a *writing* surface, not a magazine front page.
- Sidebar (desktop) or top filter (mobile): list of tags pulled from `/v1/tags`. Click filters the list.

`/writing/[slug]`:
- Single column, 64ch reading measure (~`max-w-prose`).
- Hero: title + date + read time. No hero image (unless the post chose one).
- Body uses sea-foam cream background in light mode (paper feel), deep ocean in dark.
- Article-end: "Written by Sagar Kapoor" with avatar + 2-line bio + link to `/about`. No newsletter signup. No share buttons.
- (Optional, lower priority) Marginalia / footnote rendering — Maggie-Appleton-style side notes if BurzBlog markdown supports them.

### `/contact` — Message in a bottle (the signature surface)

See §9.

---

## 9. Signature interaction: `/contact` = "message in a bottle"

The single most distinctive moment on the site. This is where the design budget is spent.

### Layout

Calm and ocean-toned at rest. Two-column on desktop, stacked on mobile:

- **Left column (or top on mobile):** A short, warm hook ("Throw a message in the ocean. I check the tide most mornings."). Three small badges underneath: "Responds in 1-3 days · No noreply replies · No newsletter subscription"
- **Right column (or bottom on mobile):** The form itself.

### The form

Fields:
1. **Your name** — text input
2. **Your email** — email input (validated client + server side; the email is what Sagar replies *to*, never displayed)
3. **What's this about?** — single-line input
4. **Your message** — textarea, rendered in **JetBrains Mono**, with a *subtle* typewriter cursor blinking at the end. Typing should feel weighty — slightly more letter-spacing than default, slightly larger.
5. **Hidden honeypot field** — `name="website"`, screen-reader-hidden, never visible. Submissions with this filled are silently dropped.
6. **Cloudflare Turnstile** widget below the textarea.
7. **Submit button** — coral (`#E8745C`), labelled "Cast into the ocean" (not "Submit," not "Send message"). Single CTA.

### The submit animation (the moment)

When the user clicks submit and the form passes validation + Turnstile:

1. The form fields **roll into themselves** like a scroll of paper rolling shut. The textarea text scrolls upward and condenses into a small slip.
2. The slip is wrapped into a **glass bottle SVG** that materializes in front of the now-empty form area.
3. The bottle is **corked** (subtle "thunk" haptic on mobile if available, no sound on desktop).
4. The bottle **drifts off-screen** to the right with a gentle bobbing motion — easing follows a sine wave, not a straight line. Takes ~2.5 seconds.
5. The page reveals: "Cast. I'll write back from the shore." in `body-lg`. Below: a single secondary link, "Read something while you wait → [most recent post]".

If submission **fails** (network, server, validation): the bottle does not appear. Instead the form gently *shakes* once (8px left, 8px right, 4px left, 0) and a coral error message appears under the failing field. Never an alert. Never a red banner across the top.

### Implementation notes for the prototyper

- Animation runs on GSAP. Total duration ≤3s. Skippable via `prefers-reduced-motion: reduce` — in that case, the form simply fades out and the success message fades in. No bottle.
- The bottle is a hand-drawn SVG, not 3D. Two-color: glass outline in current text color, message-slip inside in BurzYellow.
- Drifting motion uses `gsap.to()` with a custom ease. NOT a physics simulation.
- Submit handler hits a Nuxt server route at `/api/contact` (Nitro on Cloudflare Pages). The route validates, calls Resend to deliver to a private address, returns `{ ok: true }`.

---

## 10. Components

Built on **Nuxt UI 4**. Use Nuxt UI primitives wherever possible; customize via the `app.config.ts` theme. Hand-build only what Nuxt UI doesn't cover (the bottle animation, the marginalia on `/writing`, the `/about` "now" block).

Components to prototype:

| Name | Used on | Notes |
|---|---|---|
| `SiteHeader` | All routes | Logo (Sagar wordmark, 2-letter monogram on mobile) + 4 nav links (Work, Writing, About, Contact) + color-mode toggle. No CTA in header. |
| `SiteFooter` | All routes | © year · GitHub · X/Mastodon · color-mode toggle. One line. |
| `HomeHero` | `/` | Display-xl headline, body-lg sub, two link-buttons. Subtle BurzYellow underline on hover only. |
| `WorkCard` | `/`, `/work` | Stacked card: client tag, headline, one-line outcome, "Read case study →" link. |
| `PostTeaser` | `/`, `/writing` | Title (links), 2-line excerpt, metadata row (date · read time · tag). |
| `NowBlock` | `/about` | 5-bullet "currently" list with date stamp. |
| `BottleForm` | `/contact` | The signature component. See §9. |
| `CaseStudyMilestones` | `/work/[slug]` | GSAP horizontal scroll-pin. 3-4 panels per case. |

---

## 11. Voice & copy guidelines

- **First person, always.** "I built…" not "We built…" (Weburz says "we"; this is Sagar.)
- **Specific over abstract.** "12 shipped products" not "lots of work shipped."
- **Direct over polite.** "Cast into the ocean" not "Send your message please."
- **Opinions encouraged.** Brief, defensible, link-worthy. "Most agency timelines are dishonest. Ours aren't."
- **No corporate verbs:** leverage, empower, enable, drive, unlock, transform, deliver value.
- **No emojis in body copy.** A single 🐚 or 🌊 *might* live somewhere as an Easter egg. Never in headings.

Sample lines (use as voice calibration, not as final copy):

- **Hero h1:** "I'm Sagar. I run Weburz, a small studio that ships real software."
- **Hero sub:** "Founded in [year], based in [city]. Sometimes I make games."
- **Footer:** "© 2026 Sagar Kapoor · Built in public on Cloudflare"
- **404 page:** "This page drifted off. Try [home] or [writing]."

---

## 12. Anti-patterns (the design-review checklist)

Reject any prototype that includes:

- [ ] Three.js / WebGL background on any route
- [ ] Mouse-trail particles, cursor halos, magnetic cursors
- [ ] Card-tilt effects (`transform: rotateX(...)` on hover)
- [ ] Animated number counters in the trust-signal section
- [ ] "Scroll to explore" indicator on the hero
- [ ] Newsletter signup popup or sticky banner
- [ ] More than 3 logos in any logo bar
- [ ] A testimonial wall with photo carousel
- [ ] Stock photography of any kind
- [ ] Anchors, lighthouses, palm trees, beach imagery, or any nautical icons besides the bottle
- [ ] The animated terminal component (Weburz owns it)
- [ ] The interactive particle constellation (Weburz owns it)
- [ ] Public email address anywhere on the site (`mailto:` or otherwise)
- [ ] A `/games` route or any "coming soon" stub for it
- [ ] Emojis in headings or nav

---

## 13. Tech stack (for context — not for the prototype)

The eventual implementation will be: **Nuxt 4 + Nuxt UI 4 + Tailwind v4 + Nitro server routes**, deployed to **Cloudflare Pages**. Blog data from **BurzBlog REST API** (`/v1/*`). Contact form via Nitro route → **Resend** → private mailbox. Form anti-spam via **Cloudflare Turnstile** + honeypot.

The prototype does not need to ship code in this stack — Tailwind + vanilla HTML is fine. The implementation will adapt the prototype's design into the real stack.

---

## 14. Prototype priority (what to build first)

Generate prototypes in this order:

1. **`/` (home)** — sets the visual language. Highest value.
2. **`/contact`** — the signature interaction. Prototype the resting state AND the bottle animation.
3. **`/writing/[slug]`** — the long-form reading experience.
4. **`/work/[slug]`** — case study with the scroll-pinned milestones beat.
5. **`/about`** — editorial layout with the "now" block.
6. **`/work` index** + **`/writing` index** + **404 page**.

For each prototype: produce both dark mode (default) and light mode views.
