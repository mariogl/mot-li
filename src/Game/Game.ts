import Guess from "../Guess/Guess";
import GuessBuilder from "../Guess/GuessBuilder";
import {
  type GameState,
  type Config,
  type DomAccessorStructure,
  type GuessStructure,
  type UserInterfaceStructure,
  SuperModalType,
} from "../types";
import DomAccessor from "../ui/DomAccessor";
import KeyboardBuilder from "../ui/KeyboardBuilder";
import UserInterface from "../ui/UserInterface";
import Storage from "../Storage/Storage";
import allowedWordsWith4Letters from "../allowedWords/words4.js";
import allowedWordsWith5Letters from "../allowedWords/words5.js";
import allowedWordsWith6Letters from "../allowedWords/words6.js";
import allowedWordsWith7Letters from "../allowedWords/words7.js";
import allowedWordsWith8Letters from "../allowedWords/words8.js";
import allowedWordsWith9Letters from "../allowedWords/words9.js";
import { type GamesRepository } from "../admin/repository/games/types";

class Game {
  private readonly config: Config = {
    wordToGuess: "",
    allowedWords: {
      l4: allowedWordsWith4Letters,
      l5: allowedWordsWith5Letters,
      l6: allowedWordsWith6Letters,
      l7: allowedWordsWith7Letters,
      l8: allowedWordsWith8Letters,
      l9: allowedWordsWith9Letters,
    },
    maxGuesses: 0,
    keyLetters: ["qwertyuiop", "asdfghjklç", "CzxcvbnmD"],
    storageCurrentGuessNumberName: "currentGuessNumber",
    storagePreviousGuessesName: "previousGuesses",
    storageUsedKeysName: "usedKeys",
    isCompleteName: "isComplete",
  };

  private readonly gameState: GameState = {
    currentGuessNumber: 0,
    currentGuessLetterPosition: 0,
    hasFinished: false,
  };

  private readonly domAccessor: DomAccessorStructure;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  private guess: GuessStructure = {} as GuessStructure;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  private userInterface: UserInterfaceStructure = {} as UserInterfaceStructure;
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  private storage: Storage = {} as Storage;

  constructor(gamesRepository: GamesRepository) {
    this.domAccessor = new DomAccessor();

    (async () => {
      const gameOfTheDay = await gamesRepository.getCurrentGame();

      this.config.wordToGuess = gameOfTheDay.word;
      this.config.maxGuesses = gameOfTheDay.guesses;

      this.startGame();
    })();
  }

  startGame() {
    this.storage = new Storage(
      this.config.storageCurrentGuessNumberName,
      this.config.storagePreviousGuessesName,
      this.config.isCompleteName,
      this.config.storageUsedKeysName
    );

    this.userInterface = new UserInterface(
      this.domAccessor,
      this.gameState,
      this.storage
    );

    this.guess = new Guess(this.config, this.userInterface);

    this.gameState.hasFinished = this.storage.game.isComplete;

    const keyboardBuilder = new KeyboardBuilder(
      this.domAccessor,
      this.config,
      this.storage
    );

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
  }

  public incrementCurrentGuessNumber() {
    if (this.gameState.currentGuessNumber < this.config.maxGuesses - 1) {
      this.setCurrentGuessNumber(this.gameState.currentGuessNumber + 1);
      this.storage.saveCurrentGuessNumber(this.gameState.currentGuessNumber);
      return;
    }

    this.lost();
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
      this.lost();
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
      this.userInterface.openModal("No hi ha prou lletres");

      return;
    }

    if (
      !this.config.allowedWords[`l${this.config.wordToGuess.length}`].includes(
        this.guess.getCurrentGuessWord()
      )
    ) {
      this.userInterface.openModal("Paraula no trobada");

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

  private endGame() {
    this.userInterface.cancelEvents();
    this.gameState.hasFinished = true;
    this.storage.saveIsComplete();
  }

  private lost() {
    this.userInterface.openSuperModal(SuperModalType.lost);

    this.endGame();
  }

  private win() {
    this.userInterface.openSuperModal(SuperModalType.won);

    this.endGame();
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
