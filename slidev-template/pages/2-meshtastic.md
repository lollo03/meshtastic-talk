# Meshtastic

**Protocollo** di messaggistica mesh basato su LoRa. La community ha sviluppato:

<v-clicks>

- **Firmware** per dispositivi basati su **ESP32** o **nRF52** equipaggiati con ricetrasmittente LoRa (Semtech SX126x o LR11xx)
- **Software** APP android e iOS, web client
- Demone _meshtasticd_ per permettere la creazione di nodi usando radio **SPI** o **USB** su Linux e macOS
- Documentazione

</v-clicks>

<div v-click>

> Ogni dispositivo meshtastic è un _nodo_: riceve ed inoltra i messaggi a tutti (flooding). La forza di meshtastic è che aggiungendo nodi è facilissimo espandere la rete. 

<MeshtasticDevices />

</div>

---

## Le alternative

<v-click>

<div class="grid grid-cols-3 gap-6 mt-6">

<div class="alt-card">
  <img src="/img/alternatives/meshcore.svg" alt="MeshCore" class="alt-logo" />
  <div class="alt-name">MeshCore</div>
  <div class="alt-desc">Più strutturato, usa un routing deterministico dove il posizionamento geografico dei nodi è fondamentale</div>
</div>

<div class="alt-card">
  <img src="/img/alternatives/lora-aprs.svg" alt="LoRa-APRS" class="alt-logo" />
  <div class="alt-name">LoRa-APRS</div>
  <div class="alt-desc">Dedicato ai radioamatori</div>
</div>

<div class="alt-card">
  <img src="/img/alternatives/reticulum.png" alt="Reticulum / RNode" class="alt-logo" />
  <div class="alt-name">Reticulum / RNode</div>
  <div class="alt-desc">Alternativa open source estremamente potente e multi-mezzo, ma molto meno "plug-and-play"</div>
</div>

</div>

</v-click>

<div v-click class="mt-8">

Il vero successo di Meshtastic risiede nel suo equilibrio ideale: è **economico**, **facile** da usare, ma incredibilmente **potente** e **scalabile**.

</div>

<style>
.alt-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.85rem;
  padding: 1.6rem 1.1rem 1.5rem;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.alt-logo {
  width: 100%;
  height: 60px;
  object-fit: contain;
}

.alt-name {
  font-size: 1.3rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #67ea94;
  text-align: center;
}

.alt-desc {
  font-size: 0.82rem;
  line-height: 1.45;
  text-align: center;
  opacity: 0.72;
}
</style>

---

## L'hardware

Le schede meshtastic sono divise in due grandi categorie:

<v-click>

- **ESP32**-Based: più potenti, dotati di wifi ma consumano di più
- **nRF52**-Based: consumo energetico estremamente ridotto, è l'evoluzione dell'ESP32 in campo meshtastic



Esistono anche schede basate su RP2040/RP2350 e STM32.

</v-click>

<v-click>

La selezione è molto ampia, è facile vedere schede con anche:

<div class="grid grid-cols-4 gap-4 mt-6">

<div class="feat-card">
  <img src="/img/icons/gps.svg" alt="GPS" class="feat-icon" />
  <div class="feat-name">GPS</div>
  <div class="feat-desc">Posizione e tracking</div>
</div>

<div class="feat-card">
  <img src="/img/icons/thermometer.svg" alt="Barometro e termometro" class="feat-icon" />
  <div class="feat-name">Barometro e termometro</div>
  <div class="feat-desc">Altitudine e meteo</div>
</div>

<div class="feat-card">
  <img src="/img/icons/screen.svg" alt="Schermo" class="feat-icon" />
  <div class="feat-name">Schermo</div>
  <div class="feat-desc">Leggere i messaggi</div>
</div>

<div class="feat-card">
  <img src="/img/icons/keyboard.svg" alt="Tastiera" class="feat-icon" />
  <div class="feat-name">Tastiera</div>
  <div class="feat-desc">Scrivere i messaggi</div>
</div>

</div>

</v-click>

<style>
.feat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 1.2rem 0.7rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.feat-icon {
  width: 56px;
  height: 56px;
}

.feat-name {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #67ea94;
  text-align: center;
  line-height: 1.2;
}

.feat-desc {
  font-size: 0.75rem;
  line-height: 1.35;
  text-align: center;
  opacity: 0.72;
}
</style>

