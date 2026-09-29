<!--
  ATTRIBUZIONE / LICENZA
  Questo componente è un adattamento in Vue di "MeshTopology" del sito e della
  documentazione ufficiali di Meshtastic, distribuiti sotto GNU GPL-3.0-only.

  Originale: https://github.com/meshtastic/meshtastic/blob/master/src/components/MeshTopology.tsx
  Pagina:    https://meshtastic.org/docs/introduction/
  Copyright: © Meshtastic LLC — Meshtastic® è un marchio registrato di Meshtastic LLC.
  Licenza:   GPL-3.0-only (https://github.com/meshtastic/meshtastic/blob/master/LICENSE)

  Le immagini dei dispositivi sono servite da https://flasher.meshtastic.org/img/devices/
  (progetto Meshtastic, GPL-3.0). Gli asset sono usati qui a scopo dimostrativo.
-->

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"

const base = import.meta.env.BASE_URL

// Node positions in percentage (x, y), shifted right to make room for the phone.
const NODES = [
  { id: 0, x: 55, y: 5, device: "rak_wismesh_tag.svg", label: "Client" },
  { id: 1, x: 25, y: 25, device: "tracker-t1000-e.svg", label: "Client" },
  { id: 2, x: 85, y: 25, device: "thinknode_m1.svg", label: "Client" },
  { id: 3, x: 18, y: 60, device: "t-deck.svg", label: "Client" },
  { id: 4, x: 55, y: 50, device: "station-g2.svg", label: "Router" },
  { id: 5, x: 92, y: 60, device: "rak4631.svg", label: "Client" },
  { id: 6, x: 35, y: 85, device: "heltec_mesh_pocket.svg", label: "Client" },
  { id: 7, x: 75, y: 85, device: "muzi_r1_neo.svg", label: "Client" },
]

// Mesh connections (from, to) - sparser for visible multi-hop flooding.
const CONNECTIONS = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 4],
  [2, 5],
  [3, 6],
  [4, 6],
  [4, 7],
  [5, 7],
  [6, 7],
  [1, 6],
  [2, 7],
]

// Build adjacency map for neighbor lookups.
const ADJACENCY = new Map()
CONNECTIONS.forEach(([from, to]) => {
  if (!ADJACENCY.has(from)) ADJACENCY.set(from, [])
  if (!ADJACENCY.has(to)) ADJACENCY.set(to, [])
  ADJACENCY.get(from).push(to)
  ADJACENCY.get(to).push(from)
})

// Get connection index for a pair of nodes.
const getConnectionIndex = (a, b) =>
  CONNECTIONS.findIndex(
    ([from, to]) => (from === a && to === b) || (from === b && to === a),
  )

// Canned messages sent by "mesh" nodes (mirrors Meshtastic's conversations.json).
const CANNED_MESSAGES = [
  "Position update",
  "All clear",
  "Standing by",
  "Periodic beacon",
  "Node online",
  "Good day",
  "Channel clear",
  "Health check OK",
  "Battery at 85%",
  "Signal strong",
  "Mesh route updated",
  "3 hops to destination",
  "Back on freq",
  "Checking in",
  "Routine status update",
  "Node rebooted",
  "Link quality good",
  "Temperature nominal",
  "Wind speed low",
  "Still here",
]

// Node id -> side connection badge type.
const connectionMap = { 3: "wifi", 5: "usb", 6: "bt" }

// --- reactive state ---
const activeConnections = ref(new Map())
const activeNodes = ref([])
const activatedConnections = ref(new Set())
const inputValue = ref("")
const messages = ref([])
const terminalMessages = ref([])
const btActive = ref(false)
const btIncoming = ref(false)
const usbIncoming = ref(false)

const currentTime = ref(formatTime())

// --- non-reactive refs ---
let cannedIndex = 0
let pendingIncomingMsg = null
let pendingUsbMsg = null
let timeoutIds = []
let intervalId = null
let clockId = null

const reversedMessages = computed(() => [...messages.value].reverse())

