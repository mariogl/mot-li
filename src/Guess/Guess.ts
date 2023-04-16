import {
  type GuessStructure,
  type Config,
  type UserInterfaceStructure,
} from "../types";
import { type GuessLetterStructure } from "../types";

class Guess implements GuessStructure {
  private currentGuess: GuessLetterStructure[] = [];

  constructor(
    private readonly config: Config,
    private readonly ui: UserInterfaceStructure
  ) {
    this.getNewBlankGuess();
  }

  public getNewBlankGuess() {
    this.currentGuess = Array(this.config.wordToGuess.length)
      .fill("")
      .map<GuessLetterStructure>(() => ({
        symbol: "",
        status: "unchecked",
      }));
  }

  public setLetterSymbol(position: number, symbol: string) {
    this.currentGuess[position].symbol = symbol;
  }

  public getCurrentGuess(): GuessLetterStructure[] {
    return this.currentGuess;
  }

  public getLetterSymbol(position: number): string {
    return this.currentGuess[position].symbol;
  }

  public checkGuessAgainstWord() {
    const word = this.config.wordToGuess.toLocaleLowerCase().split("");

    this.currentGuess.forEach((letter, position) => {
      if (word.at(position) === letter.symbol.toLocaleLowerCase()) {
        letter.status = "correct";
        word[position] = "0";
      }
    });

    this.currentGuess.forEach((letter, position) => {
      if (word.at(position) === "0") {
        return;
      }

      if (word.includes(letter.symbol.toLocaleLowerCase())) {
        letter.status = "present";
      } else {
        letter.status = "absent";
      }
    });

    this.ui.setKeysStatus(this.currentGuess);

    this.ui.guessToHtml(this.currentGuess);
  }

  public isCurrentGuessCorrect() {
    return this.currentGuess.every((letter) => letter.status === "correct");
  }

  public getCurrentGuessWord(): string {
    return this.currentGuess
      .map((letter) => letter.symbol.toLocaleLowerCase())
      .join("");
  }

  public isComplete(): boolean {
    return this.currentGuess.every((letter) => letter.symbol !== "");
  }
}

export default Guess;
