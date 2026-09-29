
## Meshtastic in Italia

<MeshStats />

<MeshGrowth class="mt-4" />


---

<MeshNodeMap /> 


---

## LoraItalia

<div class="flex items-center w-full flex-col mt-10">
    <img src="/img/loraitalia.jpg" width="120" class="flex-none self-center"/>
</div>

<v-clicks>

La community Meshtastic più grande in Italia è **[LoraItalia](https://www.loraitalia.it/)**. Gestiscono un server **MQTT**, una wiki ed un gruppo Telegram

Tramite il server MQTT riescono a fornire anche una [mappa](https://tools.loraitalia.it/map) interattiva che permette a tutti di vedere lo stato attuale della mesh

Mantengono anche un [fork](https://github.com/LoraItalia/loraitalia-firmware) del firmware Meshtastic originale con delle piccole modifiche per farlo funzionare meglio nella mesh italiana, ma l'installazione di questo firmware **non** è necessaria per poter partecipare

La community è molto attiva e le loro configurazioni sono lo standard **de facto** in Italia

> Tutti i dati mostrati nelle slide precedenti sono stati presi dai loro servizi web

</v-clicks>

---

## SOS-Italia

A differenza di LoraItalia, è una mesh più **strutturata** e con uno scopo ben preciso.
<div class="flex items-center w-full flex-col mt-0">
    <img src="/img/mappa-sos.png" width="470"/>
</div>


Più piccola per numero di nodi (**182**)

---

Utilizza modem preset **MediumFast** ma con dei canali diversi. L'obiettivo è di creare un'infrastruttura off-grid per il **soccorso** in montagna

<div class="flex items-center w-full flex-col mt-0">
    <img src="/img/sos.png" width="470"/>
</div>

È un'azienda, forniscono la connettività tramite Meshtastic ad enti per vari scopi, i.e. tracciamento animali, telemetria per rifugi

Ma **chiunque** abbia un nodo Meshtastic può sfruttare la loro **infrastruttura** per mandare e ricevere messaggi

---

## MQTT

Come abbiamo visto, la presenza di un broker MQTT in una mesh permette:

<div class="grid grid-cols-3 gap-4 mt-6">

<v-click>

<div class="mqtt-card">
  <img src="/img/icons/broadcast.svg" alt="Nodi lontani" class="mqtt-icon" />
  <div class="mqtt-name">Nodi lontani</div>
  <div class="mqtt-desc">collegare nodi distanti tra loro</div>
</div>

</v-click>

<v-click>

<div class="mqtt-card">
  <img src="/img/icons/telemetry.svg" alt="Metriche" class="mqtt-icon" />
  <div class="mqtt-name">Metriche</div>
  <div class="mqtt-desc">raccogliere e visualizzare i dati</div>
</div>

</v-click>

<v-click>

<div class="mqtt-card">
  <img src="/img/icons/screen.svg" alt="Stato di salute" class="mqtt-icon" />
  <div class="mqtt-name">Stato di salute</div>
  <div class="mqtt-desc">monitorare lo stato della mesh</div>
</div>

</v-click>

</div>

<style>
.mqtt-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.55rem;
  padding: 1.1rem 0.6rem 1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.mqtt-icon {
  width: 48px;
  height: 48px;
}

.mqtt-name {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #67ea94;
  text-align: center;
  line-height: 1.2;
}

.mqtt-desc {
  font-size: 0.72rem;
  line-height: 1.35;
  text-align: center;
  opacity: 0.72;
}
</style>

<v-click>

<br>

> Un nodo può essere connesso ad MQTT senza inoltrare i messaggi (solo per metriche)

<br>

> ⚠️ Attenzione: non collegate per nessun motivo un nodo al server MQTT mondiale! La mesh verrebbe saturata in un istante

</v-click>