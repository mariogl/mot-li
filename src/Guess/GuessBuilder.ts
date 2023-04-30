import type Game from "../Game/Game";
import {
  type DomAccessorStructure,
  type Config,
  type StorageStructure,
} from "../types";

class GuessBuilder {
  constructor(
    private readonly config: Config,
    private readonly domAccessor: DomAccessorStructure,
    private readonly game: Game,
    private readonly storage: StorageStructure
  ) {}

  public buildGuesses() {
    for (let i = 0; i < this.config.maxGuesses; i++) {
      this.createGuess(i);
    }
  }

  private createGuess(number: number) {
    const guess = document.createElement("div");
    guess.className = "guess";
    guess.dataset.number = `${number}`;
    guess.dataset.letters = `${this.config.wordToGuess.length}`;

    for (let i = 0; i < this.config.wordToGuess.length; i++) {
      const letter = document.createElement("div");
      letter.className = "letter";
      if (this.storage.game.previousGuesses.length <= number) {
        letter.classList.add("letter--unchecked");
      } else {
        letter.classList.add(
          `letter--${this.storage.game.previousGuesses[number][i].status}`
        );
        letter.textContent =
          this.storage.game.previousGuesses[number][i].symbol;
      }

      letter.addEventListener("click", () => {
        if (
          this.game.hasFinished() ||
          this.domAccessor.getCurrentGuessElement(
            this.game.getCurrentGuessNumber()
          ).dataset.number !== guess.dataset.number
        ) {
          return;
        }

        this.game.setCurrentGuessLetterPosition(i);
      });

      guess.appendChild(letter);
    }

    this.domAccessor.getGuessesContainer().appendChild(guess);
  }
}

export default GuessBuilder;