const connectionList = computed(() =>
  CONNECTIONS.map(([from, to], idx) => {
    const fromNode = NODES[from]
    const toNode = NODES[to]
    const senderId = activeConnections.value.get(idx)
    const isActive = senderId !== undefined
    const hasBeenActivated = activatedConnections.value.has(idx)
    const actualSender = senderId === from ? fromNode : toNode
    const actualReceiver = senderId === from ? toNode : fromNode
    return {
      idx,
      fromNode,
      toNode,
      isActive,
      hasBeenActivated,
      actualSender,
      actualReceiver,
    }
  }).filter((c) => c.hasBeenActivated),
)

function formatTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

function nodeStyle(node) {
  return { left: `${node.x}%`, top: `${node.y}%` }
}

function pingStyle(from, to) {
  return { offsetPath: `path('M ${from.x} ${from.y} L ${to.x} ${to.y}')` }
}

function deviceSrc(device) {
  return `${base}img/devices/${device}`
}

function startMessage(fromNodeId, messageText) {
  timeoutIds.forEach((id) => clearTimeout(id))
  timeoutIds = []

  let senderId
  const isFromPhone = fromNodeId === 6

  if (fromNodeId !== undefined) {
    senderId = fromNodeId
    pendingUsbMsg = { text: messageText || "Hello mesh!", nodeId: senderId }
  } else {
    const clientNodes = NODES.filter(
      (n) => n.label === "Client" && n.id !== 6,
    ).map((n) => n.id)
    senderId = clientNodes[Math.floor(Math.random() * clientNodes.length)]

    const incomingMsg = CANNED_MESSAGES[cannedIndex % CANNED_MESSAGES.length]
    cannedIndex++
    pendingIncomingMsg = { text: incomingMsg, nodeId: senderId }
    pendingUsbMsg = { text: incomingMsg, nodeId: senderId }
  }

  const triggerBtIncoming = (delay) => {
    if (isFromPhone || !pendingIncomingMsg) return
    const msg = pendingIncomingMsg
    pendingIncomingMsg = null

    const btDelay = setTimeout(() => {
      btIncoming.value = true
      const msgDelay = setTimeout(() => {
        messages.value = [
          ...messages.value.slice(-4),
          { text: msg.text, from: "mesh", nodeId: msg.nodeId },
        ]
        btIncoming.value = false
      }, 800)
      timeoutIds.push(msgDelay)
    }, delay)
    timeoutIds.push(btDelay)
  }

  const triggerUsbIncoming = (delay) => {
    if (!pendingUsbMsg) return
    const msg = pendingUsbMsg
    pendingUsbMsg = null

    const usbDelay = setTimeout(() => {
      usbIncoming.value = true
      const hideDelay = setTimeout(() => {
        terminalMessages.value = [
          ...terminalMessages.value.slice(-5),
          { text: msg.text, from: "mesh", nodeId: msg.nodeId },
        ]
        usbIncoming.value = false
      }, 800)
      timeoutIds.push(hideDelay)
    }, delay)
    timeoutIds.push(usbDelay)
  }

  const heardMessage = new Set([senderId])
  activeNodes.value = [senderId]

  let wave1Receivers = []
  const tid1 = setTimeout(() => {
    const senderNeighbors = ADJACENCY.get(senderId) || []
    const wave1Connections = new Map()

    senderNeighbors.forEach((neighbor) => {
      const connIdx = getConnectionIndex(senderId, neighbor)
      if (connIdx !== -1) {
        wave1Connections.set(connIdx, senderId)
        wave1Receivers.push(neighbor)
        heardMessage.add(neighbor)
      }
    })

    activeConnections.value = wave1Connections
    activeNodes.value = [senderId, ...wave1Receivers]
    activatedConnections.value = new Set([
      ...activatedConnections.value,
      ...wave1Connections.keys(),
    ])

    if (wave1Receivers.includes(6)) triggerBtIncoming(1000)
    if (wave1Receivers.includes(5)) triggerUsbIncoming(1000)
  }, 500)
  timeoutIds.push(tid1)

  let wave2Receivers = []
  let wave2Senders = []
  const tid2 = setTimeout(() => {
    const wave2Connections = new Map()

    wave1Receivers.forEach((relayNode) => {
      const neighbors = ADJACENCY.get(relayNode) || []
      neighbors.forEach((neighbor) => {
        if (!heardMessage.has(neighbor)) {
          const connIdx = getConnectionIndex(relayNode, neighbor)
          if (connIdx !== -1 && !wave2Connections.has(connIdx)) {
            wave2Connections.set(connIdx, relayNode)
            wave2Receivers.push(neighbor)
            heardMessage.add(neighbor)
            if (!wave2Senders.includes(relayNode)) wave2Senders.push(relayNode)
          }
        }
      })
    })

    if (wave2Connections.size > 0) {
      activeConnections.value = wave2Connections
      activeNodes.value = [...wave2Senders, ...wave2Receivers]
      activatedConnections.value = new Set([
        ...activatedConnections.value,
        ...wave2Connections.keys(),
      ])

      if (wave2Receivers.includes(6)) triggerBtIncoming(1000)
      if (wave2Receivers.includes(5)) triggerUsbIncoming(1000)
    } else {
      activeConnections.value = new Map()
      activeNodes.value = []
    }
  }, 2000)
  timeoutIds.push(tid2)

  let wave3Receivers = []
  let wave3Senders = []
  const tid3 = setTimeout(() => {
    const wave3Connections = new Map()

    wave2Receivers.forEach((relayNode) => {
      const neighbors = ADJACENCY.get(relayNode) || []
      neighbors.forEach((neighbor) => {
        if (!heardMessage.has(neighbor)) {
          const connIdx = getConnectionIndex(relayNode, neighbor)
          if (connIdx !== -1 && !wave3Connections.has(connIdx)) {
            wave3Connections.set(connIdx, relayNode)
            wave3Receivers.push(neighbor)
            heardMessage.add(neighbor)
            if (!wave3Senders.includes(relayNode)) wave3Senders.push(relayNode)
          }
        }
      })
    })

    if (wave3Connections.size > 0) {
      activeConnections.value = wave3Connections
      activeNodes.value = [...wave3Senders, ...wave3Receivers]
      activatedConnections.value = new Set([
        ...activatedConnections.value,
        ...wave3Connections.keys(),
      ])

      if (wave3Receivers.includes(6)) triggerBtIncoming(1000)
      if (wave3Receivers.includes(5)) triggerUsbIncoming(1000)
    } else {
      activeConnections.value = new Map()
      activeNodes.value = []
    }
  }, 3500)
  timeoutIds.push(tid3)

  const tid4 = setTimeout(() => {
    activeConnections.value = new Map()
    activeNodes.value = []
  }, 5000)
  timeoutIds.push(tid4)
}

