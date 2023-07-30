import Guess from "../Guess/Guess";
import GuessBuilder from "../Guess/GuessBuilder";
import Storage from "../Storage/Storage";
import { type GamesRepository } from "../admin/repository/games/types";
import {
  type Config,
  type DomAccessorStructure,
  type GameState,
  type GuessStructure,
  type Stats,
  type UserInterfaceStructure,
} from "../types";
import DomAccessor from "../ui/DomAccessor";
import KeyboardBuilder from "../ui/KeyboardBuilder";
import UserInterface from "../ui/UserInterface";
import { normalizeWord } from "../utils";

class Game {
  private readonly config: Config = {
    originalWordToGuess: "",
    wordToGuess: "",
    wordDefinition: "",
    wordLink: "",
    wordLinkText: "",
    allowedWords: [],
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

      this.config.wordToGuess = normalizeWord(gameOfTheDay.word);
      this.config.originalWordToGuess = gameOfTheDay.actualWord;
      this.config.maxGuesses = gameOfTheDay.guesses;
      this.config.wordLink = gameOfTheDay.link;
      this.config.wordLinkText = gameOfTheDay.linkText;
      this.config.wordDefinition = gameOfTheDay.definition;

      this.startGame();

      const allowedWords = await gamesRepository.getAllowedWordsByLength(
        gameOfTheDay.length
      );

      this.config.allowedWords = allowedWords.map((word) => word.word);
    })();
  }

  startGame() {
    this.storage = new Storage(
      this.config.storageCurrentGuessNumberName,
      this.config.storagePreviousGuessesName,
      this.config.isCompleteName,
      this.config.storageUsedKeysName
    );

    if (this.storage.game.lastWord !== this.config.wordToGuess) {
      this.storage.resetGame();
    }

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

    this.userInterface.setCurrentDate();
    this.userInterface.onLetterPressed = (pressedKey: string) => {
      const key = pressedKey.toLocaleLowerCase();

      if (key === "backspace" || key === "esborrar") {
        this.deleteLetter();
      } else if (key === "enter" || key === "envia") {
        this.checkGuess();
      } else if (
        this.config.keyLetters.some((lettersGroup) =>
          lettersGroup.includes(key)
        )
      ) {
        this.userInterface.closeModal();
        this.userInterface.bigModalOpened?.close();
        this.setLetterAndAdvance(key);
      }
    };

    if (this.gameState.hasFinished) {
      this.openSolutionModal();
    }
  }

  public openSolutionModal() {
    const openStatistics = () => {
      this.userInterface.createBigModal("statistics", [], {
        statistics: this.storage.statistics,
      });
    };

    const copyToClipboard = async () => {
      const today = new Date();

      const day = `${today.getDate()}`.padStart(2, "0");
      const month = `${today.getMonth() + 1}`.padStart(2, "0");
      const year = today.getFullYear();

      const todayFormattedDate = `${day}/${month}/${year}`;

      const textToCopy = `He trobat el #Mot-li! d'avui (${todayFormattedDate}) en ${
        this.gameState.currentGuessNumber + 1
      } intents.\nVoleu provar-ho?\n${import.meta.env.VITE_APP_URL}`;

      await navigator.clipboard.writeText(textToCopy);

      this.userInterface.openModal("Copiat");
    };

    this.userInterface.createBigModal(
      "solution",
      [copyToClipboard, openStatistics],
      {
        solution: {
          word: this.config.originalWordToGuess,
          definition: this.config.wordDefinition,
          link: this.config.wordLink,
          linkText: this.config.wordLinkText,
        },
      }
    );
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

    if (!this.config.allowedWords.includes(this.guess.getCurrentGuessWord())) {
      this.userInterface.openModal("Mot no trobat, esborra'l i torna-hi");

      return;
    }

    this.guess.checkGuessAgainstWord();

    this.storage.addGuess(this.guess.getCurrentGuess());

    this.storage.setLastWord(this.config.wordToGuess);

    if (this.guess.isCurrentGuessCorrect()) {
      this.win();
      return;
    }

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
    this.storage.setStats("games", this.storage.statistics.games + 1);
  }

  private lost() {
    this.storage.setStats("currentStreak", 0);

    this.userInterface.openModal(
      "Oh! No has trobat el mot d'avui. Torna-hi demà."
    );

    setTimeout(() => {
      this.openSolutionModal();
    }, 2000);

    this.endGame();
  }

  private win() {
    this.storage.setStats("wins", this.storage.statistics.wins + 1);
    this.storage.setStats(
      "currentStreak",
      this.storage.statistics.currentStreak + 1
    );

    if (
      this.storage.statistics.currentStreak > this.storage.statistics.maxStreak
    ) {
      this.storage.setStats("maxStreak", this.storage.statistics.currentStreak);
    }

    this.storage.statistics.lastWinGuesses =
      this.gameState.currentGuessNumber + 1;
    this.storage.statistics[
      `guesses${this.storage.statistics.lastWinGuesses}` as keyof Stats
    ]++;

    let winMessage: string;

    switch (this.storage.statistics.lastWinGuesses) {
      case 1:
        winMessage = "Increïble!";
        break;
      case 2:
        winMessage = "Excel·lent!";
        break;
      case 3:
        winMessage = "Fantàstic!";
        break;
      case 4:
        winMessage = "Justa la fusta!";
        break;
      case 5:
        winMessage = "Molt bé!";
        break;
      case 6:
        winMessage = "Bé!";
        break;
      case 7:
        winMessage = "Gairebé!";
        break;
      case 8:
        winMessage = "Pels pèls!";
        break;
      default:
        winMessage = "Has guanyat";
    }

    this.userInterface.openModal(winMessage);

    setTimeout(() => {
      this.openSolutionModal();
    }, 2000);

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
