/**
 * Reuses a single Intl.DateTimeFormat instance across every call instead of
 * re-instantiating per format — post dates render in a loop, so the one
 * formatter is shared. Pass an ISO date string (yyyy-mm-dd or full ISO).
 */
export const useFormattedDate = () => {
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formatDate = (isoDate: string) =>
    dateFormatter.format(new Date(isoDate));

  return { formatDate };
};