function handleSendMessage() {
  if (!inputValue.value.trim()) return

  const msgToSend = inputValue.value
  messages.value = [...messages.value.slice(-4), { text: msgToSend, from: "me" }]
  inputValue.value = ""

  btActive.value = true
  const btTimeoutId = setTimeout(() => (btActive.value = false), 1500)
  timeoutIds.push(btTimeoutId)

  if (intervalId) clearInterval(intervalId)
  startMessage(6, msgToSend)
  intervalId = setInterval(() => startMessage(), 8000)
}

function handleKeyDown(e) {
  if (e.key === "Enter") handleSendMessage()
}

onMounted(() => {
  clockId = setInterval(() => {
    currentTime.value = formatTime()
  }, 1000)

  const initialDelay = setTimeout(() => startMessage(), 1000)
  intervalId = setInterval(() => startMessage(), 8000)

  // Keep a reference so the initial delay can be cleaned up too.
  timeoutIds.push(initialDelay)
})

onBeforeUnmount(() => {
  if (clockId) clearInterval(clockId)
  if (intervalId) clearInterval(intervalId)
  timeoutIds.forEach((id) => clearTimeout(id))
})
</script>

<template>
  <div class="topo">
    <div class="row">
      <!-- Mini phone mockup -->
      <div class="phone">
        <div class="phone-frame">
          <div class="phone-inner">
            <div class="phone-screen">
              <div class="status-bar">
                <span class="status-time">{{ currentTime }}</span>
                <div class="status-icons">
                  <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 20h.01" /><path d="M7 20v-4" /><path d="M12 20v-8" /><path d="M17 20V8" /><path d="M22 4v16" /></svg>
                  <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></svg>
                  <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 10v4" /><path d="M14 10v4" /><path d="M22 14v-4" /><path d="M6 10v4" /><rect x="2" y="6" width="16" height="12" rx="2" /></svg>
                </div>
              </div>

              <div class="header">
                <div class="header-row">
                  <div>
                    <p class="header-title">MESHTASTIC</p>
                    <p class="header-sub">Primary Channel</p>
                  </div>
                  <div class="header-icon">
                    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" /></svg>
                  </div>
                </div>
              </div>

              <div class="msg-list">
                <template v-if="messages.length === 0">
                  <p class="msg-empty">Send a message to the mesh</p>
                </template>
                <template v-else>
                  <div v-for="(msg, i) in reversedMessages" :key="i" class="msg" :class="msg.from === 'me' ? 'me' : 'mesh'">
                    <p v-if="msg.from === 'mesh'" class="msg-node">Node {{ msg.nodeId }}</p>
                    <p class="msg-text">{{ msg.text }}</p>
                  </div>
                </template>
              </div>

              <div class="input-wrap">
                <div class="input-pill">
                  <input
                    v-model="inputValue"
                    type="text"
                    placeholder="Type..."
                    aria-label="Message to send"
                    class="input"
                    @keydown="handleKeyDown"
                  />
                  <button
                    type="button"
                    aria-label="Send message"
                    class="send-btn"
                    :class="{ active: inputValue.trim() }"
                    @click="handleSendMessage"
                  >
                    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mesh topology canvas -->
      <div class="canvas">
        <svg
          class="conn-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          role="img"
          aria-label="Mesh network connections"
        >
          <title>Mesh network topology connections</title>
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g v-for="c in connectionList" :key="c.idx">
            <line
              :x1="c.fromNode.x"
              :y1="c.fromNode.y"
              :x2="c.toNode.x"
              :y2="c.toNode.y"
              class="conn-base"
              stroke-width="0.15"
            />
            <template v-if="c.isActive">
              <line
                :x1="c.fromNode.x"
                :y1="c.fromNode.y"
                :x2="c.toNode.x"
                :y2="c.toNode.y"
                class="conn-active"
                stroke-width="0.3"
                filter="url(#glow)"
              />
              <circle r="1.2" class="ping-dot" filter="url(#glow)" :style="pingStyle(c.actualSender, c.actualReceiver)" />
              <circle :cx="c.actualSender.x" :cy="c.actualSender.y" r="1" class="ping-ring" />
              <circle :cx="c.actualReceiver.x" :cy="c.actualReceiver.y" r="1" class="ping-ring-delayed" />
            </template>
          </g>

          <!-- Bluetooth outgoing (phone -> node 6) -->
          <g v-if="btActive">
            <defs>
              <filter id="bt-line-glow">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line x1="0" y1="90" :x2="NODES[6].x - 5" :y2="NODES[6].y" class="bt-line" stroke="#0082FC" stroke-width="0.5" stroke-dasharray="2 1" filter="url(#bt-line-glow)" />
            <circle r="1.5" class="bt-dot" fill="#0082FC" filter="url(#bt-line-glow)" :style="{ offsetPath: `path('M 0 90 L ${NODES[6].x - 5} ${NODES[6].y}')` }" />
          </g>

          <!-- Bluetooth incoming (node 6 -> phone) -->
          <g v-if="btIncoming">
            <defs>
              <filter id="bt-line-glow-in">
                <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line :x1="NODES[6].x - 5" :y1="NODES[6].y" x2="0" y2="90" class="bt-line" stroke="#0082FC" stroke-width="0.5" stroke-dasharray="2 1" filter="url(#bt-line-glow-in)" />
            <circle r="1.5" class="bt-dot" fill="#0082FC" filter="url(#bt-line-glow-in)" :style="{ offsetPath: `path('M ${NODES[6].x - 5} ${NODES[6].y} L 0 90')` }" />
          </g>

          <!-- USB incoming (computer -> node 5) -->
          <g v-if="usbIncoming">
            <defs>
              <filter id="usb-line-glow-in" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line x1="100" y1="65" :x2="NODES[5].x + 3" :y2="NODES[5].y" class="usb-line" stroke="#888888" stroke-width="0.5" stroke-dasharray="2 1" filter="url(#usb-line-glow-in)" />
            <circle r="1.5" class="usb-dot" fill="#888888" filter="url(#usb-line-glow-in)" :style="{ offsetPath: `path('M ${NODES[5].x + 3} ${NODES[5].y} L 100 65')` }" />
          </g>
        </svg>

        <div class="canvas-body">
          <div
            v-for="node in NODES"
            :key="node.id"
            class="node"
            :style="nodeStyle(node)"
          >
            <div class="node-inner">
              <div class="node-glow" :class="{ active: activeNodes.includes(node.id) }" />
              <img :src="deviceSrc(node.device)" :alt="node.label" class="dev-img" />
              <div v-if="connectionMap[node.id]" class="badge" :class="node.x < 50 ? 'badge-left' : 'badge-right'">
                <svg v-if="connectionMap[node.id] === 'bt'" class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #0082FC" aria-label="Bluetooth connection" role="img"><path d="m7 7 10 10-5 5V2l5 5L7 17" /></svg>
                <svg v-else-if="connectionMap[node.id] === 'wifi'" class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #67ea94" aria-label="WiFi connection" role="img"><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></svg>
                <svg v-else class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: rgba(255,255,255,0.6)" aria-label="USB connection" role="img"><circle cx="10" cy="7" r="1" /><circle cx="4" cy="20" r="1" /><path d="M4.7 19.3 19 5" /><path d="m21 3-3 1 2 2Z" /><path d="M9.26 7.68 5 12l2 5" /><path d="m10 14 5 2 3.5-3.5" /><path d="m18 12 1-1 1 1-1 1Z" /></svg>
              </div>
            </div>
            <span class="node-label">{{ node.label }}</span>
          </div>
        </div>
      </div>

      <!-- Mini terminal mockup -->
      <div class="terminal">
        <div class="term-frame">
          <div class="term-screen">
            <div class="term-inner">
              <div class="term-header">
                <div class="term-dots">
                  <div class="term-dot red" />
                  <div class="term-dot yellow" />
                  <div class="term-dot green" />
                </div>
                <span class="term-title">meshtastic-cli</span>
              </div>
              <div class="term-body">
                <template v-if="terminalMessages.length === 0">
                  <p class="term-cmd">$ meshtastic --listen</p>
                  <p class="term-wait">Listening for messages...</p>
                </template>
                <template v-else>
                  <p v-for="(msg, i) in terminalMessages.slice(-6)" :key="`cli-${i}`" class="term-msg">[Node {{ msg.nodeId }}]: {{ msg.text }}</p>
                </template>
              </div>
            </div>
          </div>
          <div class="term-base" />
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend">
      <div class="legend-item">
        <div class="legend-lora" />
        <span>LoRa</span>
      </div>
      <div class="legend-item">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #0082FC" aria-hidden="true"><path d="m7 7 10 10-5 5V2l5 5L7 17" /></svg>
        <span>Bluetooth</span>
      </div>
      <div class="legend-item">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #67ea94" aria-hidden="true"><path d="M12 20h.01" /><path d="M2 8.82a15 15 0 0 1 20 0" /><path d="M5 12.859a10 10 0 0 1 14 0" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /></svg>
        <span>WiFi</span>
      </div>
      <div class="legend-item">
        <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: rgba(255,255,255,0.6)" aria-hidden="true"><circle cx="10" cy="7" r="1" /><circle cx="4" cy="20" r="1" /><path d="M4.7 19.3 19 5" /><path d="m21 3-3 1 2 2Z" /><path d="M9.26 7.68 5 12l2 5" /><path d="m10 14 5 2 3.5-3.5" /><path d="m18 12 1-1 1 1-1 1Z" /></svg>
        <span>USB</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.topo {
  position: relative;
  width: 100%;
  max-width: 896px;
  margin: 0 auto;
}

