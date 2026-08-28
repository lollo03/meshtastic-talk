# Legalità della crittografia in Meshtastic (Italia)

> Ricerca a supporto del talk "Meshtastic for Dummies".
> Ultimo aggiornamento: agosto 2026. **Questo documento NON è consulenza legale.**
> Sommario ai-generated
---

## 1. Risposta breve (TL;DR)

**No, per i NON radioamatori in Italia NON è illegale criptare i messaggi Meshtastic** sulle bande "a uso libero" (SRD — *Short Range Devices*): 868 MHz e 433 MHz.

Il **divieto di cifratura esiste solo per il servizio di radioamatore** (e per alcuni servizi privati a uso civile come CB e PMR446). Chi opera da radioamatore sulle proprie bande (es. i 70 cm, 430–434 MHz) **deve trasmettere in chiaro**. Chi opera da privato cittadino su bande SRD con apparati conformi CE, invece, **può criptare**: lì i limiti di legge riguardano frequenza, potenza irradiata, duty cycle e conformità CE — **non la cifratura**.

| Chi sei | Banda | Crittografia |
|---|---|---|
| Non radioamatore | 868 MHz (SRD) | ✅ Consentita |
| Non radioamatore | 433 MHz (SRD, apparato CE) | ✅ Consentita |
| Radioamatore (banda propria) | 430–434 MHz (70 cm) | ❌ Vietata (obbligo di chiaro) |
| Radioamatore che usa 868 MHz | 868 MHz (SRD) | ⚠️ Opera come SRD, non come radioamatore (vedi §7) |

---

## 2. Perché esistono due regimi diversi

Il punto chiave da spiegare nel talk: **ogni pacchetto trasmesso appartiene a un regime giuridico**. La legalità di una trasmissione non dipende dal software (Meshtastic) né dal fatto che tu abbia o meno un nominativo, ma da **quale servizio radioelettrico e quale banda stai usando**.

- **Servizio di radioamatore**: riservato a chi ha patente e nominativo. Ha obblighi precisi (identificazione, traffico non commerciale, **divieto di messaggi cifrati**).
- **Bande SRD / "uso libero"**: aperte a chiunque con apparati conformi CE, senza licenza né nominativo. Regolano potenza/duty cycle, ma **non vietano la cifratura**.

Meshtastic in Italia gira di default su **869,525 MHz**, cioè dentro la banda SRD 862–876 MHz, **non** su una banda radioamatoriale. Questo è il motivo per cui il "non radioamatore" può usarlo (e criptarlo) legalmente.

---

## 3. Radioamatori: il divieto di cifratura

### 3.1 Regolamento delle Radiocomunicazioni UIT (fonte primaria)

L'articolo 25 del Regolamento delle Radiocomunicazioni dell'UIT stabilisce:

> **25.2A §1A)** "Le trasmissioni tra stazioni di radioamatore di Paesi diversi non devono essere cifrate allo scopo di occultarne il significato, fatta eccezione per i segnali di controllo scambiati tra stazioni terrestri di comando e stazioni spaziali nel servizio di radioamatore via satellite."

