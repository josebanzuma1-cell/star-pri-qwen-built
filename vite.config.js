import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/* Served from https://<user>.github.io/star-pri-qwen-built/, so assets need
   that sub-path. Set BASE_PATH=/ when deploying to a domain root instead. */
const base = process.env.BASE_PATH || "/star-pri-qwen-built/";

export default defineConfig({
  base,
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
