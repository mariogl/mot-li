import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/saira-extra-condensed/600.css";
import Game from "./Game/Game";
import GamesApiRepository from "./admin/repository/games/GamesApiRepository";
import "./assets/scss/styles.scss";

const gamesRepository = new GamesApiRepository(
  import.meta.env.VITE_API_URL,
  ""
);

new Game(gamesRepository);
