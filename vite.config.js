import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

export default defineConfig({
  base: "/passqo-react-js/",
  plugins: [
    react(),
    {
      name: "copy-404-for-gh-pages",
      closeBundle() {
        const distDir = path.resolve(__dirname, "./dist");
        if (fs.existsSync(path.join(distDir, "index.html"))) {
          fs.copyFileSync(path.join(distDir, "index.html"), path.join(distDir, "404.html"));
        }
      },
    },
  ],
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
