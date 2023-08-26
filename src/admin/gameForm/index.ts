import { normalizeWord } from "../../utils";
import auth from "../auth";
import Modal from "../modals/Modal";
import GamesApiRepository from "../repository/games/GamesApiRepository";
import WordsApiRepository from "../repository/words/WordsApiRepository";
import { type GameDataStructure } from "../types";
import { adminUrls, isValidUrl } from "../urls";

const currentUrl = new URL(window.location.href);

const convertTags = (html: string): string => {
  let newHtml = html.replaceAll("<b>", "<strong>");
  newHtml = newHtml.replaceAll("</b>", "</strong>");
  newHtml = newHtml.replaceAll("<i>", "<em>");
  newHtml = newHtml.replaceAll("</i>", "</em>");
  newHtml = newHtml.replace(/style="[^"]*"/g, "");

  return newHtml;
};

if (isValidUrl(adminUrls.newGame) || isValidUrl(adminUrls.editGame)) {
  const modal = new Modal();

  const isEditing = isValidUrl(adminUrls.editGame);
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
    import.meta.env.VITE_API_URL,
    token
  );

  const wordsRepository = new WordsApiRepository(
    import.meta.env.VITE_API_URL,
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

    wordDate.value = game.date.split("T")[0];
    wordWord.value = game.actualWord;
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

    const normalizedWord = normalizeWord(wordWord.value);

    if (!(await wordsRepository.doesWordExist(normalizedWord))) {
      modal.setMessage("Aquesta paraula no existeix, proveu-ne una altra.");
      modal.open();

      return;
    }

    const newGameData: GameDataStructure = {
      actualWord: wordWord.value,
      word: normalizedWord,
      date: wordDate.value,
      link: wordLink.value,
      linkText: wordTextLink.value,
      guesses: +wordGuesses.value,
      definition: convertTags(wordDefinition.innerHTML),
    };

    if (isEditing) {
      try {
        await gamesRepository.updateGame({
          ...newGameData,
          length: normalizedWord.length,
          id: gameId,
        });

        window.location.href = "admin-games.html?message=modified";
      } catch (error) {
        let errorMessage: string;
        if ((error as Error).message.includes("409")) {
          errorMessage =
            "Ja existeix un joc per aquest dia, proveu una altra data.";
        } else {
          errorMessage = "S'ha produït un error.";
        }

        modal.setMessage(errorMessage);
        modal.open();
      }
    } else {
      try {
        await gamesRepository.addGame(newGameData);

        window.location.href = "admin-games.html?message=created";
      } catch (error) {
        let errorMessage: string;
        if ((error as Error).message.includes("409")) {
          errorMessage =
            "Ja existeix un joc per aquest dia, proveu una altra data.";
        } else {
          errorMessage = "S'ha produït un error.";
        }

        modal.setMessage(errorMessage);
        modal.open();
      }
    }
  });

  wordWord.addEventListener("blur", async () => {
    if (!wordWord.value) {
      return;
    }

    const normalizedWord = normalizeWord(wordWord.value);

    if (!(await wordsRepository.doesWordExist(normalizedWord))) {
      modal.setMessage("Aquesta paraula no existeix, proveu-ne una altra.");
      modal.open();
    }

    if (await gamesRepository.isWordScheduled(normalizedWord)) {
      modal.setMessage(
        "Aquesta paraula ja està programada, proveu-ne una altra."
      );
      modal.open();
    }
  });
}
