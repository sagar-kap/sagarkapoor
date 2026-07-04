/**
 * Renders a reading-time label from the post's minute count (posts compute it
 * from their markdown). `useFormattedX` adjective form per house convention.
 */
export const useFormattedReadTime = () => {
  const formatReadTime = (input: { minutes?: number }) =>
    input.minutes && input.minutes > 0 ? `${input.minutes} min read` : "";

  return { formatReadTime };
};
