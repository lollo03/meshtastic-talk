<!--
  ATTRIBUZIONE / LICENZA
  Distribuito sotto GNU GPL-3.0-only (vedi LICENSE nella root del progetto).

  Le immagini dei dispositivi in public/img/devices/ provengono da
  https://flasher.meshtastic.org/img/devices/ (progetto Meshtastic, GPL-3.0)
  e sono usate a scopo dimostrativo.

  Copyright: © Meshtastic LLC — Meshtastic® è un marchio registrato di Meshtastic LLC.
-->

<script setup>
const base = import.meta.env.BASE_URL

const devices = [
  { file: 'rak_wismesh_tag', name: 'WisMesh Tag', role: 'Client' },
  { file: 'tracker-t1000-e', name: 'Card Tracker T1000-E', role: 'Client' },
  { file: 'thinknode_m1', name: 'ThinkNode M1', role: 'Client' },
  { file: 't-deck', name: 'T-Deck', role: 'Client' },
  { file: 'station-g2', name: 'Station G2', role: 'Router' },
  { file: 'rak4631', name: 'RAK4631', role: 'Client' },
  { file: 'heltec_mesh_pocket', name: 'Mesh Pocket', role: 'Client' },
  { file: 'muzi_r1_neo', name: 'R1 Neo', role: 'Client' },
]
</script>

<template>
  <div class="mesh-hero">

    <!-- scrolling device gallery -->
    <div class="marquee">
      <div class="marquee-track">
        <template v-for="n in 2" :key="n">
          <div v-for="d in devices" :key="`${n}-${d.file}`" class="dev-card">
            <img :src="`${base}img/devices/${d.file}.svg`" :alt="d.name" class="dev-img" />
            <span class="dev-name">{{ d.name }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mesh-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.1rem;
  margin-top: 0.5rem;
}

/* ---------- central hub ---------- */
.hub {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rings {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.ring {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 2px solid rgba(103, 234, 148, 0.55);
  animation: pulse 3.2s ease-out infinite;
}
.ring.r2 { animation-delay: 1.05s; }
.ring.r3 { animation-delay: 2.1s; }

@keyframes pulse {
  0%   { transform: scale(0.35); opacity: 0.9; }
  70%  { opacity: 0.25; }
  100% { transform: scale(1.45); opacity: 0; }
}

.hub-card {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1rem 2.2rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(103, 234, 148, 0.35);
  box-shadow: 0 0 40px rgba(103, 234, 148, 0.15);
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-6px); }
}

.hub-icons {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  color: #67ea94;
}

.hub-icons .ic {
  width: 30px;
  height: 30px;
}

.link-line {
  width: 34px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(103, 234, 148, 0.2), #67ea94, rgba(103, 234, 148, 0.2));
  background-size: 200% 100%;
  animation: flow 1.8s linear infinite;
}

@keyframes flow {
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.hub-title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #67ea94;
}

.hub-sub {
  font-size: 0.8rem;
  opacity: 0.75;
}

/* ---------- caption ---------- */
.mesh-caption {
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

/* ---------- marquee ---------- */
.marquee {
  width: 100%;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  padding: 0.4rem 0;
  animation: scroll 26s linear infinite;
}

.marquee:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.dev-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  width: 132px;
  padding: 0.6rem 0.5rem 0.5rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex: none;
  margin-right: 1rem;
}

.dev-img {
  height: 76px;
  width: auto;
  max-width: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
}

.dev-role {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.9;
}

.dev-role .dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.dev-role.client { color: #67ea94; }
.dev-role.client .dot { background: #67ea94; box-shadow: 0 0 8px #67ea94; }

.dev-role.router { color: #f0b429; }
.dev-role.router .dot { background: #f0b429; box-shadow: 0 0 8px #f0b429; }

.dev-name {
  font-size: 0.68rem;
  opacity: 0.5;
  text-align: center;
  line-height: 1.15;
}
</style>
