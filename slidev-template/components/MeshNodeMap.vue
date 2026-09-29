<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue"
// maplibre-gl v6 è ESM-only, senza export di default
import * as maplibregl from "maplibre-gl"
import "maplibre-gl/dist/maplibre-gl.css"

/**
 * Mappa dei nodi Meshtastic italiani.
 *
 * Basemap: OpenFreeMap (tile VETTORIALI derivate da OpenStreetMap, stile dark),
 * nessuna API key e nessuna restrizione di dominio -> funziona anche da hostata.
 * I dati arrivano da /data/nodes-map.json (generato da nodes.json).
 *
 * Se non c'è connessione mostriamo la versione statica (mappa-nodi-dark.png):
 * la mappa interattiva ha bisogno di scaricare style/tile da Internet, quindi
 * a rete assente si degrada in un'immagine già presente nel deck.
 */
const props = defineProps({
  // "dark" (OpenFreeMap dark) | "light" (OpenFreeMap positron)
  variant: { type: String, default: "dark" },
  // altezza del riquadro mappa
  height: { type: String, default: "440px" },
  // raggio dei pallini in px (scala della slide)
  radius: { type: Number, default: 3 },
  // pan/zoom attivi
  interactive: { type: Boolean, default: true },
  // "none" | "role" -> colora i nodi in base al ruolo
  colorBy: { type: String, default: "none" },
  // zoom forzato; se null usa fitBounds sull'Italia
  zoom: { type: Number, default: null },
  // se true usa sempre l'immagine statica (utile per export/test)
  forceFallback: { type: Boolean, default: false },
})

const base = import.meta.env.BASE_URL
const el = ref(null)

// --- stato "offline" -------------------------------------------------------
const isOffline = ref(typeof navigator !== "undefined" ? !navigator.onLine : false)
const loadFailed = ref(false)
const showFallback = computed(() => props.forceFallback || isOffline.value || loadFailed.value)

// esiste solo la versione dark delle mappe statiche
const FALLBACK_IMG = "img/mappa-nodi-dark.png"
const fallbackSrc = computed(() => `${base}${FALLBACK_IMG}`)

// --- costanti mappa --------------------------------------------------------
const STYLES = {
  dark: "https://tiles.openfreemap.org/styles/dark",
  light: "https://tiles.openfreemap.org/styles/positron",
}

const COLORS = {
  dark: { fill: "#67ea94", stroke: "rgba(4,48,28,.85)" },
  light: { fill: "#f97316", stroke: "rgba(120,53,15,.8)" },
}

// palette per ruolo (usata solo se colorBy === "role")
const ROLE_COLORS = {
  ROUTER: "#ff5d8f",
  ROUTER_LATE: "#ffb703",
  CLIENT_BASE: "#4cc9f0",
  TRACKER: "#b5179e",
  SENSOR: "#b5179e",
  CLIENT_MUTE: "#9aa0a6",
}

// MapLibre usa [lng, lat]: sud-ovest e nord-est dell'Italia
const ITALY = [
  [6.3, 36.4],
  [18.8, 47.2],
]

// tempo massimo per considerare "caricata" la mappa prima di passare al
// fallback statico (rete lenta / assente / captive portal)
const LOAD_TIMEOUT_MS = 6000

// Slidev scala l'intera slide con transform: scale(...). Una canvas WebGL viene
// quindi "stirata" e risulta sfocata, a meno di aumentare il pixelRatio della
// mappa in proporzione allo scale effettivo del contenitore.
function effectiveScale() {
  if (!el.value) return 1
  const rect = el.value.getBoundingClientRect()
  const layout = el.value.offsetWidth
  return layout ? rect.width / layout || 1 : 1
}

function syncPixelRatio() {
  if (!map) return
  const pr = Math.min((window.devicePixelRatio || 1) * effectiveScale(), 4)
  if (Math.abs(map.getPixelRatio() - pr) > 0.01) map.setPixelRatio(pr)
}

function circleColor() {
  const c = COLORS[props.variant] ?? COLORS.dark
  if (props.colorBy !== "role") return c.fill
  const expr = ["match", ["get", "role"]]
  for (const [role, color] of Object.entries(ROLE_COLORS)) expr.push(role, color)
  expr.push(c.fill)
  return expr
}

// --- ciclo di vita della mappa --------------------------------------------
let map = null
let ro = null
let rafId = null
let onResize = null
let loadTimer = null
let userInteracted = false

function clearLoadTimer() {
  if (loadTimer) {
    clearTimeout(loadTimer)
    loadTimer = null
  }
}

function destroyMap() {
  clearLoadTimer()
  if (map) {
    map.remove()
    map = null
  }
}

