import { defineConfig } from "vite"

// Slidev unisce questa config alla sua.
// maplibre-gl carica il proprio web worker come module worker: se Vite lo
// pre-bundla, il worker viene servito con MIME errato e il browser lo blocca
// (Firefox: "disallowed MIME type"). Escludendolo dall'optimize il worker viene
// servito dal path reale dei sorgenti con il content-type corretto.
export default defineConfig({
  optimizeDeps: {
    exclude: ["maplibre-gl"],
  },
})
