# Meshtastic

**Protocollo** di messaggistica mesh basato su LoRa. La community ha sviluppato:

- **Firmware** per dispositivi basati su **ESP32** o **nRF52** equipaggiati con ricetrasmittente LoRa (Semtech SX126x o LR11xx)
- **Software** APP android e iOS, web client
- Demone _meshtasticd_ per permettere la creazioni di nodi usando radio **SPI** o **USB** su Linux e MacOS
- Documentazioni e community

> Ogni dispositivo meshtastic è un _nodo_: riceve ed inoltra i messaggi a tutti (flooding). La forza di meshtastic è che aggiungendo nodi è facilissimo espandere la rete. 

<MeshtasticDevices />

---

## Le alternative

- **MeshCore**: Più strutturato, usa un routing deterministico dove il posizionamento geografico dei nodi è fondamentale
- **LoRa-APRS**: Dedicato ai radioamatori
- **Reticulum/Rnode**: Alternativa open source estremamente potente e multi-mezzo, ma molto meno "plug-and-play".

La gran popolarità di meshtastic è data proprio dal perfetto compromesso tra facilità di utilizzo, espansione della rete, costo e potenzialità.

---

## L'hardware

Le schede meshtastic sono divise in due grandi categorie:
- **ESP32**-Based: più potenti, dotati di wifi ma consumano di più
- **nRF52**-Based: consumo energetico estremamente ridotto

Esistono anche schede basate su RP2040/RP2350 e STM32.

La selezione è super ampia, è facile vedere schede con anche:
- GPS
- Barometro e termometro
- Schermo
- Tastiera

---

<div class="grid grid-cols-3 gap-2">
  <div>
    <img src="/img/heltec.png" width="210"/>
    <small>Heltec v4</small>
    <img src="/img/xiao.png"/>
    <small>XIAO nRF52840 & Wio-SX1262</small>
  </div>
  <div>
    <img src="/img/solar.png"/> 
    <small>SenseCAP Solar Node</small>
    <img src="/img/meshtracker.png"/>
    <small>SenseCAP MeshTracker X1</small>
  </div>
  <div>
    <img src="/img/wio-tracker.png"/>
    <small>Wio Tracker L1 Pro</small> 
    <img src="/img/t-deck.png" width="210"/>
    <small>LILYGO T-Deck</small> 
  </div>
</div>

---

### E se voglio fare tutto in casa?

<div class="flex items-center w-full flex-col mt-10">
    <img src="/img/faketek.png" width="320" class="flex-none self-center"/>
</div>

Puoi realizzare un nodo meshtastic unendo un micro controllare ed una radio LoRa. Oppure costruirti un [fakeTek](https://github.com/gargomoma/fakeTec_pcb).

---

### Ok, ma in pratica?

Ogni radio è un **nodo** che riceve e **inoltra** i messaggi: insieme formano una **mesh**. Due mesh lontane tra loro possono collegarsi tramite un broker **MQTT** su **internet**.

<MeshRelay />

---

### Il routing

Meshtastic non ha una vera e propria logica di routing, ogni nodo ritrasmette il messaggio andando a decrementare un counter HOP (TTL).

<img src="/img/routing.png"/>

Ogni nodo ha un **ruolo** che può modificare questo comportamento, il default è **Client**, che va bene per il 90% dei casi.