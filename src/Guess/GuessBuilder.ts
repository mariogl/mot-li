import type Game from "../Game/Game";
import { type DomAccessorStructure, type Config } from "../types";

class GuessBuilder {
  constructor(
    private readonly config: Config,
    private readonly domAccessor: DomAccessorStructure,
    private readonly game: Game
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

    for (let i = 0; i < this.config.wordToGuess.length; i++) {
      const letter = document.createElement("div");
      letter.className = "letter letter--unchecked";

      letter.addEventListener("click", () => {
        if (
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
