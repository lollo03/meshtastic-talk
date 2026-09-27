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

# This is updated automatically, you do not need to change this
sourceCode: https://gitlab.poul.org/corsi/templates/slidev-template

license: CC-BY-SA-4.0

credits:
  - name: Lorenzo Andreasi
    email: me@lolloandr.com
    role: [author, speaker]

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
layout: outro-classic
hideInToc: true
---

<!-- customize the component if needed -->
<!-- you are supposed to replace the component in ./components/VueTitle.vue -->
<!-- or insert some custom style from scratch -->

<VueTitle>
<span style="color: #67EA94">Meshtastic</span> 101
</VueTitle>
