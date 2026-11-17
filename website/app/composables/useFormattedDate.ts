/**
 * One module-level Intl.DateTimeFormat shared by every caller — post dates
 * render in a loop (PostTeaser), so per-component instances would multiply.
 * Pass an ISO date string (yyyy-mm-dd or full ISO).
 *
 * timeZone is pinned to UTC because these are calendar dates, not instants:
 * `2026-05-18` parses to midnight UTC, and formatting that in a visitor's
 * local zone west of UTC would show the previous day (and mismatch SSR).
 */
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const useFormattedDate = () => {
  const formatDate = (isoDate: string) =>
    dateFormatter.format(new Date(isoDate));

  return { formatDate };
};
