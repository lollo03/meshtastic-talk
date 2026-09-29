<script setup>
import { ref } from "vue"
import { onSlideEnter, useNav } from "@slidev/client"

const STATS = [
  { value: 1665, name: "Nodi", desc: "snapshot set 2026" },
  { value: 107, name: "Gateway MQTT", desc: "solo il 6% è connesso ad Internet" },
  { value: 39, name: "Oltre 1.500 m", desc: "vetta più alta: 2.849 m" },
]

const prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches

const { isPrintMode } = useNav()

// in export/print mostriamo subito i valori finali, senza animazione
const instant = prefersReducedMotion || isPrintMode.value

const play = ref(false)
const values = ref(instant ? STATS.map((s) => s.value) : STATS.map(() => 0))

// separatore migliaia italiano deterministico (non dipende da ICU/locale)
const formatIT = (v) =>
  Math.round(v)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")

let rafIds = []

function stopAnimations() {
  rafIds.forEach((id) => cancelAnimationFrame(id))
  rafIds = []
}

function run() {
  stopAnimations()
  play.value = false

  if (instant) {
    values.value = STATS.map((s) => s.value)
    return
  }

  values.value = STATS.map(() => 0)
  rafIds.push(
    requestAnimationFrame(() =>
      rafIds.push(
        requestAnimationFrame(() => {
          play.value = true
          STATS.forEach((s, i) => {
            const start = performance.now() + 120 + i * 150
            const dur = 1200
            const tick = (now) => {
              const p = Math.min(1, Math.max(0, (now - start) / dur))
              const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
              const next = values.value.slice()
              next[i] = Math.round(s.value * eased)
              values.value = next
              if (p < 1) rafIds[i] = requestAnimationFrame(tick)
            }
            rafIds[i] = requestAnimationFrame(tick)
          })
        }),
      ),
    ),
  )
}

onSlideEnter(() => run())
</script>

<template>
  <div class="stats" :class="{ play, instant }">
    <div
      v-for="(s, i) in STATS"
      :key="i"
      class="stat-card"
      :style="{ animationDelay: `${i * 0.12}s` }"
    >
      <div class="stat-value">{{ formatIT(values[i]) }}</div>
      <div class="stat-name">{{ s.name }}</div>
      <div class="stat-desc">{{ s.desc }}</div>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 1rem 0.6rem 0.9rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  opacity: 0;
  transform: translateY(8px);
}

.stats.play .stat-card {
  animation: stat-in 0.5s ease-out forwards;
}

.stats.instant .stat-card {
  opacity: 1;
  transform: none;
  animation: none;
}

.stat-value {
  font-size: 2.4rem;
  font-weight: 800;
  line-height: 1;
  color: #67ea94;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.stat-name {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: center;
  line-height: 1.2;
  margin-top: 0.25rem;
}

.stat-desc {
  font-size: 0.7rem;
  line-height: 1.3;
  text-align: center;
  opacity: 0.6;
}

@keyframes stat-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-card {
    opacity: 1;
    transform: none;
  }
  .stats.play .stat-card {
    animation: none;
  }
}
</style>