function initMap() {
  if (map || showFallback.value || !el.value) return

  const colors = COLORS[props.variant] ?? COLORS.dark
  userInteracted = false

  const m = new maplibregl.Map({
    container: el.value,
    style: STYLES[props.variant] ?? STYLES.dark,
    center: [12.5, 42.3],
    zoom: props.zoom ?? 5.2,
    minZoom: 3,
    maxZoom: 14,
    // 2D: niente rotazione/pitch, è una slide
    dragRotate: props.interactive,
    pitchWithRotate: false,
    touchPitch: false,
    maxPitch: 0,
    attributionControl: { compact: true },
    interactive: props.interactive,
    // serve per catturare correttamente la canvas negli export/screenshot
    preserveDrawingBuffer: true,
  })
  map = m

  let loaded = false

  // finché l'utente non trascina, ricentriamo sull'Italia: il fit iniziale
  // può avvenire quando la slide è ancora a dimensione 0 e dare uno zoom errato
  m.on("dragstart", () => {
    userInteracted = true
  })

  const fitItaly = () => {
    if (props.zoom != null || userInteracted || map !== m) return
    if (!el.value?.clientWidth || !el.value?.clientHeight) return
    m.fitBounds(ITALY, { padding: 8, duration: 0 })
  }

  m.on("load", async () => {
    if (map !== m) return
    loaded = true
    clearLoadTimer()
    fitItaly()

    let nodes = []
    try {
      const res = await fetch(`${base}data/nodes-map.json`)
      const data = await res.json()
      nodes = data.nodes ?? data
    } catch (e) {
      console.warn("[MeshNodeMap] impossibile caricare i nodi:", e)
    }
    if (map !== m) return

    const geojson = {
      type: "FeatureCollection",
      features: nodes.map(([lat, lon, role]) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [lon, lat] },
        properties: { role: role || "" },
      })),
    }

    m.addSource("nodi", { type: "geojson", data: geojson })
    m.addLayer({
      id: "nodi",
      type: "circle",
      source: "nodi",
      paint: {
        "circle-radius": props.radius,
        "circle-color": circleColor(),
        "circle-stroke-color": colors.stroke,
        "circle-stroke-width": 0.6,
        "circle-opacity": 0.92,
      },
    })
  })

  m.on("error", (e) => {
    if (map !== m) return
    const err = e?.error
    console.warn("[MeshNodeMap]", err ?? e)
    // una risorsa di OpenFreeMap non raggiungibile prima del load significa
    // che la mappa non è utilizzabile: passiamo all'immagine statica
    if (!loaded && (isOffline.value || String(err?.url ?? "").includes("openfreemap.org"))) {
      loadFailed.value = true
    }
  })

  // rete assente o troppo lenta: dopo N secondi senza "load" -> fallback
  clearLoadTimer()
  loadTimer = setTimeout(() => {
    if (map === m && !loaded) loadFailed.value = true
  }, LOAD_TIMEOUT_MS)

  // pixel ratio + resize (la slide può montarsi prima di avere le dimensioni)
  const refresh = () => {
    if (map !== m) return
    m.resize()
    syncPixelRatio()
    fitItaly()
  }
  const scheduleRefresh = () => {
    if (rafId) cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(refresh)
    })
  }

  scheduleRefresh()
  setTimeout(refresh, 300)
  setTimeout(refresh, 900)

  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(scheduleRefresh)
    ro.observe(el.value)
  }
  window.addEventListener("resize", scheduleRefresh)
  onResize = scheduleRefresh
}

// quando lo stato di fallback cambia, distruggo o ricreo la mappa
watch(showFallback, (v) => {
  if (v) {
    destroyMap()
    if (ro) {
      ro.disconnect()
      ro = null
    }
    if (onResize) {
      window.removeEventListener("resize", onResize)
      onResize = null
    }
  } else {
    nextTick(() => initMap())
  }
})

// la connettività può cambiare mentre la slide è aperta
const onOnline = () => {
  isOffline.value = false
  // se il fallback era dovuto a un errore di rete, riproviamo
  loadFailed.value = false
}
const onOffline = () => {
  isOffline.value = true
}

onMounted(() => {
  window.addEventListener("online", onOnline)
  window.addEventListener("offline", onOffline)
  if (!showFallback.value) initMap()
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  window.removeEventListener("online", onOnline)
  window.removeEventListener("offline", onOffline)
  if (ro) {
    ro.disconnect()
    ro = null
  }
  if (onResize) {
    window.removeEventListener("resize", onResize)
    onResize = null
  }
  destroyMap()
})
</script>

<template>
  <div class="mesh-node-map">
    <div
      v-show="!showFallback"
      ref="el"
      class="mesh-node-map__canvas"
      :style="{ height }"
    />
    <div
      v-if="showFallback"
      class="mesh-node-map__canvas mesh-node-map__fallback"
      :style="{ height }"
    >
      <img :src="fallbackSrc" alt="Mappa statica dei nodi Meshtastic in Italia" />
    </div>
    <div v-if="showFallback" class="mesh-node-map__offline">
      offline · mappa statica — Tiles &copy; Esri, &copy; OpenStreetMap contributors
    </div>
    <div v-if="$slots.default" class="mesh-node-map__caption">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.mesh-node-map {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mesh-node-map__canvas {
  width: 100%;
  border-radius: 14px;
  overflow: hidden;
  background: #111;
}

.mesh-node-map :deep(.maplibregl-map) {
  font-family: inherit;
  border-radius: 14px;
}

.mesh-node-map :deep(.maplibregl-canvas) {
  outline: none;
}

.mesh-node-map :deep(.maplibregl-ctrl-attrib) {
  background: rgba(0, 0, 0, 0.5);
  color: #d7d7d7;
  font-size: 9px;
}

.mesh-node-map :deep(.maplibregl-ctrl-attrib a) {
  color: #d7d7d7;
}

.mesh-node-map__fallback {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mesh-node-map__fallback img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mesh-node-map__offline {
  font-size: 0.55rem;
  line-height: 1.2;
  opacity: 0.45;
  text-align: center;
}

.mesh-node-map__caption {
  font-size: 0.7rem;
  opacity: 0.6;
  text-align: center;
}
</style>
