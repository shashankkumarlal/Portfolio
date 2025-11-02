import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import type { PluginOption } from 'vite';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize replit plugins array with proper type
const replitPlugins: PluginOption[] = [];

// Only import Replit plugins in development
if (process.env.NODE_ENV !== "production" && process.env.REPL_ID) {
  import("@replit/vite-plugin-cartographer")
    .then(({ cartographer }) => {
      replitPlugins.push(cartographer());
      return import("@replit/vite-plugin-dev-banner");
    })
    .then(({ devBanner }) => {
      replitPlugins.push(devBanner());
    })
    .catch(() => {
      console.log('Replit plugins not found, skipping...');
    });
}

export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
      "@assets": path.resolve(__dirname, "./client/src/assets"),
    },
  },
  plugins: [
    react(),
    ...replitPlugins,
  ],
  root: "./client",
  build: {
    outDir: "../dist/client",
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
});
