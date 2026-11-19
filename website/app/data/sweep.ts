// Hand-drawn OHLC values in chart coordinates, independent of market data.
const bars: [number, number, number, number][] = [
  [21, 36, 17, 32],
  [32, 38, 23, 26],
  [26, 44, 24, 40],
  [40, 51, 34, 47],
  [47, 57, 42, 53],
  [53, 66, 48, 60],
  [60, 63, 45, 49],
  [49, 54, 37, 42],
  [42, 48, 32, 35],
  [35, 45, 30, 41],
  [41, 53, 37, 48],
  [48, 58, 44, 54],
  [54, 63, 49, 59],
  [59, 80, 53, 62],
  [62, 64, 43, 45],
  [45, 48, 28, 32],
  [32, 39, 23, 26],
  [26, 35, 18, 30],
  [30, 33, 16, 20],
  [20, 27, 12, 24],
];
export const candles = bars.map(([open, high, low, close]) => ({
  open,
  high,
  low,
  close,
}));
