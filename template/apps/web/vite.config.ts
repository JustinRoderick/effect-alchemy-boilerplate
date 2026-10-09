import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Alchemy's Cloudflare.Website.Vite loads this config and adds its Cloudflare integration on top.
export default defineConfig({
  plugins: [react()],
});
