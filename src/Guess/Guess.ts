import { type GuessStructure, type Config } from "../types";
import { type GuessLetterStructure } from "../types";

class Guess implements GuessStructure {
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

  public getLetterSymbol(position: number): string {
    return this.currentGuess[position].symbol;
  }
}

export default Guess;
