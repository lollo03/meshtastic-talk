## Come iniziare

<v-clicks>

<div class="grid grid-cols-2 gap-4 mt-6">

<div class="step-card">
  <div class="step-num">1</div>
  <div class="step-body">
    <div class="step-name">Nodo fisso o portatile?</div>
  </div>
</div>

<div class="step-card">
  <div class="step-num">2</div>
  <div class="step-body">
    <div class="step-name">DIY o compro già fatto?</div>
  </div>
</div>

<div class="step-card">
  <div class="step-num">3</div>
  <div class="step-body">
    <div class="step-name">Fai il flash del firmware</div>
    <div class="step-desc">
      Usando il <a href="https://flasher.meshtastic.org/" target="_blank">web flasher</a> o esptool
    </div>
  </div>
</div>

<div class="step-card">
  <div class="step-num">4</div>
  <div class="step-body">
    <div class="step-name">Configura il nodo</div>
    <ul class="step-list">
      <li>Impostazioni modem</li>
      <li>Canali di default</li>
      <li>Tempi di trasmissione pacchetti</li>
    </ul>
  </div>
</div>

</div>



<div class="mt-6">

> Guida ai parametri sulla [wiki di LoraItalia](https://www.loraitalia.it/wiki/configurazione-nodi/)

</div>

</v-clicks>

<style>
.step-card {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  padding: 0.95rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.step-num {
  flex: 0 0 auto;
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(103, 234, 148, 0.12);
  border: 1px solid rgba(103, 234, 148, 0.35);
  color: #67ea94;
  font-weight: 700;
  font-size: 1rem;
  line-height: 1;
}

.step-name {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  line-height: 1.3;
}

.step-desc {
  margin-top: 0.35rem;
  font-size: 0.78rem;
  line-height: 1.45;
  opacity: 0.72;
}

.step-desc a {
  color: #67ea94;
}

.step-list {
  margin: 0.5rem 0 0 0;
  padding-left: 1.1rem;
  font-size: 0.78rem;
  line-height: 1.45;
  opacity: 0.72;
}

.step-list li {
  margin: 0.1rem 0;
}
</style>

---

## E dopo?

Non finisce qui! Puoi:

<div class="grid grid-cols-3 gap-5 mt-8" v-clicks>

<div class="after-card">
  <div class="after-name">Costruirti un'antenna</div>
  <div class="after-media">
    <img src="/img/antenna.png" alt="Antenna fai-da-te" />
  </div>
</div>

<div class="after-card">
  <div class="after-name">Costruirti un nodo</div>
  <div class="after-media">
    <img src="/img/nodo.png" alt="Nodo fai-da-te" />
  </div>
</div>

<div class="after-card">
  <div class="after-name">Sviluppare software per la mesh</div>
  <div class="after-media">
    <img src="/img/meshmonitor.png" alt="Software per monitorare la mesh" />
  </div>
</div>

</div>

<div v-click class="mt-8 text-center">

L'importante è **divertirsi** e **sperimentare** con la mesh!

</div>

<style>
.after-card {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  padding: 1rem 1rem 1.1rem;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
}

.after-name {
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: #67ea94;
  text-align: center;
  line-height: 1.25;
}

.after-media {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.after-media img {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border-radius: 8px;
}
</style>

---
layout: center
---

# Demo!