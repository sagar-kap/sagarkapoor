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
 *
 * Beyond spring/neap amplitude, we also track the DAILY cycle: the actual
 * water level of the equilibrium tide at Sofia's meridian, rising to high
 * water every 12h25m as the Moon transits — so the footer tide is high when
 * the real tide is high.
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

  // ——— Equilibrium tide at Sofia's longitude ———
  // Sofia has no coast, so we render the tide the Moon genuinely raises at
  // this meridian: high water when the Moon crosses it (above OR below the
  // horizon — the tide is semidiurnal), low water with the Moon on the
  // horizon. Mean-motion approximation: the Moon transits at local solar
  // time (0.5 + phase) · 24h (new moon → noon, full → midnight, ~50 min
  // later each day). True transit can drift ±40 min (eccentricity,
  // declination) — fine for a footer. No lunitidal lag: that constant
  // describes a particular coastline's basin, and we don't have one.
  const LON_DEG = 23.32; // local solar time = UTC + LON/15 hours
  const LUNAR_DAY_MS = 86_400_000 * (SYNODIC_MONTH / (SYNODIC_MONTH - 1)); // ≈ 24h 50m

  const frac = (x: number) => ((x % 1) + 1) % 1;

  // Moon's local hour angle as a fraction of the lunar day: 0 = upper
  // transit, 0.5 = lower transit (both high water), 0.25 / 0.75 = low water.
  const hourAngle = computed(() => {
    const utcDayFrac = frac(now.value.getTime() / 86_400_000);
    const solarFrac = frac(utcDayFrac + LON_DEG / 360);
    const transitFrac = frac(0.5 + phase.value);
    return frac(solarFrac - transitFrac);
  });

  // 0 = low water, 1 = high water. Two cycles per lunar day.
  const waterLevel = computed(
    () => (1 + Math.cos(4 * Math.PI * hourAngle.value)) / 2,
  );

  // d(level)/dt ∝ −sin(4πh), so the tide floods while sin(4πh) < 0.
  const isRising = computed(() => Math.sin(4 * Math.PI * hourAngle.value) < 0);

  const highWaterFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Sofia",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  // hourAngle advances at exactly one cycle per lunar day, so extrapolating
  // to the next multiple of 0.5 is exact within this model.
  const nextHighWaterTime = computed(() => {
    const toNext = (0.5 - (hourAngle.value % 0.5)) % 0.5;
    return highWaterFormatter.format(
      new Date(now.value.getTime() + toNext * LUNAR_DAY_MS),
    );
  });

  const tideReport = computed(
    () =>
      `tide ${isRising.value ? "coming in" : "going out"} · high water ~${nextHighWaterTime.value}`,
  );

  const tideLabel = computed(() => {
    const strength = tideStrength.value;
    if (strength > 0.62) return "spring tides";
    if (strength < 0.38) return "neap tides";
    // Between the extremes: are we heading toward spring or toward neap?
    const climbing = phase.value % 0.5 > 0.25; // second half of each half-cycle
    return climbing ? "tides building" : "tides easing";
  });

  // Tick every minute so a long-open tab watches the tide actually move
  // (steepest slope is ~0.004/min — smooth, never a visible jump).
  let timer: ReturnType<typeof setInterval> | undefined;

  onMounted(() => {
    now.value = new Date();
    timer = setInterval(() => {
      now.value = new Date();
    }, 60_000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    phaseName,
    emoji,
    tideLabel,
    illuminationPct,
    tideStrength,
    waterLevel,
    isRising,
    nextHighWaterTime,
    tideReport,
  };
};