/* ---------- layout row ---------- */
.row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  position: relative;
  overflow: visible;
  container-type: inline-size;
  container-name: mtopo-row;
}

/* ---------- phone ---------- */
.phone {
  flex-shrink: 0;
  width: 176px;
}
.phone-frame {
  border-radius: 24px;
  background: linear-gradient(to bottom, #1f2937, #111827);
  padding: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(75, 85, 99, 0.5);
}
.phone-inner {
  border-radius: 20px;
  background: #111827;
  padding: 6px;
}
.phone-screen {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #030712;
}
.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(17, 24, 39, 0.8);
  padding: 2px 8px;
  font-size: 9px;
  color: #67ea94;
}
.status-time {
  font-family: monospace;
}
.status-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}
.status-icons .ic {
  width: 10px;
  height: 10px;
}
.header {
  border-bottom: 1px solid rgba(103, 234, 148, 0.2);
  background: rgba(17, 24, 39, 0.5);
  padding: 2px 8px;
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-title {
  font-family: monospace;
  font-size: 9px;
  font-weight: bold;
  color: #67ea94;
  line-height: 1;
}
.header-sub {
  font-family: monospace;
  font-size: 6px;
  color: rgba(103, 234, 148, 0.7);
  line-height: 1;
  margin-top: 2px;
}
.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background: rgba(103, 234, 148, 0.2);
  color: #67ea94;
}
.header-icon .ic {
  width: 8px;
  height: 8px;
}

