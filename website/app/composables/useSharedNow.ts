/**
 * One ticking clock for every live widget (local time, moon, tide). Each
 * caller used to run its own setInterval — the contact page alone had three.
 * Now there's a single module-level `now` on the client, ticked while anyone
 * is mounted and stopped when the last subscriber unmounts.
 *
 * Server-side the module-level ref would be frozen at first evaluation and
 * shared across requests, so the server gets a fresh, non-ticking Date per
 * call instead. Everything that renders from it is <ClientOnly> or
 * mounted-guarded anyway.
 */
const TICK_MS = 30_000;

const clientNow = ref(new Date());
let timer: ReturnType<typeof setInterval> | undefined;
let subscribers = 0;

export const useSharedNow = () => {
  if (import.meta.server) return ref(new Date());

  onMounted(() => {
    subscribers += 1;
    clientNow.value = new Date();
    if (!timer) {
      timer = setInterval(() => {
        clientNow.value = new Date();
      }, TICK_MS);
    }
  });

  onUnmounted(() => {
    subscribers -= 1;
    if (subscribers === 0 && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  });

  return clientNow;
};
