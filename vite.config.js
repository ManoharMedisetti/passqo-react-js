import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/link": path.resolve(__dirname, "./src/components/ui/Link.jsx"),
      "next/image": path.resolve(__dirname, "./src/components/ui/Image.jsx"),
      "next/navigation": path.resolve(__dirname, "./src/components/ui/NavigationAdapter.jsx"),
    },
  },
  server: {
    port: 3000,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  },
});
