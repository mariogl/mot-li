import Guess from "../Guess/Guess";
import GuessBuilder from "../Guess/GuessBuilder";
import {
  type GameState,
  type Config,
  type DomAccessorStructure,
} from "../types";
import DomAccessor from "../ui/DomAccessor";
import KeyboardBuilder from "../ui/KeyboardBuilder";
import UserInterface from "../ui/UserInterface";

class Game {
  private readonly config: Config = {
    wordToGuess: "potes",
    maxGuesses: 3,
  };

  private readonly gameState: GameState = {
    currentGuessNumber: 0,
    currentGuessLetterPosition: 0,
  };

  constructor() {
    const domAccessor: DomAccessorStructure = new DomAccessor();
    const userInterface = new UserInterface(domAccessor, this.gameState);

    const keyboardBuilder = new KeyboardBuilder(domAccessor);
    const guessBuilder = new GuessBuilder(this.config, domAccessor, this);

    keyboardBuilder.build();
    guessBuilder.buildGuesses();

    userInterface.onLetterPressed = (letter: string) => {
      console.log(letter);
    };

    const guess = new Guess(this.config);
  }

  public incrementCurrentGuessNumber() {
    if (this.gameState.currentGuessNumber < this.config.maxGuesses - 1) {
      this.gameState.currentGuessNumber++;
    }
  }

  public incrementCurrentGuessLetterPosition() {
    if (
      this.gameState.currentGuessLetterPosition > this.config.wordToGuess.length
    ) {
      this.incrementCurrentGuessNumber();
      this.resetCurrentGuessLetterPosition();
      return;
    }

    this.gameState.currentGuessLetterPosition++;
  }

  public getCurrentGuessNumber(): number {
    return this.gameState.currentGuessNumber;
  }

  public getCurrentGuessLetterPosition(): number {
    return this.gameState.currentGuessLetterPosition;
  }

  public setCurrentGuessLetterPosition(position: number) {
    this.gameState.currentGuessLetterPosition = position;
  }

  private resetCurrentGuessLetterPosition() {
    this.gameState.currentGuessLetterPosition = 0;
  }
}

export default Game;
