/**
 * Selected Weburz case studies, CEO-told (not portfolio tiles). Up to three surface
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
  role?: string;
  /** Human period string, e.g. "2023 — 2024". */
  period?: string;
  url: string;
  /** One-line outcome for the card teaser. */
  outcome: string;
  /** 2-3 sentences: what was broken or absent. */
  problem: string;
  /** 2-3 paragraphs: what we did and why. */
  approach: string[];
  /** One plain sentence on what changed for the client. */
  result: string;
  quote?: { text: string; author: string; role: string };
  stack: string[];
  milestones: Milestone[];
  screenshot: string;
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "natrixx",
    url: "https://natrixxofficial.com",
    screenshot: "/projects/natrixx.webp",
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
    slug: "linsho",
    url: "https://linsho.bg",
    screenshot: "/projects/linsho.webp",
    client: "Linsho",
    project: "Music, games, and collaborations",
    outcome: "One homepage with two doors, one for fans and one for brands.",
    problem:
      "Someone looking for Linsho’s latest song and someone planning a collaboration arrive at the same address. They need different things from the first click.",
    approach: [
      "The homepage opens on Linsho in front of a neon sign. Two buttons do the navigation work: Фенове (Fans) and Брандове (Brands).",
      "On the fan side you can find songs, look up events, and play two browser games. On the brand side you can browse past projects and get in touch about a collaboration.",
    ],
    result:
      "A fan can go straight from the homepage to a game. A potential partner can follow an equally short path to the project archive.",
    stack: ["Nuxt", "Vue", "TypeScript", "Phaser"],
    milestones: [],
  },
];

export const featuredCaseStudies = caseStudies.slice(0, 3);

export const findCaseStudy = (slug: string) =>
  caseStudies.find((study) => study.slug === slug);

const otherProjects = [
  {
    name: "avtoclima.com",
    screenshot: "/projects/avtoclima.webp",
    url: "https://avtoclima.com",
  },
  {
    name: "BurzBlog",
    screenshot: "/projects/burzblog.webp",
    url: "https://burzblog.weburz.com",
  },
];

export const linkedProjects = [
  { name: "linsho.bg", url: "https://linsho.bg" },
  ...otherProjects,
];

export const galleryProjects = [
  {
    name: "ABSFit",
    screenshot: "/projects/absfit.webp",
    url: "https://absfit.in",
  },
  ...otherProjects,
];
