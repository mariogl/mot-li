import auth from "../auth";
import GamesApiRepository from "../repository/games/GamesApiRepository";

if (window.location.href.endsWith("admin-list.html")) {
  const token = auth.getToken();

  const gamesRepository = new GamesApiRepository(
    import.meta.env.VITE_API_URL as string,
    token
  );

  const games = await gamesRepository.getGames();

  const gamesListElement = document.querySelector(".games-list");
  const gameDummyElement = document.querySelector(".game-container--dummy")!;

  games.forEach((game) => {
    const gameElement = gameDummyElement.cloneNode(true) as HTMLElement;

    const gameWord = gameElement.querySelector(".game__word")!;
    gameWord.textContent = game.word;

    gameElement.classList.remove("game-container--dummy");

    gamesListElement?.appendChild(gameElement);
  });

  gameDummyElement.remove();
}