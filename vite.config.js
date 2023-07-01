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
          adminList: "admin-games.html",
          adminNewGame: "admin-new-game.html",
          adminEditGame: "admin-edit-game.html",
          adminWords: "admin-words.html",
          adminNewWord: "admin-new-word.html",
        },
      },
    },
    server: {
      host: true,
      port: env.VITE_PORT,
    },
  };
});
