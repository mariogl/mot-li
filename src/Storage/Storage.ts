import {
  type StorageStructure,
  type GuessLetterStructure,
  type StoredGameStructure,
  type Stats,
} from "../types";

class Storage implements StorageStructure {
  public game: StoredGameStructure = {
    currentGuessNumber: 0,
    previousGuesses: [],
    isComplete: false,
    usedKeys: [],
  };

  public isDarkTheme = false;

  public statistics: Stats = { games: 1, wins: 0 };

  constructor(
    private readonly storageCurrentGuessNumberName: string,
    private readonly storagePreviousGuessesName: string,
    private readonly storageIsCompleteName: string,
    private readonly storageUsedKeysName: string
  ) {
    this.getStoredGame();

    this.getDarkTheme();

    this.getStoredStats();
  }

  public saveCurrentGuessNumber(currentGuessNumber: number) {
    localStorage.setItem(
      this.storageCurrentGuessNumberName,
      `${currentGuessNumber}`
    );
  }

  public savePreviousGuesses() {
    localStorage.setItem(
      this.storagePreviousGuessesName,
      JSON.stringify(this.game.previousGuesses)
    );
  }

  public saveIsComplete() {
    this.game.isComplete = true;
    localStorage.setItem(this.storageIsCompleteName, "true");
  }

  public addGuess(guess: GuessLetterStructure[]) {
    this.game.previousGuesses.push(guess);
    this.savePreviousGuesses();
  }

  public saveUsedKeys(keys: GuessLetterStructure[]) {
    this.game.usedKeys = keys;
    localStorage.setItem(this.storageUsedKeysName, JSON.stringify(keys));
  }

  public getDarkTheme() {
    this.isDarkTheme = localStorage.getItem("theme") === "dark";
  }

  public setDarkTheme(isDark: boolean) {
    this.isDarkTheme = isDark;

    localStorage.setItem("theme", isDark ? "dark" : "light");
  }

  public setStats(key: string, number: number) {
    this.statistics[key as keyof Stats] = number;

    localStorage.setItem("stats", JSON.stringify(this.statistics));
  }

  private getStoredStats() {
    const localStorageStats = localStorage.getItem("stats");
    if (!localStorageStats) {
      return;
    }

    this.statistics = JSON.parse(localStorageStats) as Stats;
  }

  private getStoredGame() {
    const storedCurrentGuessNumber = localStorage.getItem(
      this.storageCurrentGuessNumberName
    );

    if (storedCurrentGuessNumber) {
      this.game.currentGuessNumber = +storedCurrentGuessNumber;
    }

    const storedPreviousGuesses = JSON.parse(
      localStorage.getItem(this.storagePreviousGuessesName)!
    ) as GuessLetterStructure[][];

    if (storedPreviousGuesses) {
      this.game.previousGuesses = storedPreviousGuesses;
    }

    const storedIsComplete = !!localStorage.getItem(this.storageIsCompleteName);

    if (storedIsComplete) {
      this.game.isComplete = storedIsComplete;
    }

    const storedUsedKeys = JSON.parse(
      localStorage.getItem(this.storageUsedKeysName)!
    ) as GuessLetterStructure[];

    if (storedUsedKeys) {
      this.game.usedKeys = storedUsedKeys;
    }
  }
}

export default Storage;