---

<div class="grid grid-cols-3 gap-6">
  <div class="flex flex-col items-center gap-2">
    <img src="/img/heltec.png" class="h-44 w-auto" />
    <small class="text-center">Heltec v4</small>
    <img src="/img/xiao.png" class="h-44 w-auto" />
    <small class="text-center">XIAO nRF52840 & Wio-SX1262</small>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/img/solar.png" class="h-44 w-auto" />
    <small class="text-center">SenseCAP Solar Node</small>
    <img src="/img/meshtracker.png" class="h-44 w-auto" />
    <small class="text-center">SenseCAP MeshTracker X1</small>
  </div>
  <div class="flex flex-col items-center gap-2">
    <img src="/img/wio-tracker.png" class="h-44 w-auto" />
    <small class="text-center">Wio Tracker L1 Pro</small>
    <img src="/img/t-deck.png" class="h-44 w-auto" />
    <small class="text-center">LILYGO T-Deck</small>
  </div>
</div>

---

### E se voglio fare tutto in casa?

<div class="flex items-center w-full flex-col mt-10">
    <img src="/img/faketek.png" width="320" class="flex-none self-center"/>
</div>

Puoi realizzare un nodo meshtastic unendo un microcontrollore e una radio LoRa. Oppure costruirti un [fakeTek](https://github.com/gargomoma/fakeTec_pcb).

---

### Ok, ma in pratica?

<div v-click>

Ogni radio è un **nodo** che riceve e **inoltra** i messaggi: insieme formano una **mesh**. Due mesh lontane tra loro possono collegarsi tramite un broker **MQTT** su **internet**.


<MeshRelay />

</div>

---

### Il routing

Per i messaggi broadcast Meshtastic non ha una vera e propria logica di routing (**managed flooding**): ogni nodo ritrasmette il messaggio andando a decrementare un counter HOP (TTL).

<img src="/img/routing.png"/>

<div v-click>

Ogni nodo ha un **ruolo** che può modificare questo comportamento, il default è **Client**, che va bene per il 90% dei casi.

</div>

---

### Tipi di pacchetti

<v-click>

<div class="grid grid-cols-5 gap-3 mt-6">

<div class="pkt-card">
  <img src="/img/icons/broadcast.svg" alt="Broadcast" class="pkt-icon" />
  <div class="pkt-name">Broadcast</div>
  <div class="pkt-desc">su canali</div>
</div>

<div class="pkt-card">
  <img src="/img/icons/direct.svg" alt="Diretti" class="pkt-icon" />
  <div class="pkt-name">Diretti</div>
  <div class="pkt-desc">next-hop routing (FW 2.6)</div>
</div>

<div class="pkt-card">
  <img src="/img/icons/telemetry.svg" alt="Telemetria" class="pkt-icon" />
  <div class="pkt-name">Telemetria</div>
  <div class="pkt-desc">batteria e sensori</div>
</div>

<div class="pkt-card">
  <img src="/img/icons/position.svg" alt="Posizione" class="pkt-icon" />
  <div class="pkt-name">Posizione</div>
  <div class="pkt-desc">coordinate GPS</div>
</div>

<div class="pkt-card">
  <img src="/img/icons/nodeinfo.svg" alt="NodeInfo" class="pkt-icon" />
  <div class="pkt-name">NodeInfo</div>
  <div class="pkt-desc">metadati del nodo</div>
</div>

</div>

</v-click>

<style>
.pkt-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  padding: 1.1rem 0.6rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.pkt-icon {
  width: 48px;
  height: 48px;
}

.pkt-name {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #67ea94;
  text-align: center;
  line-height: 1.2;
}

.pkt-desc {
  font-size: 0.72rem;
  line-height: 1.35;
  text-align: center;
  opacity: 0.72;
}
</style>

<div v-click>

Questi ultimi 3 vengono mandati **periodicamente** dal nodo, è possibile mandare una posizione **determinata** dall'utente o **disattivarla** completamente.

</div>

<v-click>

È **importante** non saturare la mesh di messaggi "inutili", **meno** pacchetti si mandano, più la mesh è **affidabile**.

</v-click>


---

### Canali ed impostazioni modem

Le **impostazioni del modem** (es. **Long Fast**, **Medium Fast**) sono un'astrazione delle configurazioni del layer fisico LoRa (frequenza, ecc..). Tutti i nodi che condividono le stesse impostazioni modem possono ricevere e ritrasmettere i messaggi.


Il default è **Long Fast**, in Italia si utilizza **Medium Fast** (convenzione community) per limitare la saturazione dell'**airtime**.

<div v-click>

I **canali** non sono altro che delle impostazioni di criptografia per i messaggi. Se A e B vogliono comunicare, oltre alle stesse impostazioni del modem **devono** condividere lo stesso canale. Attenzione: **Tutti** i nodi ritrasmettono i messaggi anche di canali che non hanno, semplicemente non possono leggerli perché **criptati**!


<div class="flex items-center w-full flex-col mt-0">
  <img src="/img/canali.png" width="470"/>
</div>

</div>

---

### Criptografia

Due meccanismi distinti:

<v-clicks>

- **Canali**: cifratura simmetrica AES-256-CTR con chiave pre-condivisa (PSK) del canale. Chi conosce la PSK può leggere (e falsificare) i messaggi di quel canale
- **Messaggi diretti** (dal FW 2.5): crittografia a chiave pubblica (x25519 + AES-CCM), criptati con la chiave pubblica del ricevente e firmati con la privata del mittente

</v-clicks>

<div v-click>

Importanti limitazioni:

</div>

<v-click>

- Identità basata su **Trust On First Use** (TOFU)
- L'**header** del pacchetto NON è criptato
- Il canale **primario** di default usa una chiave nota ("AQ=="): senza cambiarla, tutto è pubblico

<br>
<br>
<br>

> ⚠️ Attenzione: La posizione viene mandata sul canale primario del dispositivo! Di default tutti vedono dove sei

</v-click>

---

### Legalità in Italia

La legalità **non** dipende dal software, ma da **quale servizio radioelettrico** stai usando:

| Chi sei | Banda | Crittografia |
|---|---|---|
| Non radioamatore | 868 MHz (SRD) | Consentita |
| Non radioamatore | 433 MHz (SRD, apparato CE) | Consentita |
| Radioamatore | 430–434 MHz (70 cm) | Vietata — obbligo di trasmettere in chiaro |
| Radioamatore su 868 | 868 MHz | Opera come SRD, non come radioamatore |

- **Servizio radioamatoriale** (patente + nominativo): divieto di cifratura (Regolamento UIT, Art. 25)
- **Bande SRD / "uso libero"**: aperte a tutti con apparati conformi CE, senza licenza. Limiti su potenza e duty cycle, ma **nessun divieto di cifratura**


---

### I limiti da rispettare

| Banda | Potenza | Duty cycle |
|---|---|---|
| 868 MHz (869,4–869,65) | **max 500 mW ERP** (27 dBm) | ≤ 10% |
| 433 MHz (433,05–434,79) | 10 mW ERP | ≤ 10% |

<v-clicks>

- In Italia: **EU_868**, preset **MediumFast** su **869,525 MHz**.
- Per l'uso SRD l'apparato *dovrebbe* essere **conforme CE** (direttiva RED 2014/53/UE) — ma **quasi nessun nodo fai-da-te lo è davvero**. Tuttavia i produttori si stanno man mano adattando
- Duty cycle 10% = max **6 minuti di trasmissione all'ora** (vincolo di legge)
- Le schede comuni però trasmettono a ~**158 mW** (22 dBm): è il **limite del chip** (SX1262)

</v-clicks>

---

### Di conseguenza

- **Privato (non radioamatore)**: può criptare e usare 868 MHz (500 mW / 10%) oppure 433 MHz (10 mW / 10%).
- **Radioamatore sui 70 cm (430–434)**: deve trasmettere **in chiaro**, niente cifratura.
- **Radioamatore su 868**: opera da SRD: può criptare, ma senza i privilegi da radioamatore (potenze maggiori, ecc.).

<div v-click>

La cifratura è legale, ma l'**impianto** deve comunque rispettare potenza, duty cycle e marcatura CE.

</div>

<div v-click>

**Realtà**: molte schede economiche (Heltec/LILYGO/cloni AliExpress) **non** hanno una vera omologazione CE.

La normativa è complessa e ingarbugliata, **do your own research**.

</div>
