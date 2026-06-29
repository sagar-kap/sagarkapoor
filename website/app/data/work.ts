/**
 * Selected Weburz case studies, CEO-told (not portfolio tiles). Three surface
 * on the home page; all live at /work and /work/[slug].
 *
 * Copy here is a first draft in Sagar's voice — first person, specific,
 * opinionated, no corporate verbs. Swap names/metrics for the final approved
 * versions before launch.
 */

export interface Milestone {
  /** Mono step label, e.g. "01". */
  label: string;
  title: string;
  body: string;
}

export interface CaseStudy {
  slug: string;
  client: string;
  project: string;
  /** Sagar's role on the engagement. */
  role: string;
  /** Human period string, e.g. "2023 — 2024". */
  period: string;
  /** One-line outcome for the card teaser. */
  outcome: string;
  /** 2-3 sentences: what was broken or absent. */
  problem: string;
  /** 2-3 paragraphs: what we did and why. */
  approach: string[];
  /** One measurable sentence. */
  result: string;
  quote?: { text: string; author: string; role: string };
  stack: string[];
  milestones: Milestone[];
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "kabbalah-india",
    client: "Kabbalah India",
    project: "Teaching platform & public site",
    role: "Lead engineer · founder",
    period: "2023 — 2024",
    outcome: "Publishing got simple again — a lesson goes up in minutes.",
    problem:
      "The team published long-form teaching through a tangle of third-party tools that no one fully controlled. Every new lesson meant copy-pasting between five services, and the site itself was a slow, un-styleable template they couldn't change.",
    approach: [
      "I replaced the stack with a single Nuxt site backed by our own headless CMS, so editors write once and it lands everywhere — site, feeds, and share cards — without touching a developer.",
      "We built the reading experience around the words: a paper-like long-form surface, real typography, and a content model that matches how they actually teach rather than how a SaaS template assumed they would.",
      "The whole thing prerenders to a CDN, so a lesson that used to take a day to format and ship now goes live in the time it takes to write it.",
    ],
    result: "What used to take a couple of days now takes a few minutes.",
    quote: {
      text: "We stopped fighting our own website. Now we just teach.",
      author: "The Kabbalah India team",
      role: "Client",
    },
    stack: ["Nuxt", "TypeScript", "Headless CMS", "Cloudflare"],
    milestones: [
      {
        label: "01",
        title: "Audit",
        body: "Mapped the five-tool publishing chain and found where time actually went.",
      },
      {
        label: "02",
        title: "Model",
        body: "Designed a content model around how they teach, not how a template assumed.",
      },
      {
        label: "03",
        title: "Build",
        body: "One Nuxt site + our CMS, prerendered to the edge for instant reads.",
      },
      {
        label: "04",
        title: "Ship",
        body: "Migrated the archive and handed editors a one-screen workflow.",
      },
    ],
  },
  {
    slug: "natrixx",
    client: "Natrixx",
    project: "Official artist site",
    role: "Design engineer",
    period: "2025",
    outcome: "A calm, fast home for the music to live in.",
    problem:
      "An independent artist with real momentum was sending fans to a link-in-bio page that looked like everyone else's. There was no home that felt like the music — dark, deliberate, unmistakably theirs.",
    approach: [
      "We built a single dark, near-monochrome site where one accent colour does all the work — quiet, so the music gets to lead.",
      "Streaming, video, releases, and merch all live on one page with embeds that stay fast: facade-loaded video, a prerendered shell, and atmosphere from grain and type rather than heavy media.",
      "Bookings and press go through a server-relayed form, so the artist's real inbox never sits in the page source for scrapers to find.",
    ],
    result:
      "One page now holds everything that used to live across six scattered links.",
    stack: ["Nuxt", "Nuxt UI", "GSAP", "Cloudflare"],
    milestones: [
      {
        label: "01",
        title: "Identity",
        body: "Found the visual language: dark, monochrome, one struck-match accent.",
      },
      {
        label: "02",
        title: "Compose",
        body: "Folded music, video, releases, and merch into a single fast page.",
      },
      {
        label: "03",
        title: "Protect",
        body: "Moved bookings to a server-relayed form — no email in the DOM.",
      },
    ],
  },
  {
    slug: "absfit",
    client: "ABSFit",
    project: "Coaching & membership site",
    role: "Lead engineer",
    period: "2024",
    outcome: "A sign-up that feels easy on a phone.",
    problem:
      "A growing fitness brand was losing sign-ups to a checkout that broke on phones and a site that took too long to load on gym Wi-Fi. The funnel leaked at exactly the moment people were ready to pay.",
    approach: [
      "I rebuilt the front end mobile-first and measured the real journey — most members arrive on a phone, mid-session, on bad signal — then made that path the fast one.",
      "We simplified the membership flow to the fewest honest steps and wired it to a payment path that doesn't fall over on mobile Safari.",
      "Everything ships from the edge, so the first screen is instant even when the network isn't.",
    ],
    result: "Signing up on a phone got a lot easier.",
    stack: ["Nuxt", "TypeScript", "Vercel"],
    milestones: [
      {
        label: "01",
        title: "Measure",
        body: "Instrumented the real funnel and found where mobile users dropped.",
      },
      {
        label: "02",
        title: "Rebuild",
        body: "Mobile-first front end with the fastest path made the default path.",
      },
      {
        label: "03",
        title: "Convert",
        body: "Cut the membership flow to the fewest honest steps.",
      },
    ],
  },
];

export const featuredCaseStudies = caseStudies.slice(0, 3);

export const findCaseStudy = (slug: string) =>
  caseStudies.find((study) => study.slug === slug);
