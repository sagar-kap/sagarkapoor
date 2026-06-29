/**
 * Real lunar phase, computed from the date — no API, runs anywhere.
 *
 * Tides are driven by the Moon and Sun, so even without a coastline we can show
 * something genuinely true: the current phase, and whether tides are running
 * SPRING (large — near new/full moon, when Sun and Moon pull in line) or NEAP
 * (small — near the quarters, when they pull at right angles).
 *
 * Method: count synodic months since a known new moon (2000-01-06 18:14 UTC).
 * Accurate to well within a day, which is all a phase label needs.
 */
export const useMoon = () => {
  const SYNODIC_MONTH = 29.53058867; // days, mean new-moon to new-moon
  const REF_NEW_MOON_JD = 2451550.1; // Julian Date of the 2000-01-06 new moon

  const now = ref(new Date());

  const phase = computed(() => {
    // Julian Date from the JS epoch, then position within the synodic cycle.
    const jd = now.value.getTime() / 86_400_000 + 2440587.5;
    let p = ((jd - REF_NEW_MOON_JD) / SYNODIC_MONTH) % 1;
    if (p < 0) p += 1; // 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last
    return p;
  });

  // Illuminated fraction of the disc, 0 (new) → 1 (full).
  const illuminationPct = computed(() =>
    Math.round(((1 - Math.cos(2 * Math.PI * phase.value)) / 2) * 100),
  );

  const isWaxing = computed(() => phase.value < 0.5);

  const NAMES = [
    "new moon",
    "waxing crescent",
    "first quarter",
    "waxing gibbous",
    "full moon",
    "waning gibbous",
    "last quarter",
    "waning crescent",
  ] as const;
  const EMOJIS = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"] as const;

  const bin = computed(() => Math.round(phase.value * 8) % 8);
  const phaseName = computed(() => NAMES[bin.value]);
  const emoji = computed(() => EMOJIS[bin.value]);

  // Tidal range: strongest at new/full (cos = ±1), weakest at the quarters.
  // 1 = peak spring, 0 = slackest neap. Drives both the label and the visual
  // swell of the footer tide.
  const tideStrength = computed(() =>
    Math.abs(Math.cos(2 * Math.PI * phase.value)),
  );

  const tideLabel = computed(() => {
    const strength = tideStrength.value;
    if (strength > 0.62) return "spring tides";
    if (strength < 0.38) return "neap tides";
    // Between the extremes: are we heading toward spring or toward neap?
    const climbing = phase.value % 0.5 > 0.25; // second half of each half-cycle
    return climbing ? "tides building" : "tides easing";
  });

  onMounted(() => {
    now.value = new Date();
  });

  return {
    phaseName,
    emoji,
    tideLabel,
    illuminationPct,
    isWaxing,
    tideStrength,
  };
};