- Testo integrale (Articolo 25 in italiano): [ARI Rivarolo — RR Articolo 25 (PDF)](https://www.ari-rivarolo.org/docs/RR-Articolo-25-IT.pdf)

Il Regolamento delle Radiocomunicazioni è ratificato e vincolante in Italia tramite la **legge 31 gennaio 1996, n. 313** (ratifica di Costituzione e Convenzione UIT e dei Regolamenti).

### 3.2 Normativa nazionale italiana

- **[D.Lgs. 1 agosto 2003, n. 259](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-08-01;259)** — "Codice delle comunicazioni elettroniche", **Capo VII "Radioamatori"** (artt. 134 e segg.): disciplina il servizio di radioamatore. Il decreto richiama espressamente il Regolamento delle radiocomunicazioni UIT come base della disciplina.
- **[D.P.R. 5 agosto 1966, n. 1214](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1966-08-05;1214)** — "Nuove norme sulle concessioni di impianto ed esercizio di stazioni di radioamatore" (tuttora richiamato per la disciplina della concessione/autorizzazione).
- Riferimento istituzionale: [Ispettorati MISE — Normativa Radioamatori](https://ispettorati.mise.gov.it/index.php/normativa/radioamatori)

**Conseguenza pratica**: un radioamatore che usa Meshtastic dentro una propria banda (es. i 70 cm a 430–434 MHz) con chiave privata sta violando il divieto di cifratura. In ambito radioamatoriale i messaggi vanno trasmessi **in chiaro**.

---

## 4. Non radioamatori: bande SRD a uso libero (868 MHz e 433 MHz)

### 4.1 Dove sta il fondamento normativo

Le bande "uso libero" per apparati a corto raggio (SRD) sono armonizzate a livello europeo e recepite in Italia tramite il **Piano Nazionale di Ripartizione delle Frequenze (PNRF)**.

- **[D.M. 31 agosto 2022](https://atc.mise.gov.it/images/documenti/Decreto_PNRF_31-08-2022_firmato.pdf)** — nuovo PNRF (testo del decreto, PDF).
- [Tabella B del PNRF](https://atc.mise.gov.it/images/documenti/03-Tabella_B.docx.pdf) — attribuzione 862–876 MHz ai servizi "110 A/B/C/D/E/F".
- [Note esplicative del PNRF](https://www.mimit.gov.it/images/stories/digitale/05-Note.pdf) — dettaglio dei codici di servizio.
- Pagina MIMIT sul PNRF: [Piano Nazionale di Ripartizione delle Frequenze](https://www.mimit.gov.it/it/digitale/gestione-spettro-radio/piano-nazionale-ripartizione-frequenze)

### 4.2 Il riferimento tecnico: ERC 70-03

Il riferimento tecnico per i limiti SRD è la raccomandazione CEPT **[ERC/REC 70-03](https://docdb.cept.org/download/3700)** ("Relating to the use of Short Range Devices"). Per la banda usata da Meshtastic:

- **869,400 – 869,650 MHz** → **500 mW ERP**, **duty cycle ≤ 10%** (Annex 1, sezione h1.7 secondo la numerazione citata da LoRa Italia).
- La banda **433,050 – 434,790 MHz** → SRD "non-specifici", tipicamente **10 mW ERP**, duty cycle ≤ 10% (Annex 1).

> Nota: alcuni siti della community citano "25 mW / 1%". Quel limite si riferisce ad **altre sottobande** dell'863–870 MHz. La frequenza standard di Meshtastic in Italia (869,525 MHz) ricade nella sottobanda 869,4–869,65 MHz → 500 mW ERP / 10%.

### 4.3 Conformità hardware: la direttiva RED

Per usare legalmente un apparato in banda SRD serve un **apparato radio conforme** (marcatura CE, dichiarazione di conformità UE), ai sensi della:

- **[Direttiva 2014/53/UE (RED)](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32014L0053)** — "Direttiva apparecchiature radio".

**Punto chiave**: nessuna di queste fonti (PNRF, ERC 70-03, RED) contiene un **divieto di cifratura** per gli apparati SRD. La cifratura di un messaggio non è regolata dalla normativa SRD: a differenza del servizio di radioamatore, qui i vincoli sono esclusivamente tecnici (frequenza, potenza ERP, duty cycle, conformità CE).

---

## 5. La situazione specifica di Meshtastic

### 5.1 Frequenza e preset

- Regione **EU_868**: Meshtastic trasmette nella porzione **869,400–869,650 MHz**. In Italia lo standard di community è il preset **MEDIUM_FAST su 869,525 MHz**.
- Fonte community (accurata sui limiti): [LoRa Italia — Normativa](https://www.loraitalia.it/wiki/normativa/)
- Configurazione ufficiale: [Meshtastic — Radio Settings](https://meshtastic.org/docs/overview/radio-settings/)

### 5.2 Crittografia

Meshtastic cripta il payload con **AES-256** (chiave pre-condivisa per canale). Su una banda SRD usata da privati, questo **è legittimo**: il divieto di cifratura è un vincolo del servizio di radioamatore, non dell'uso SRD.

⚠️ **Attenzione per il talk (onestà tecnica)**:
- Il **canale pubblico di default** (LongFast) usa una chiave **nota a tutti** (la chiave di default è pubblica: `1PG7OiApB1nwvP+rz05pAQ==`). Quindi "crittografato" in quel caso è più che altro un'offuscazione: chiunque può leggerlo. La vera riservatezza richiede una **chiave privata** condivisa solo col proprio gruppo.
- La cifratura protegge il **contenuto**, non i **metadati**: nominativo del nodo, posizione, telemetria, orari e relazioni di rete possono comunque essere osservati (e pubblicati su mappe/antenne).

---

## 6. Il caso 433 MHz (da spiegare bene)

La banda dei 433 MHz è il punto più delicato, perché **si sovrappongono due regimi**:

- **430–434 MHz** è allocazione (secondaria) del **servizio di radioamatore** in Italia (70 cm).
- **433,050–434,790 MHz** è invece banda **SRD** (uso libero) per apparati a corto raggio.

Quindi:

| Operatore | Frequenza 433 MHz | Regime | Crittografia |
|---|---|---|---|
| Non radioamatore, apparato CE (10 mW) | 433,05–434,79 MHz | SRD | ✅ Consentita |
| Radioamatore con patente/nominativo | 430–434 MHz (70 cm) | Radioamatoriale | ❌ Vietata |

Un radioamatore che usa Meshtastic in region **EU_433** (433,175 MHz) **dentro la propria allocazione da 70 cm** deve rispettare le regole radioamatoriali, **incluso il divieto di cifratura**. Un privato cittadino che usa un apparato SRD conforme sulla stessa banda non ha questo vincolo.

---

## 7. Il caso "ibrido": radioamatore che usa gli 868 MHz

Tecnicamente **868 MHz non è una banda radioamatoriale in Europa/Italia**. Un radioamatore che vi opera:
- **non** sta operando come radioamatore (la patente non "trasforma" l'868 in banda radioamatoriale);
- opera quindi **come SRD**, soggetto ai limiti SRD (potenza ERP, duty cycle, conformità CE).

In pratica: un radioamatore su 868 MHz **può** usare la cifratura di Meshtastic come qualsiasi altro utente SRD, **ma** non può invocare i privilegi radioamatoriali (potenze maggiori, autocostruzione libera, ecc.) su quella banda. Se vuole "giocare" con potenze e infrastrutture da radioamatore, deve spostarsi su una banda radioamatoriale (es. 70 cm) — e lì la cifratura è **vietata**.

---

## 8. Zone grigie e avvertenze (da dire nel talk)

1. **Cifratura ≠ legalità dell'impianto.** Un nodo Meshtastic criptato ma con potenza/ERP oltre i limiti, duty cycle superato, o hardware non conforme CE resta **non conforme** (illecito amministrativo). La cifratura è legale, l'impianto radio deve comunque rispettare i limiti.
2. **Marcatura CE e importazione.** Acquistare una scheda fuori UE (es. AliExpress) senza DoC europeo può rendere **te** parte della catena di conformità. "Ho comprato solo una schedina" non fa sparire gli obblighi.
3. **Duty cycle 10%.** Il limite "6 minuti di trasmissione per ora" è un vincolo legale, non un semplice fastidio software. Disabilitarlo per "far funzionare meglio la rete" è il tipico passo che rende l'impianto non conforme.
4. **Rete vs. privacy.** Anche criptando, il **canale pubblico di default** e la pubblicazione su mappe/antenne espongono metadati (posizione, nodi, orari). Per la privacy servono chiavi private e consapevolezza.
5. **Questo documento non è consulenza legale.** Per situazioni specifiche (installazioni permanenti in alta quota, uso commerciale, uso in ambito emergenziale) va sentito un professionista o l'ispettorato territoriale MIMIT.

---

## 9. Fonti e collegamenti

**Normativa radioamatori (divieto di cifratura)**
- Regolamento delle Radiocomunicazioni UIT, Art. 25 (25.2A §1A) — [PDF in italiano (ARI Rivarolo)](https://www.ari-rivarolo.org/docs/RR-Articolo-25-IT.pdf)
- Legge 31 gennaio 1996, n. 313 — ratifica atti UIT — [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1996-01-31;313)
- D.Lgs. 1 agosto 2003, n. 259 (Codice delle comunicazioni elettroniche), Capo VII — [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-08-01;259)
- D.P.R. 5 agosto 1966, n. 1214 — [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.del.presidente.della.repubblica:1966-08-05;1214)
- Ispettorati MISE — [Normativa Radioamatori](https://ispettorati.mise.gov.it/index.php/normativa/radioamatori)

**Bande SRD / uso libero**
- D.M. 31 agosto 2022 — PNRF — [PDF decreto](https://atc.mise.gov.it/images/documenti/Decreto_PNRF_31-08-2022_firmato.pdf)
- PNRF — [Tabella B (PDF)](https://atc.mise.gov.it/images/documenti/03-Tabella_B.docx.pdf)
- PNRF — [Note esplicative (PDF)](https://www.mimit.gov.it/images/stories/digitale/05-Note.pdf)
- CEPT — [ERC/REC 70-03 (SRD)](https://docdb.cept.org/download/3700)
- Direttiva RED — [2014/53/UE](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32014L0053)

**Riferimenti di community (accurati)**
- LoRa Italia — [Normativa](https://www.loraitalia.it/wiki/normativa/)
- RF.Guru — [Meshtastic, MeshCore and the Legal Framework](https://shop.rf.guru/pages/meshtastic-meshcore-and-the-legal-framework)
- Meshtastic — [Legal](https://meshtastic.org/docs/legal/) e [Radio Settings](https://meshtastic.org/docs/overview/radio-settings/)
- RogerK (forum radioamatori) — [LoRa e Meshtastic, MeshCore e radioamatori](https://www.rogerk.net/forum/index.php?topic=82804.0)
