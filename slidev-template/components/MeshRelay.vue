<script setup>
const A = { x: 140, y: 230 }
const L1 = { x: 70, y: 120 }
const L2 = { x: 210, y: 90 }
const L3 = { x: 290, y: 160 }
const L4 = { x: 300, y: 300 }

const D = { x: 820, y: 230 }
const R1 = { x: 890, y: 120 }
const R2 = { x: 750, y: 90 }
const R3 = { x: 670, y: 160 }
const R4 = { x: 660, y: 300 }

const CLOUD = { x: 480, y: 60 }

const nodes = [
  { x: A.x, y: A.y, kind: 'end' },
  { x: L1.x, y: L1.y, kind: 'mid' },
  { x: L2.x, y: L2.y, kind: 'mid' },
  { x: L3.x, y: L3.y, kind: 'mid' },
  { x: L4.x, y: L4.y, kind: 'mid' },
  { x: D.x, y: D.y, kind: 'end' },
  { x: R1.x, y: R1.y, kind: 'mid' },
  { x: R2.x, y: R2.y, kind: 'mid' },
  { x: R3.x, y: R3.y, kind: 'mid' },
  { x: R4.x, y: R4.y, kind: 'mid' },
]

// LoRa mesh links (both clusters, interconnected)
const loraLinks = [
  [A, L1], [A, L2], [A, L3], [A, L4],
  [L1, L2], [L2, L3], [L3, L4],
  [D, R1], [D, R2], [D, R3], [D, R4],
  [R1, R2], [R2, R3], [R3, R4],
]

// MQTT bridge between the two meshes
const mqttLinks = [
  [L3, CLOUD],
  [CLOUD, R3],
]
</script>

<template>
  <div class="relay">
    <svg class="relay-svg" viewBox="0 0 960 400" role="img" aria-label="Due mesh LoRa collegate da MQTT">
      <!-- LoRa links -->
      <line
        v-for="(l, i) in loraLinks"
        :key="'l' + i"
        class="link lora"
        :x1="l[0].x"
        :y1="l[0].y"
        :x2="l[1].x"
        :y2="l[1].y"
      />

      <!-- MQTT links -->
      <line
        v-for="(l, i) in mqttLinks"
        :key="'m' + i"
        class="link mqtt"
        :x1="l[0].x"
        :y1="l[0].y"
        :x2="l[1].x"
        :y2="l[1].y"
      />

      <!-- MQTT broker (cloud) -->
      <g class="mqtt-cloud" :transform="`translate(${CLOUD.x} ${CLOUD.y})`">
        <circle cx="-18" cy="3" r="12" />
        <circle cx="0" cy="-7" r="16" />
        <circle cx="18" cy="3" r="12" />
        <rect x="-22" y="3" width="44" height="14" rx="7" />
      </g>

      <!-- nodes -->
      <g v-for="(n, i) in nodes" :key="'n' + i" :transform="`translate(${n.x} ${n.y})`">
        <circle class="node-circle" :class="n.kind" r="20" />
        <line class="antenna" :class="n.kind" x1="0" y1="-20" x2="0" y2="-34" />
        <circle class="antenna-dot" :class="n.kind" cx="0" cy="-36" r="3" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.relay {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 0.5rem;
}

.relay-svg {
  width: min(960px, 100%);
  height: auto;
}

.link {
  stroke-width: 2;
  stroke-linecap: round;
  fill: none;
}
.link.lora {
  stroke: rgba(103, 234, 148, 0.45);
}
.link.mqtt {
  stroke: rgba(90, 200, 250, 0.6);
  stroke-width: 2.5;
  stroke-dasharray: 6 6;
}

.mqtt-cloud circle,
.mqtt-cloud rect {
  fill: rgba(90, 200, 250, 0.12);
  stroke: rgba(90, 200, 250, 0.6);
  stroke-width: 1.5;
}

.node-circle {
  stroke-width: 2.5;
}
.node-circle.end {
  fill: rgba(103, 234, 148, 0.14);
  stroke: #67ea94;
}
.node-circle.mid {
  fill: rgba(255, 255, 255, 0.05);
  stroke: #7c8797;
}

.antenna {
  stroke-width: 2.5;
  stroke-linecap: round;
}
.antenna.end {
  stroke: #67ea94;
}
.antenna.mid {
  stroke: #7c8797;
}
.antenna-dot.end {
  fill: #67ea94;
}
.antenna-dot.mid {
  fill: #7c8797;
}
</style>
