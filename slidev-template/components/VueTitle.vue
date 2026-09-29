<!-- this is a Vue.js component. for more info you can refer to the theme
     (https://gitlab.poul.org/corsi/templates/slidev-theme) and the https://sli.dev
     documentation. -->

<script setup>
const base = import.meta.env.BASE_URL
</script>

<template>
  <!-- you are supposed to change the style -->
  <a href="https://poul.org/courses/vuejs" class="flex justify-center border-0! items-center">
    <img :src="`${base}img/logo.svg`" alt="Meshtastic logo" class="relative top-[5px] h-16 w-16" />
    <h3 class="text-10! font-bold color-[#67EA94]"><span>Linux Day</span> 2026</h3>
  </a>

  <h1 class="text-15! mt-6 text-center">
    <slot />
  </h1>
</template>
