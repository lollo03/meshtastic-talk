<script setup>
import { computed } from "vue"

// Nodi Meshtastic registrati in Italia, per mese (fonte: nodes.json, snapshot set 2026)
const MONTHS = [
  { label: "mar 25", month: "mar", year: "25", added: 41, total: 41 },
  { label: "apr 25", month: "apr", year: "25", added: 25, total: 66 },
  { label: "mag 25", month: "mag", year: "25", added: 48, total: 114 },
  { label: "giu 25", month: "giu", year: "25", added: 36, total: 150 },
  { label: "lug 25", month: "lug", year: "25", added: 37, total: 187 },
  { label: "ago 25", month: "ago", year: "25", added: 51, total: 238 },
  { label: "set 25", month: "set", year: "25", added: 39, total: 277 },
  { label: "ott 25", month: "ott", year: "25", added: 52, total: 329 },
  { label: "nov 25", month: "nov", year: "25", added: 54, total: 383 },
  { label: "dic 25", month: "dic", year: "25", added: 60, total: 443 },
  { label: "gen 26", month: "gen", year: "26", added: 94, total: 537 },
  { label: "feb 26", month: "feb", year: "26", added: 168, total: 705 },
  { label: "mar 26", month: "mar", year: "26", added: 178, total: 883 },
  { label: "apr 26", month: "apr", year: "26", added: 165, total: 1048 },
  { label: "mag 26", month: "mag", year: "26", added: 124, total: 1172 },
  { label: "giu 26", month: "giu", year: "26", added: 118, total: 1290 },
  { label: "lug 26", month: "lug", year: "26", added: 119, total: 1409 },
  { label: "ago 26", month: "ago", year: "26", added: 114, total: 1523 },
  { label: "set 26", month: "set", year: "26", added: 142, total: 1665 },
]

// Ultimo valore cumulativo mostrato con etichetta
const lastIndex = MONTHS.length - 1

const W = 1000
const H = 278
const PAD = { l: 62, r: 54, t: 30, b: 34 }

const plotW = W - PAD.l - PAD.r
const plotH = H - PAD.t - PAD.b

const maxTotal = 1800 // asse sinistro "totale" arrotondato
const maxAdded = 180 // asse destro "nuovi / mese"
const barScale = 0.55 // le barre occupano solo la metà bassa del grafico

const n = MONTHS.length
const stepX = plotW / n

const x = (i) => PAD.l + stepX * (i + 0.5)
const yTotal = (v) => PAD.t + plotH - (v / maxTotal) * plotH
const barH = (v) => (v / maxAdded) * plotH * barScale
const barW = stepX * 0.56

const points = computed(() =>
  MONTHS.map((d, i) => ({ x: x(i), y: yTotal(d.total), d })),
)

const linePath = computed(() =>
  points.value.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" "),
)

const areaPath = computed(() => {
  const top = points.value.map((p) => `L ${p.x} ${p.y}`).join(" ")
  const base = PAD.t + plotH
  return `M ${points.value[0].x} ${base} ${top} L ${points.value[n - 1].x} ${base} Z`
})

// tick dell'asse sinistro (totale)
const totalTicks = [0, 500, 1000, 1500].map((v) => ({
  v,
  y: yTotal(v),
  label: v.toLocaleString("it-IT"),
}))

// tick dell'asse destro (nuovi nodi al mese)
const addedTicks = [90, 180].map((v) => ({
  v,
  y: PAD.t + plotH - barH(v),
}))

// mostro un'etichetta mese sì e no per non affollare
const showLabel = (i) => i % 2 === 0 || i === n - 1

// includo l'anno sulla prima etichetta e al cambio d'anno
const tickLabel = (i) =>
  i === 0 || MONTHS[i].year !== MONTHS[i - 1].year
    ? `${MONTHS[i].month} ${MONTHS[i].year}`
    : MONTHS[i].month
</script>

