import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The frontend talks to each service through this dev proxy, so no
// service needs CORS. Inventory and pricing are intentionally NOT
// proxied: the frontend only reaches them through catalog/cart/orders.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api/catalog": {
        target: "http://localhost:4001",
        rewrite: (path) => path.replace(/^\/api\/catalog/, "/api"),
      },
      "/api/cart": {
        target: "http://localhost:4002",
        rewrite: (path) => path.replace(/^\/api\/cart/, "/api"),
      },
      "/api/orders": {
        target: "http://localhost:4004",
        rewrite: (path) => path.replace(/^\/api\/orders/, "/api"),
      },
      "/api/notifications": {
        target: "http://localhost:4006",
        rewrite: (path) => path.replace(/^\/api\/notifications/, "/api"),
      },
    },
  },
});
