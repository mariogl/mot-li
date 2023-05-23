import Game from "./Game/Game";
import "./assets/scss/styles.scss";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/700.css";
import "@fontsource/saira-extra-condensed/600.css";
import GamesApiRepository from "./admin/repository/games/GamesApiRepository";
import CountDownTimer from "./CountDownTimer/CountDownTimer";

const gamesRepository = new GamesApiRepository(
  import.meta.env.VITE_API_URL,
  ""
);

new Game(gamesRepository);
