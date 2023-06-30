import { type AxiosError } from "axios";
import auth from "../auth";
import BigModal from "../modals/BigModal";
import Modal from "../modals/Modal";
import GamesApiRepository from "../repository/games/GamesApiRepository";
import AuthLocalStorageRepository from "../repository/localStorage/AuthLocalStorageRepository";
import { adminUrls } from "../urls";

const currentUrl = new URL(window.location.href);

if (currentUrl.pathname === adminUrls.gamesList) {
  const message = new URLSearchParams(currentUrl.search).get("message");
  const modal = new Modal();
  const deleteModal = new BigModal(async (id: string) => {
    await gamesRepository.deleteGame(id);

    document.querySelector(`.game-container[data-id='${id}']`)?.remove();

    modal.setMessage("Joc esborrat");
    modal.open();
  });

  if (message) {
    if (message === "created") {
      modal.setMessage("Joc creat");
    } else if (message === "modified") {
      modal.setMessage("Joc editat i desat");
    }

    modal.open();
  }

  const token = auth.getToken();

  const gamesRepository = new GamesApiRepository(
    import.meta.env.VITE_API_URL,
    token
  );

  try {
    const games = await gamesRepository.getGames();

    const gamesListElement = document.querySelector(".games-list");
    const gameDummyElement = document.querySelector(".game-container--dummy")!;

    games.forEach((game) => {
      const gameElement = gameDummyElement.cloneNode(true) as HTMLElement;

      gameElement.dataset.id = game.id;

      const gameWord = gameElement.querySelector(".game__word")!;
      gameWord.textContent = game.word;

      const gameDate = gameElement.querySelector(".game__date")!;
      gameDate.textContent = new Date(game.date).toLocaleDateString("ca-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const gameEditLink: HTMLAnchorElement =
        gameElement.querySelector(".button--edit")!;
      gameEditLink.href += `?id=${game.id}`;

      const gameDeleteButton = gameElement.querySelector(".button--delete")!;
      gameDeleteButton.addEventListener("click", () => {
        deleteModal.open(game.id);
      });

      gameElement.classList.remove("game-container--dummy");

      gamesListElement?.appendChild(gameElement);
    });

    gameDummyElement.remove();
  } catch (error) {
    if ((error as AxiosError).response!.status === 401) {
      auth.logoutUser();
      const authLocalStorageRepository = new AuthLocalStorageRepository();
      authLocalStorageRepository.logOut();
    }

    window.location.href = adminUrls.login;
  }
}
