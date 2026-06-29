/**
 * Renders a reading-time label. Prefers an explicit minute count when given;
 * otherwise estimates from a word count at ~220 wpm (how posts compute it from
 * their markdown). `useFormattedX` adjective form per house convention.
 */
export const useFormattedReadTime = () => {
  const WORDS_PER_MINUTE = 220;

  const formatReadTime = (input: { minutes?: number; words?: number }) => {
    const minutes =
      input.minutes ??
      (input.words
        ? Math.max(1, Math.round(input.words / WORDS_PER_MINUTE))
        : 0);

    return minutes > 0 ? `${minutes} min read` : "";
  };

  return { formatReadTime };
};
