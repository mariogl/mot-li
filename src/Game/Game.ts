import Guess from "../Guess/Guess";
import GuessBuilder from "../Guess/GuessBuilder";
import {
  type GameState,
  type Config,
  type DomAccessorStructure,
  type GuessStructure,
  type UserInterfaceStructure,
} from "../types";
import DomAccessor from "../ui/DomAccessor";
import KeyboardBuilder from "../ui/KeyboardBuilder";
import UserInterface from "../ui/UserInterface";

class Game {
  private readonly config: Config = {
    wordToGuess: "potes",
    maxGuesses: 3,
    keyLetters: ["qwertyuiop", "asdfghjklç", "CzxcvbnmD"],
  };

  private readonly gameState: GameState = {
    currentGuessNumber: 0,
    currentGuessLetterPosition: 0,
    hasFinished: false,
  };

  private readonly guess: GuessStructure;
  private readonly userInterface: UserInterfaceStructure;
  private readonly domAccessor: DomAccessorStructure;

  constructor() {
    this.domAccessor = new DomAccessor();
    this.userInterface = new UserInterface(this.domAccessor, this.gameState);

    const keyboardBuilder = new KeyboardBuilder(this.domAccessor, this.config);
    const guessBuilder = new GuessBuilder(this.config, this.domAccessor, this);

    keyboardBuilder.build();
    guessBuilder.buildGuesses();

    this.userInterface.onLetterPressed = (pressedKey: string) => {
      const key = pressedKey.toLocaleLowerCase();

      if (key === "backspace" || key === "esb") {
        this.deleteLetter();
      } else if (key === "enter" || key === "env") {
        this.checkGuess();
      } else if (
        this.config.keyLetters.some((lettersGroup) =>
          lettersGroup.includes(key)
        )
      ) {
        this.setLetterAndAdvance(key);
      }
    };

    this.guess = new Guess(this.config, this.userInterface);
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
    this.setCurrentLetterElement();
  }

  public setCurrentGuessNumber(number: number) {
    if (number >= this.config.maxGuesses) {
      this.lose();
      return;
    }

    this.gameState.currentGuessNumber = number;
    this.setCurrentGuessLetterPosition(0);
  }

  public setLetterAndAdvance(symbol: string) {
    this.setLetter(symbol);

    if (
      this.gameState.currentGuessLetterPosition >=
      this.config.wordToGuess.length
    ) {
      return;
    }

    this.setCurrentGuessLetterPosition(
      this.gameState.currentGuessLetterPosition + 1
    );

    this.userInterface.setCurrentLetterElement();
  }

  public checkGuess() {
    if (!this.guess.isComplete()) {
      return;
    }

    this.guess.checkGuessAgainstWord();

    if (this.guess.isCurrentGuessCorrect()) {
      this.win();
      return;
    }

    this.setCurrentGuessNumber(this.gameState.currentGuessNumber + 1);
    this.guess.getNewBlankGuess();
  }

  public deleteLetter() {
    if (this.gameState.currentGuessLetterPosition === 0) {
      return;
    }

    if (
      this.gameState.currentGuessLetterPosition >=
        this.config.wordToGuess.length ||
      this.guess.getLetterSymbol(this.gameState.currentGuessLetterPosition) ===
        ""
    ) {
      this.setCurrentGuessLetterPosition(
        this.gameState.currentGuessLetterPosition - 1
      );
    }

    this.setLetter("");
  }

  public hasFinished() {
    return this.gameState.hasFinished;
  }

  private lose() {
    // eslint-disable-next-line no-console
    console.log("You loose");
    this.userInterface.cancelEvents();
    this.gameState.hasFinished = true;
  }

  private win() {
    // eslint-disable-next-line no-console
    console.log("You won");
    this.userInterface.cancelEvents();
    this.gameState.hasFinished = true;
  }

  private setCurrentLetterElement() {
    const currentGuess = this.domAccessor.getCurrentGuessElement(
      this.gameState.currentGuessNumber
    );
    currentGuess
      .querySelector(".letter--current")
      ?.classList.remove("letter--current");

    currentGuess
      .querySelector(
        `.letter:nth-child(${this.gameState.currentGuessLetterPosition + 1})`
      )
      ?.classList.add("letter--current");
  }

  private setLetter(symbol: string) {
    if (
      this.gameState.currentGuessLetterPosition >=
      this.config.wordToGuess.length
    ) {
      return;
    }

    this.guess.setLetterSymbol(
      this.gameState.currentGuessLetterPosition,
      symbol
    );

    this.userInterface.guessToHtml(this.guess.getCurrentGuess());
  }

  private resetCurrentGuessLetterPosition() {
    this.gameState.currentGuessLetterPosition = 0;
  }
}

export default Game;