/* messages */
.msg-list {
  height: 96px;
  display: flex;
  flex-direction: column-reverse;
  gap: 2px;
  overflow-y: auto;
  padding: 6px;
  background: transparent;
}
.msg-empty {
  text-align: center;
  font-family: monospace;
  font-size: 8px;
  color: rgba(255, 255, 255, 0.4);
}
.msg {
  border-radius: 4px;
  border: 1px solid;
  padding: 0 3px 1px;
  font-family: monospace;
}
.msg.me {
  margin-left: 12px;
  border-color: rgba(103, 234, 148, 0.3);
  background: rgba(103, 234, 148, 0.2);
}
.msg.mesh {
  margin-right: 12px;
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(59, 130, 246, 0.2);
}
.msg-node {
  font-family: monospace;
  font-size: 5px;
  color: #60a5fa;
  line-height: 1;
}
.msg-text {
  font-family: monospace;
  font-size: 7px;
  line-height: 1;
}
.msg.me .msg-text {
  color: #e5e7eb;
}
.msg.mesh .msg-text {
  color: #d1d5db;
}

/* input */
.input-wrap {
  background: rgba(17, 24, 39, 0.5);
  padding: 8px;
}
.input-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  background: #1f2937;
  padding: 6px 8px;
}
.input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  font-family: monospace;
  font-size: 10px;
  color: #e5e7eb;
  outline: none;
}
.input::placeholder {
  color: #6b7280;
}
.send-btn {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 0;
  background: rgba(103, 234, 148, 0.3);
  color: rgba(103, 234, 148, 0.6);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.send-btn.active {
  background: #67ea94;
  color: #111827;
}
.send-btn .ic {
  width: 10px;
  height: 10px;
}

/* ---------- terminal ---------- */
.terminal {
  flex-shrink: 0;
  width: 192px;
}
.term-frame {
  border-radius: 8px;
  background: linear-gradient(to bottom, #374151, #1f2937);
  padding: 6px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(75, 85, 99, 0.5);
}
.term-screen {
  border-radius: 4px;
  background: #111827;
  padding: 4px;
}
.term-inner {
  border-radius: 2px;
  background: #030712;
  overflow: hidden;
}
.term-header {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #1f2937;
  padding: 2px 8px;
}
.term-dots {
  display: flex;
  gap: 4px;
}
.term-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
}
.term-dot.red {
  background: rgba(239, 68, 68, 0.8);
}
.term-dot.yellow {
  background: rgba(234, 179, 8, 0.8);
}
.term-dot.green {
  background: rgba(34, 197, 94, 0.8);
}
.term-title {
  flex: 1;
  text-align: center;
  font-family: monospace;
  font-size: 6px;
  color: #9ca3af;
}
.term-body {
  padding: 6px;
  height: 80px;
  overflow: hidden;
  font-family: monospace;
  font-size: 6px;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.term-cmd {
  color: #4ade80;
}
.term-wait {
  color: #6b7280;
}
.term-msg {
  color: #22d3ee;
}
.term-base {
  margin-top: 4px;
  height: 8px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #4b5563, #374151);
}

/* ---------- canvas ---------- */
.canvas {
  position: relative;
  flex: 1;
  overflow: visible;
  container-type: inline-size;
  container-name: mtopo;
}
.conn-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.canvas-body {
  position: relative;
  padding-top: 75%;
}
.node {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
}
.node-inner {
  position: relative;
}
.node-glow {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  transition: all 0.7s;
  background: transparent;
  transform: scale(1);
}
.node-glow.active {
  background: rgba(103, 234, 148, 0.15);
  transform: scale(1.25);
}
.dev-img {
  display: block;
  margin: 0;
  object-fit: contain;
  position: relative;
  z-index: 10;
  width: 48px;
  height: 56px;
  width: clamp(29px, 9.68cqw, 48px);
  height: clamp(34px, 11.29cqw, 56px);
}
.node-label {
  font-family: monospace;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 4px;
  font-size: 10px;
  font-size: clamp(8px, 2.02cqw, 10px);
  line-height: 1.2;
}
.badge {
  position: absolute;
  top: 0;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  width: clamp(17px, 4.84cqw, 24px);
  height: clamp(17px, 4.84cqw, 24px);
  border-radius: 9999px;
  background: #191919;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.15);
  z-index: 20;
}
.badge-left {
  left: 0;
  transform: translate(-35%, -35%);
}
.badge-right {
  right: 0;
  transform: translate(35%, -35%);
}
.badge-icon {
  width: 62%;
  height: 62%;
}

/* ---------- connection lines ---------- */
.conn-base {
  stroke: rgba(103, 234, 148, 0.2);
}
.conn-active {
  stroke: #67ea94;
  opacity: 0.6;
}
.ping-dot {
  fill: #67ea94;
  animation: ping-travel 1.5s ease-out forwards;
}
.ping-ring,
.ping-ring-delayed {
  fill: none;
  stroke: #67ea94;
  stroke-width: 0.3;
}
.ping-ring {
  animation: ping-glow 1.5s ease-out forwards;
}
.ping-ring-delayed {
  animation: ping-glow 1.5s ease-out 0.8s forwards;
}
.bt-line,
.usb-line {
  animation: bt-pulse 0.5s ease-out forwards;
}
.bt-dot,
.usb-dot {
  animation: ping-travel 0.8s ease-out forwards;
}

/* ---------- legend ---------- */
.legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px 24px;
  margin-top: 16px;
  font-size: 12px;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.55);
}
.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.legend-lora {
  width: 24px;
  height: 2px;
  background: #67ea94;
  border-radius: 9999px;
}
.legend .ic {
  width: 16px;
  height: 16px;
}

/* ---------- responsive shrink ---------- */
@container mtopo-row (max-width: 820px) {
  .phone {
    zoom: 0.88;
  }
  .terminal {
    zoom: 0.88;
  }
}
@container mtopo-row (max-width: 720px) {
  .phone {
    zoom: 0.78;
  }
  .terminal {
    zoom: 0.78;
  }
}

/* ---------- keyframes ---------- */
@keyframes ping-travel {
  0% {
    offset-distance: 0%;
    opacity: 1;
  }
  100% {
    offset-distance: 100%;
    opacity: 0.3;
  }
}
@keyframes ping-glow {
  0% {
    r: 1;
    opacity: 0.8;
  }
  50% {
    r: 3;
    opacity: 0.4;
  }
  100% {
    r: 5;
    opacity: 0;
  }
}
@keyframes bt-pulse {
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}
</style>
