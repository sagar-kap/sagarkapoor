/**
 * One module-level Intl.DateTimeFormat shared by every caller — post dates
 * render in a loop (PostTeaser), so per-component instances would multiply.
 * Pass an ISO date string (yyyy-mm-dd or full ISO).
 */
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export const useFormattedDate = () => {
  const formatDate = (isoDate: string) =>
    dateFormatter.format(new Date(isoDate));

  return { formatDate };
};
