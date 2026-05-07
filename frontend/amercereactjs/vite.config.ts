import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/shopkart-api": {
        target: "http://localhost:8080/ecomm",
        changeOrigin: true,
        rewrite: (p) => p,
      },
      "/ecomm/assets/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      "/ecomm/images": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  build: {
    // On Netlify (CI=true) build into a local dist/; locally build into shared frontend-dist/
    outDir: process.env.CI ? "dist" : "../../frontend-dist",
    emptyOutDir: true,
  },
});
