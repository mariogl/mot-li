import { defineConfig } from "vite";

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        index: "index.html",
        admin: "admin-login.html",
        adminList: "admin-list.html",
        adminNewGame: "admin-new-game.html",
        adminEditGame: "admin-edit-game.html",
      },
    },
  },
});
