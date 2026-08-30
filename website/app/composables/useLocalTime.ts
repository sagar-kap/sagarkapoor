/**
 * Live local time where Sagar actually is (Sofia — the status copy and the
 * "in Sofia" labels are Sofia-specific, so the zone is fixed here), plus a
 * little personality: whether he's likely awake and a rotating cute status.
 * Formatters live at module scope — single Intl.DateTimeFormat instances,
 * reused (house convention). Client-only ticking; guard the display with
 * <ClientOnly> to avoid an SSR/client time mismatch.
 */
const TIME_ZONE = "Europe/Sofia";

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

const hourFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  hourCycle: "h23",
});

export const useLocalTime = () => {
  const now = ref(new Date());

  const time = computed(() => timeFormatter.format(now.value));
  const hour = computed(() => Number(hourFormatter.format(now.value)));
  const isAwake = computed(() => hour.value >= 8);

  // Cute, hour-aware status. Deterministic so it never flickers on re-render.
  const status = computed(() => {
    const h = hour.value;
    if (h < 6) return "asleep — your bottle will wait till morning";
    if (h < 9) return "probably making coffee";
    if (h < 12) return "heads-down, building";
    if (h < 14) return "lunch, most likely";
    if (h < 18) return "deep in the work";
    if (h < 22) return "winding down";
    return "should be asleep, probably isn't";
  });

  let timer: ReturnType<typeof setInterval> | undefined;

  onMounted(() => {
    now.value = new Date();
    timer = setInterval(() => {
      now.value = new Date();
    }, 30_000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return { time, hour, isAwake, status };
};
