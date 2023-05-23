import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        index: "index.html",
        admin: "admin-login.html",
      },
    },
  },
});
