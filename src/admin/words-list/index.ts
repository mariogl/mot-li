import { type AxiosError } from "axios";
import auth from "../auth";
import BigModal from "../modals/BigModal";
import Modal from "../modals/Modal";
import AuthLocalStorageRepository from "../repository/localStorage/AuthLocalStorageRepository";
import WordsApiRepository from "../repository/words/WordsApiRepository";
import { adminUrls } from "../urls";

const currentUrl = new URL(window.location.href);

if (currentUrl.pathname === adminUrls.wordsList) {
  const message = new URLSearchParams(currentUrl.search).get("message");
  const modal = new Modal();

  const deleteModal = new BigModal(async (id: string) => {
    await wordsRepository.deleteWord(id);

    document.querySelector(`.game-container[data-id='${id}']`)?.remove();

    modal.setMessage("Mot esborrat");
    modal.open();
  });

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

      const wordDeleteButton = wordElement.querySelector(".button--delete")!;

      wordDeleteButton.addEventListener("click", () => {
        deleteModal.open(word.id);
      });

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
