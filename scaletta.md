## 1. Hook — perché dovrebbe interessarmi

- *"una rete mesh off-grid, crittografata, open source,
  che gira su radio LoRa da 30€ e si controlla dal telefono."*
- Il problema che risolve: comunicare quando non c'è rete cellulare (montagna, eventi,
  emergenze, blackout).
- L'aggancio emotivo dall'abstract: *"riprendersi la proprietà dei propri messaggi."*
- Promessa della demo: *"tra 20 minuti vedrete due nodi parlarsi davvero."*
## 2. Le basi — LoRa → Meshtastic → app

### cos'è LoRa (il livello fisico)
- Analogia chiave: *"una WiFi a 900 MHz, ma con portata di chilometri e banda di pochi kbps."*
  È la scheda di rete, il livello fisico.
- Numeri da dire: 868 MHz in EU, portata 1–10+ km (linea di vista), data rate ~0.3–21 kbps,
  bassissimo consumo.
- **LoRa != LoRaWAN**
  - LoRaWAN = rete a stella con gateway + network server (The Things Network).
  - Meshtastic = peer-to-peer, **senza infrastruttura centrale**.

### cos'è Meshtastic (la rete + l'app)
- Firmware open source embedded + app (Android/iOS/Web) + client CLI.
- Traduzione per il pubblico: *"LoRa è la NIC, Meshtastic è il routing + l'app."*


## 3. Perché Meshtastic e non altro

- **APRS** (radioamatori): serve patente e nominativo, non criptato.
- **LoRaWAN / TTN**: serve il gateway, non è off-grid vero.
- **goTenna**: proprietario.
- **MeshCore**: l'alternativa open più diretta, nata dal fork/split della community. Logica routing diversa
- **Reticulum / RNode**: alternativa open molto più potente ma molto meno plug-and-play.
  Battuta: *"Meshtastic = la via facile, MeshCore = la via intermedia, Reticulum = la via hardcore."*
- Sintesi: Meshtastic vince su **facilità d'uso + off-grid reale + open source + costo**.



## 4. Come funziona Meshtastic

### Hardware (cosa compro)
- ESP32 vs nRF52 (consumo/potenza), chip radio SX1262/SX1276.
- Moduli tipici: Heltec V3, LilyGO T-Beam/T-Deck, RAK WisBlock. Fascia 20–40€.
- Messaggio: *"con 30€ e un telefono sei dentro."*

### Stack (i livelli)
- Livello fisico: LoRa.
- Firmware: Meshtastic (embedded, open source).
- App: Android/iOS/Web/CLI.
- Analogia: *"LoRa è la NIC, Meshtastic è il routing + l'app."*

### Nodo headless: meshtasticd su Linux
- Il daemon `meshtasticd` fa girare un nodo su un computer/Raspberry Pi collegato a una
  radio LoRa via USB/serial, **senza bisogno del telefono**.
- Ci si collega via TCP/IP: app, client web, oppure la CLI Python `meshtastic`
  (inviare messaggi, leggere telemetria, cambiare config da script).
- Perfetto per: nodi gateway/tetto, nodi "sempre accesi", automazione e scripting.
- Messaggio per i nerd: *"il vostro Raspberry Pi può diventare un nodo della mesh."*
- Bonus da citare: il **client web** (browser → nodo) e l'**API/CLI** per integrazioni.

### Routing
- Store-and-forward, flooding "intelligente", hop limit (default 3), nessun server centrale.
- Nota: posizioni e telemetria girano in rete (aggancio privacy, vedi §7).

### Posizionamento e telemetria
- GPS opzionale, telemetria (batteria, voltaggio, temperatura).
- La posizione **si può disattivare** (aggancio privacy/legalità).

### Configurazioni: canali e modem preset
- Canale circa *"SSID + password"*, ma la password È la chiave AES-256 (PSK).
- Il canale default `LongFast` ha chiave **pubblica e nota a tutti** → non è vera riservatezza.
- Modem preset (MediumFast ecc.) = trade-off velocità/portata; regione EU_868.

---

## 5. Legalità in Italia (la domanda che tutti fanno)

- Risposta breve: *"Sugli 868 MHz SRD da privato puoi criptare; il divieto di cifratura
  vale solo per i radioamatori sulle loro bande."*
- Schema mentale: ogni pacchetto appartiene a un regime giuridico (banda + operatore),
  non al software.
- Punti da dire:
  - Non radioamatore su 868/433 SRD → crittografia consentita.
  - Radioamatore su 430–434 (70 cm) → obbligo di trasmissione in chiaro.
  - 433 MHz = banda "a doppio regime" (SRD vs 70 cm radioamatoriale).
- Avvertenze oneste: CE/conformità, duty cycle 10%, potenza ERP.
- Link al documento completo: `legalità.md`.

---

## 6. Stato in Italia + community + SOS Italia

### Stato della rete
- Numeri e mappe: nodi attivi, regioni più coperte, mappa ufficiale + mappe antenne.
- Un'immagine della mappa vale più di mille parole.

### Community
- Globale: meshtastic.org, forum, Discord.
- Italia: LoRa Italia, gruppi Telegram/WhatsApp regionali, mappe collaborative.
- Onestà tecnica: parte della "rete" è collegata a internet via MQTT
  (root `mqtt.meshtastic.org` come bridge globale) — spiega i nodi "a chilometri"
  che in realtà passano dal web.

### Caso SOS Italia
- Case study concreto (ricerca in `sos-italia.md`).
- Rete civica decentralizzata, evoluzione di SOS Abruzzo, partnership Telespazio/ACI.
- Costruita **sopra** Meshtastic + LoRa + MQTT, senza sviluppare un protocollo proprio.
- Messaggio: *"non è solo un giocattolo da smanettoni."*

---

## 7. Limitazioni e privacy

- **Cosa NON è**: non sostituisce il telefono, banda ridottissima (pochi kbps),
  serve densità di nodi, non è real-time ad alta capacità.
- **Metadati**: la cifratura protegge il contenuto, non posizione/nodi/orari/relazioni. **CONTROLLA**
- **Chiave default pubblica**: il canale `LongFast` è offuscazione, non riservatezza;
  per la privacy servono chiavi private e consapevolezza.
- Onestà = credibilità con questo pubblico.

---

## 8. Come iniziare

- Cosa comprare (modulo consigliato), come flashare (web flasher), primo canale.
- Dove trovare la community e le mappe.
- Call to action: *"compra un nodo, flashalo, entra nel canale, mettilo sul tetto."*

---

## 9. Demo live (+ fallback)

- **Fallback pronto**: video/screencast registrato della demo, da usare se la radio non aggancia.
- **Pre-stadia il secondo nodo**: due nodi già configurati e accoppiati, testati in sala prima.
- Demo base: invio messaggio tra due nodi.
- Demo bonus (se avanza tempo): **ping/SSH via TCP/IP over Meshtastic** — la slide "wow"
  per un pubblico Linux.

---

## 10. Q&A / risorse

- Slide finale con link: meshtastic.org, docs, forum, LoRa Italia, mappe, `legalità.md`.
- Domande attese da preparare: legalità, LoRa vs LoRaWAN, portata reale, batteria/solare,
  privacy, "posso usarlo come radioamatore?", "MeshCore o Meshtastic?", "come faccio a
  girare un nodo su un Raspberry Pi / server?".
