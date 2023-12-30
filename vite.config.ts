import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import vpc from "vite-plugin-cloudflare";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vpc({ scriptPath: "./functions/example.ts" })],
});
