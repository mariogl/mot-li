import auth from "../auth";
import Modal from "../modals/Modal";
import GamesApiRepository from "../repository/games/GamesApiRepository";
import { type GameDataStructure } from "../types";
import { adminUrls } from "../urls";

const currentUrl = new URL(window.location.href);

if (
  currentUrl.pathname === adminUrls.newGame ||
  currentUrl.pathname === adminUrls.editGame
) {
  const modal = new Modal();

  const isEditing = currentUrl.pathname === adminUrls.editGame;
  let gameId: string;

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

  if (isEditing) {
    gameId = new URLSearchParams(currentUrl.search).get("id")!;

    const loadingElement = document.querySelector(".loading")!;

    loadingElement.classList.add("on");
    form.classList.add("off");

    const game = await gamesRepository.getGameById(gameId);

    loadingElement.classList.remove("on");
    form.classList.remove("off");

    const date = new Date(game.date);
    wordDate.value = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDay()).padStart(2, "0")}`;
    wordWord.value = game.word;
    wordDefinition.innerHTML = game.definition;
    wordLink.value = game.link;
    wordTextLink.value = game.linkText;
    wordGuesses.value = `${game.guesses}`;
  }

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

    if (isEditing) {
      try {
        await gamesRepository.updateGame({
          ...newGameData,
          length: wordWord.value.length,
          id: gameId,
        });

        window.location.href = "admin-list.html?message=modified";
      } catch (error) {
        modal.setMessage(
          (error as Error).message.includes("409")
            ? "Ja existeix un joc per aquest dia. Prova una altra data"
            : "Ha ocurregut un error"
        );
        modal.open();
      }
    } else {
      try {
        await gamesRepository.addGame(newGameData);

        window.location.href = "admin-list.html?message=created";
      } catch (error) {
        modal.setMessage(
          (error as Error).message.includes("409")
            ? "Ja existeix un joc per aquest dia. Prova una altra data"
            : "Ha ocurregut un error"
        );
        modal.open();
      }
    }
  });
}