<template>
  <div class="growth">
    <svg
      class="growth-svg"
      viewBox="0 0 1000 278"
      role="img"
      aria-label="Crescita dei nodi Meshtastic registrati in Italia da marzo 2025 a settembre 2026"
    >
      <defs>
        <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#67ea94" stop-opacity="0.24" />
          <stop offset="100%" stop-color="#67ea94" stop-opacity="0" />
        </linearGradient>
      </defs>

      <!-- griglia orizzontale + asse sinistro (totale) -->
      <g class="grid">
        <template v-for="t in totalTicks" :key="t.v">
          <line :x1="PAD.l" :y1="t.y" :x2="W - PAD.r" :y2="t.y" />
          <text class="axis-label" :x="PAD.l - 12" :y="t.y + 4" text-anchor="end">
            {{ t.label }}
          </text>
        </template>
      </g>

      <!-- asse destro (nuovi nodi al mese) -->
      <g class="bars-axis">
        <text
          v-for="t in addedTicks"
          :key="'a' + t.v"
          :x="W - PAD.r + 12"
          :y="t.y + 4"
        >
          {{ t.v }}
        </text>
      </g>

      <!-- area sotto la linea del totale -->
      <path class="area" :d="areaPath" />

      <!-- barre: nuovi nodi al mese -->
      <g class="bars">
        <rect
          v-for="(d, i) in MONTHS"
          :key="'b' + i"
          :x="x(i) - barW / 2"
          :y="PAD.t + plotH - barH(d.added)"
          :width="barW"
          :height="barH(d.added)"
          rx="2"
        />
      </g>

      <!-- linea: totale cumulativo -->
      <path class="line" :d="linePath" />

      <!-- punti -->
      <g class="dots">
        <circle
          v-for="(p, i) in points"
          :key="'d' + i"
          :cx="p.x"
          :cy="p.y"
          :r="i === lastIndex ? 5 : 3"
          :class="{ last: i === lastIndex }"
        />
      </g>

      <!-- etichetta valore finale -->
      <g class="last-label">
        <text :x="points[lastIndex].x - 6" :y="points[lastIndex].y - 14" text-anchor="end">
          1.665
        </text>
      </g>

      <!-- etichette mesi -->
      <g class="months">
        <template v-for="(d, i) in MONTHS" :key="'m' + i">
          <text
            v-if="showLabel(i)"
            :x="x(i)"
            :y="H - 10"
            text-anchor="middle"
          >
            {{ tickLabel(i) }}
          </text>
        </template>
      </g>

      <!-- legenda -->
      <g class="legend" :transform="`translate(${W - PAD.r - 250} 14)`">
        <rect class="legend-bar" x="0" y="-7" width="12" height="9" rx="2" />
        <text x="18" y="1">nuovi / mese</text>
        <line class="legend-line" x1="150" y1="-2" x2="176" y2="-2" />
        <circle class="legend-dot" cx="163" cy="-2" r="3.4" />
        <text x="184" y="1">totale</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.growth {
  width: 100%;
  display: flex;
  justify-content: center;
}

.growth-svg {
  width: 100%;
  height: auto;
}

.grid line {
  stroke: rgba(255, 255, 255, 0.07);
  stroke-width: 1;
}

.axis-label {
  fill: rgba(255, 255, 255, 0.45);
  font-size: 13px;
}

.bars-axis text {
  fill: rgba(103, 234, 148, 0.55);
  font-size: 12px;
}

.area {
  fill: url(#growth-area);
}

.bars rect {
  fill: rgba(103, 234, 148, 0.22);
}

.line {
  fill: none;
  stroke: #67ea94;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.dots circle {
  fill: #191919;
  stroke: #67ea94;
  stroke-width: 2;
}

.dots circle.last {
  fill: #67ea94;
  stroke: #67ea94;
}

.last-label text {
  fill: #67ea94;
  font-size: 20px;
  font-weight: 700;
}

.months text {
  fill: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}

.legend text {
  fill: rgba(255, 255, 255, 0.55);
  font-size: 13px;
}

.legend-bar {
  fill: rgba(103, 234, 148, 0.35);
}

.legend-line {
  stroke: #67ea94;
  stroke-width: 3;
  stroke-linecap: round;
}

.legend-dot {
  fill: #191919;
  stroke: #67ea94;
  stroke-width: 2;
}
</style>
