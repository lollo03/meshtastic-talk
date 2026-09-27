# LoRa - Il livello fisico

<div v-click>

**LoRa** (Long Range) è una **tecnologia di modulazione wireless** a lunga distanza e a bassissimo consumo, ideale per dispositivi alimentati a batteria.

</div>

<div v-click>

LoRa non è open source: il chip radio e la tecnologia alla base (Chirp Spread Spectrum) sono proprietari. Possono essere prodotti esclusivamente da **Semtech** o da aziende con una loro licenza.

</div>

<div v-click>

Tuttavia, questi chip sono estremamente economici e la licenza non impone restrizioni su cosa possiamo incapsulare all'interno del pacchetto LoRa. Ed è esattamente qui che entra in gioco Meshtastic.

</div>

---

![](/img/lora.png)

<div v-click>

LoRa utilizza dei "**chirp**" per trasmettere informazioni. Un chirp non è altro che un segnale che cambia di frequenza nel tempo.

</div>

<div v-click>

Due radio LoRa per sentirsi a vicenda devono condividere:

</div>

<v-clicks>

- Frequenza Base
- Spreading Factor
- Bandwidth
- Coding Rate
- Sync Word

</v-clicks>

<div v-click>

Ma a noi tutto questo **non** interessa: Meshtastic offre un livello di astrazione (modem settings) che ci permette di evitare configurazioni complicate.

</div>

<!--
Spreading factor: La durata del "chirp" radio.
Bandwidth (BW): larghezza di banda del segnale
Coding Rate (CR): bit di controllo per forward error correction
Sync Word: identifica la rete
-->

---

LoRa permette comunicazioni a distanze **assurde** (il record è di 1336 km per **LoraWan**, 331km per **Meshtastic**)

<img src="/img/record-lora.png" width="350"/>

<div v-click>

In Europa LoRa è usato sulle bande dei 434 MHz e 868 MHz.

</div>

<div v-click>

LoRa permette data rate fino a 27 kbps.

</div>

<div v-click>

Meshtastic nella sua configurazione radio tipica **in Italia** permette un valore di 3.52 kbps.

</div>

<div v-click>

Distinzione importante: **LoRa** non è **LoraWan**!

LoraWan è un protocollo di rete commerciale creato principalmente per le smart city, **non** c'entra nulla con Meshtastic e non è parte integrante di LoRa

</div>
