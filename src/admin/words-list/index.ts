import { type AxiosError } from "axios";
import auth from "../auth";
import Modal from "../modals/Modal";
import AuthLocalStorageRepository from "../repository/localStorage/AuthLocalStorageRepository";
import WordsApiRepository from "../repository/words/WordsApiRepository";
import { adminUrls } from "../urls";

const currentUrl = new URL(window.location.href);

if (currentUrl.pathname === adminUrls.wordsList) {
  const message = new URLSearchParams(currentUrl.search).get("message");
  const modal = new Modal();

  if (message) {
    if (message === "created") {
      modal.setMessage("Mot creat");
    }

    modal.open();
  }

  const defaultLength = 4;
  const length =
    new URLSearchParams(currentUrl.search).get("length") ?? defaultLength;

  const token = auth.getToken();

  const wordsRepository = new WordsApiRepository(
    import.meta.env.VITE_API_URL,
    token
  );

  try {
    const lengthElement = document.querySelector(".length")!;

    lengthElement.textContent = `${length}`;

    const words = await wordsRepository.getWordsByLength(+length);

    const wordsListElement = document.querySelector(".games-list");
    const wordDummyElement = document.querySelector(".game-container--dummy")!;

    words.forEach((word) => {
      const wordElement = wordDummyElement.cloneNode(true) as HTMLElement;

      wordElement.dataset.id = word.id;

      const wordWord = wordElement.querySelector(".game__word")!;
      wordWord.textContent = word.word;

      wordElement.classList.remove("game-container--dummy");

      wordsListElement?.appendChild(wordElement);
    });

    wordDummyElement.remove();
  } catch (error) {
    if ((error as AxiosError).response!.status === 401) {
      auth.logoutUser();
      const authLocalStorageRepository = new AuthLocalStorageRepository();
      authLocalStorageRepository.logOut();
    }

    window.location.href = adminUrls.login;
  }
}
