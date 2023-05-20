import auth from "../auth";
import GamesApiRepository from "../repository/games/GamesApiRepository";
import { type GameDataStructure } from "../types";

const currentUrl = new URL(window.location.href);

if (currentUrl.pathname === "/admin-new-game.html") {
  const form = document.querySelector(".form--admin")!;

  const wordDate: HTMLInputElement = form.querySelector("#dateGame")!;
  const wordWord: HTMLInputElement = form.querySelector("#wordToGuess")!;
  const wordLink: HTMLInputElement = form.querySelector("#urlLink")!;
  const wordTextLink: HTMLInputElement = form.querySelector("#textLink")!;
  const wordDefinition = form.querySelector("[data-tiny-editor]")!;
  const wordGuesses: HTMLInputElement = form.querySelector("#numGuesses")!;

  const token = auth.getToken();

  const gamesRepository = new GamesApiRepository(
    import.meta.env.VITE_API_URL as string,
    token
  );

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    if (
      !wordDate.value ||
      !wordWord.value ||
      !wordDefinition.innerHTML ||
      !wordGuesses.value ||
      !wordLink.value ||
      !wordTextLink.value
    ) {
      return;
    }

    const newGameData: GameDataStructure = {
      word: wordWord.value,
      date: new Date(wordDate.value),
      link: wordLink.value,
      linkText: wordTextLink.value,
      guesses: +wordGuesses.value,
      definition: wordDefinition.innerHTML,
    };

    try {
      await gamesRepository.addGame(newGameData);

      window.location.href = "admin-list.html?message=created";
    } catch (error) {
      // Cambiar por toast
      // eslint-disable-next-line no-console
      console.log(error);
    }
  });
}
