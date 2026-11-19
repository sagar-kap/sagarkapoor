<template>
  <section id="trading" aria-labelledby="trading-title" class="trading-desk">
    <div class="desk-notes">
      <h2 id="trading-title" class="font-display text-display-md font-semibold">
        Trading desk
      </h2>
      <p class="mt-3 max-w-sm leading-relaxed text-(--muted)">
        A little ICT chart study. Price takes the old high, then slips back
        below it.
      </p>
      <button
        type="button"
        :aria-pressed="marked"
        class="mt-5 inline-flex items-center gap-2 rounded-full border border-(--hairline) bg-(--surface) px-4 py-2 text-sm hover:text-(--accent)"
        @click="marked = !marked"
      >
        <UIcon name="i-lucide-pencil" aria-hidden="true" /> Chart markup
      </button>
    </div>
    <div class="desk-stage">
      <div class="monitor">
        <div
          class="screen"
          role="img"
          :aria-label="
            marked
              ? 'Illustrated candlestick chart with the previous high and liquidity sweep marked.'
              : 'Illustrated candlestick chart rising to a high, then falling.'
          "
        >
          <div class="screen-title">ICT / LIQUIDITY SWEEP</div>
          <div class="plot" aria-hidden="true">
            <div
              v-for="(bar, i) in candles"
              :key="i"
              class="candle"
              :class="{ falling: bar.close < bar.open }"
              :style="{
                left: ((i + 0.5) / candles.length) * 100 + '%',
                bottom: bar.low + '%',
                height: bar.high - bar.low + '%',
              }"
            >
              <span
                :style="{
                  bottom:
                    ((Math.min(bar.open, bar.close) - bar.low) /
                      (bar.high - bar.low)) *
                      100 +
                    '%',
                  height:
                    (Math.abs(bar.open - bar.close) / (bar.high - bar.low)) *
                      100 +
                    '%',
                }"
              />
            </div>
            <div v-if="marked" class="old-high"><span>Previous high</span></div>
            <div v-if="marked" class="sweep">Sweep ↓</div>
          </div>
        </div>
        <div class="bezel" aria-hidden="true"><i /> <span /></div>
      </div>
      <div class="stand" aria-hidden="true" />
      <div class="keyboard" aria-hidden="true" />
    </div>
  </section>
</template>

<script setup lang="ts">
const marked = ref(true);
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
const candles = bars.map(([open, high, low, close]) => ({
  open,
  high,
  low,
  close,
}));
</script>

<style scoped>
.trading-desk {
  scroll-margin-top: 5rem;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  align-items: center;
  margin-top: 3rem;
  overflow: hidden;
  border: 1px solid var(--hairline);
  border-radius: 1rem;
  background: var(--surface);
}
.desk-notes {
  padding: clamp(1.25rem, 4vw, 3rem);
}
.desk-stage {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: grid;
  justify-items: center;
  align-content: center;
  min-height: 18rem;
  perspective: 850px;
  background:
    radial-gradient(ellipse at 75% 20%, #795e87 0%, transparent 60%),
    linear-gradient(
      170deg,
      #34425a 0%,
      #404056 65%,
      #69545a 65.5%,
      #392c40 100%
    );
}
.monitor {
  width: min(72%, 22rem);
  padding: 9px 10px 0;
  border-radius: 12px 12px 9px 9px;
  background: linear-gradient(135deg, #dbc4aa, #a69691 58%, #9b8279);
  box-shadow:
    6px 5px 0 #716065,
    10px 8px 0 #483c4b,
    16px 18px 22px #251d3555;
  transform: rotateY(-10deg) rotateX(3deg) rotateZ(-2deg);
  z-index: 2;
}
.screen {
  position: relative;
  overflow: hidden;
  border: 4px solid #494650;
  border-radius: 8px;
  color: #b8eddc;
  background:
    repeating-linear-gradient(0deg, transparent 0 19px, #79a7a21b 20px),
    repeating-linear-gradient(90deg, transparent 0 29px, #79a7a21b 30px),
    radial-gradient(ellipse at bottom, #20434b, #111f2e);
}
.screen-title {
  margin: 0.5rem 0.7rem 0;
  color: #bde5d9;
  font: 600 10px/1.4 monospace;
  letter-spacing: 0.11em;
}
.plot {
  height: clamp(7rem, 12vw, 9rem);
  margin: 0 0.6rem 0.4rem;
  position: relative;
}
.candle {
  position: absolute;
  width: 1px;
  background: #80e2c2;
  color: #80e2c2;
}
.candle.falling {
  background: #fb998b;
  color: #fb998b;
}
.candle span {
  position: absolute;
  left: -2px;
  width: 5px;
  background: currentColor;
}
.old-high {
  position: absolute;
  left: 27.5%;
  width: 40%;
  bottom: 66%;
  border-bottom: 1px dashed #f8d492;
}
.old-high span,
.sweep {
  color: #ffe4af;
  font: 10px/1.2 monospace;
}
.old-high span {
  position: absolute;
  left: 0;
  bottom: 3px;
}
.sweep {
  position: absolute;
  bottom: 82%;
  right: 32%;
}
.bezel {
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
}
.bezel i {
  width: 18%;
  height: 3px;
  background: repeating-linear-gradient(
    90deg,
    #60565b 0 2px,
    transparent 2px 4px
  );
}
.bezel span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #b2f0b3;
}
.stand {
  width: 23%;
  height: 18px;
  background: linear-gradient(90deg, #86747a, #ab9990 67%, #71646c);
  transform: skewX(-6deg);
}
.keyboard {
  width: 43%;
  height: 21px;
  border: 3px solid #b7a395;
  border-radius: 3px;
  transform: skewX(-24deg) rotate(-2deg);
  background:
    repeating-linear-gradient(0deg, transparent 0 5px, #b3a192 5px 7px),
    repeating-linear-gradient(90deg, #665c65 0 6px, #b3a192 6px 8px);
  box-shadow: 3px 4px 0 #72616b;
}
@media (max-width: 47.99rem) {
  .trading-desk {
    grid-template-columns: 1fr;
  }
  .desk-stage {
    min-height: 14rem;
  }
}
</style>
