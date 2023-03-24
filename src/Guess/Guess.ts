import { type Config } from "../types";
import { type GuessLetterStructure } from "../types";

class Guess {
  private readonly currentGuess: GuessLetterStructure[];

  constructor(private readonly config: Config) {
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
}

export default Guess;
