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
import Storage from "../Storage/Storage";

class Game {
  private readonly config: Config = {
    wordToGuess: "potes",
    maxGuesses: 3,
    keyLetters: ["qwertyuiop", "asdfghjklç", "CzxcvbnmD"],
    storageCurrentGuessNumberName: "currentGuessNumber",
    storagePreviousGuessesName: "previousGuesses",
    isCompleteName: "isComplete",
  };

  private readonly gameState: GameState = {
    currentGuessNumber: 0,
    currentGuessLetterPosition: 0,
    hasFinished: false,
  };

  private readonly guess: GuessStructure;
  private readonly userInterface: UserInterfaceStructure;
  private readonly domAccessor: DomAccessorStructure;
  private readonly storage: Storage;

  constructor() {
    this.domAccessor = new DomAccessor();
    this.userInterface = new UserInterface(this.domAccessor, this.gameState);

    this.storage = new Storage(
      this.config.storageCurrentGuessNumberName,
      this.config.storagePreviousGuessesName,
      this.config.isCompleteName
    );

    this.gameState.hasFinished = this.storage.game.isComplete;

    const keyboardBuilder = new KeyboardBuilder(this.domAccessor, this.config);
    const guessBuilder = new GuessBuilder(
      this.config,
      this.domAccessor,
      this,
      this.storage
    );

    keyboardBuilder.build();
    guessBuilder.buildGuesses();

    this.setCurrentGuessNumber(this.storage.game.currentGuessNumber ?? 0);
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
      this.setCurrentGuessNumber(this.gameState.currentGuessNumber + 1);
      this.storage.saveCurrentGuessNumber(this.gameState.currentGuessNumber);
      return;
    }

    this.lose();
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
    this.userInterface.setCurrentLetterElement();
  }

  public setCurrentGuessNumber(number: number) {
    if (number >= this.config.maxGuesses) {
      this.lose();
      return;
    }

    this.gameState.currentGuessNumber = number;

    if (!this.gameState.hasFinished) {
      this.setCurrentGuessLetterPosition(0);
    }

    this.storage.saveCurrentGuessNumber(this.gameState.currentGuessNumber);
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

    this.storage.addGuess(this.guess.getCurrentGuess());

    this.incrementCurrentGuessNumber();
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
    this.userInterface.cancelEvents();
    this.gameState.hasFinished = true;
    this.storage.saveIsComplete();
  }

  private win() {
    this.userInterface.cancelEvents();
    this.gameState.hasFinished = true;
    this.storage.saveIsComplete();
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
