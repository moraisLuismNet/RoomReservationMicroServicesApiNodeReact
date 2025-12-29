import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 4200,
    open: true,
    proxy: {
      "^/api/(auth|users)": {
        target: "http://localhost:7007",
        changeOrigin: true,
      },
      "^/api/(rooms|room-types)": {
        target: "http://localhost:7008",
        changeOrigin: true,
      },
      "^/api/(reservations|reservation-statuses)": {
        target: "http://localhost:7009",
        changeOrigin: true,
      },
      "^/api/payments": {
        target: "http://localhost:7010",
        changeOrigin: true,
      },
      "^/api/emails": {
        target: "http://localhost:7011",
        changeOrigin: true,
      },
    },
  },
});
