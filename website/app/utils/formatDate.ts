// Format calendar dates in UTC so the same day renders in every time zone.
const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export const formatDate = (isoDate: string) =>
  dateFormatter.format(new Date(isoDate));
