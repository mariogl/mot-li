import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
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
    server: {
      host: true,
      port: env.VITE_PORT,
    },
  };
});
