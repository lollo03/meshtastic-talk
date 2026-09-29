---
theme: "@politecnicoopenunixlabs/slidev-theme-poul"

# light mode not working in prod
colorSchema: dark

download: true

# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: view-transition
# duration of the presentation
duration: 45min

# use hash instead of overwriting history.
routerMode: hash

sourceCode: https://github.com/lollo03/meshtastic-talk

license:
  text: GPL-3.0-only
  link: https://www.gnu.org/licenses/gpl-3.0.html

credits:
  - name: Lorenzo Andreasi
    email: me@lolloandr.com
    role: [author, speaker]
  - name: Roberto Bochet
    role: [specialThanks]
  - name: Francesco Proia
    role: [specialThanks]
  - name: Nicola Ricciuti
    role: [specialThanks]

#####
layout: intro-classic
hideInToc: true
---

<!-- customize the component if needed -->
<!-- you are supposed to replace the component in ./components/VueTitle.vue -->
<!-- or insert some custom style from scratch -->

<VueTitle>
<span style="color: #67EA94">Meshtastic</span> 101
</VueTitle>

---
src: ./pages/0-perche.md
---

---
src: ./pages/1-lora.md
---

---
src: ./pages/2-meshtastic.md
---

---
src: ./pages/3-stato.md
---

---
src: ./pages/4-inizia.md
---

---
layout: outro-classic
hideInToc: true
---

<!-- customize the component if needed -->
<!-- you are supposed to replace the component in ./components/VueTitle.vue -->
<!-- or insert some custom style from scratch -->

<VueTitle>
<span style="color: #67EA94">Meshtastic</span> 101
</VueTitle>
