import { defineConfig } from "vite"

// Slidev unisce questa config alla sua.
//
// Nota su maplibre-gl: il worker viene importato esplicitamente in
// components/MeshNodeMap.vue con `?worker&url` e passato a setWorkerUrl(), così
// Vite lo bundla e lo emette (con il base corretto) sia in dev sia in build.
// Non serve più escluderlo da optimizeDeps.
export default defineConfig({})
