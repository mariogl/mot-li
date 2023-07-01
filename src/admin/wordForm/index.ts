import auth from "../auth";
import Modal from "../modals/Modal";
import WordsApiRepository from "../repository/words/WordsApiRepository";
import { type WordDataStructure } from "../types";
import { adminUrls } from "../urls";

const currentUrl = new URL(window.location.href);

if (currentUrl.pathname === adminUrls.newWord) {
  const modal = new Modal();

  const form = document.querySelector(".form--admin")!;

  const word: HTMLInputElement = form.querySelector("#word")!;

  const token = auth.getToken();

  const wordsRepository = new WordsApiRepository(
    import.meta.env.VITE_API_URL,
    token
  );

  form.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    if (!word.value) {
      return;
    }

    if (word.value.length < 4 || word.value.length > 9) {
      modal.setMessage("El mot ha de tenir entre 4 i 9 lletres");
      modal.open();
      return;
    }

    const newWordData: WordDataStructure = {
      word: word.value,
    };

    try {
      await wordsRepository.addWord(newWordData);

      window.location.href = "admin-words.html?message=created";
    } catch (error) {
      let errorMessage: string;
      if ((error as Error).message.includes("409")) {
        errorMessage = "Aquesta paraula ja existeix.";
      } else {
        errorMessage = "Ha ocurregut un error";
      }

      modal.setMessage(errorMessage);
      modal.open();
    }
  });
}
