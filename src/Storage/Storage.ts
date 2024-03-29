import {
  type GuessLetterStructure,
  type Stats,
  type StorageStructure,
  type StoredGameStructure,
} from "../types";

class Storage implements StorageStructure {
  public game: StoredGameStructure = {
    currentGuessNumber: 0,
    previousGuesses: [],
    isComplete: false,
    usedKeys: [],
    lastWord: "",
  };

  public isDarkTheme = false;

  public hasWon = false;

  public statistics: Stats = {
    games: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    guesses1: 0,
    guesses2: 0,
    guesses3: 0,
    guesses4: 0,
    guesses5: 0,
    guesses6: 0,
    lastWinGuesses: 0,
  };

  constructor(
    private readonly storageCurrentGuessNumberName: string,
    private readonly storagePreviousGuessesName: string,
    private readonly storageIsCompleteName: string,
    private readonly storageUsedKeysName: string
  ) {
    this.getStoredGame();

    this.getDarkTheme();

    this.getHasWon();

    this.getStoredStats();
  }

  public setLastWord(word: string) {
    localStorage.setItem("lastWord", this.encodeWord(word));
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

  public saveIsNotComplete() {
    this.game.isComplete = false;
    localStorage.setItem(this.storageIsCompleteName, "false");
  }

  public addGuess(guess: GuessLetterStructure[]) {
    this.game.previousGuesses.push(guess);
    this.savePreviousGuesses();
  }

  public saveUsedKeys(keys: GuessLetterStructure[]) {
    const keys2 = this.game.usedKeys.map((key) => {
      const newKey = keys.find((obj2) => obj2.symbol === key.symbol);

      if (newKey) {
        return { symbol: key.symbol, status: newKey.status };
      }

      return key;
    });

    keys.forEach((obj2) => {
      const found = keys2.some((obj) => obj.symbol === obj2.symbol);
      if (!found) {
        keys2.push(obj2);
      }
    });

    this.game.usedKeys = keys2;
    localStorage.setItem(this.storageUsedKeysName, JSON.stringify(keys2));
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

  public getHasWon() {
    this.hasWon = JSON.parse(localStorage.getItem("has-won")!) as boolean;
  }

  public setHasWon(hasWon: boolean) {
    this.hasWon = hasWon;

    localStorage.setItem("has-won", String(hasWon));
  }

  public resetGame() {
    this.game.currentGuessNumber = 0;
    this.game.previousGuesses = [];
    this.game.isComplete = false;
    this.game.usedKeys = [];

    this.saveCurrentGuessNumber(this.game.currentGuessNumber);
    this.savePreviousGuesses();
    this.saveIsNotComplete();
    this.saveUsedKeys(this.game.usedKeys);
  }

  private getStoredStats() {
    const localStorageStats = localStorage.getItem("stats");
    if (!localStorageStats) {
      return;
    }

    const localStorageStatsData = JSON.parse(localStorageStats) as Stats;

    this.statistics = {
      ...this.statistics,
      ...localStorageStatsData,
    };
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

    const storedIsComplete =
      localStorage.getItem(this.storageIsCompleteName) === "true";

    if (storedIsComplete) {
      this.game.isComplete = storedIsComplete;
    }

    const storedUsedKeys = JSON.parse(
      localStorage.getItem(this.storageUsedKeysName)!
    ) as GuessLetterStructure[];

    if (storedUsedKeys) {
      this.game.usedKeys = storedUsedKeys;
    }

    const lastWord = localStorage.getItem("lastWord");

    if (lastWord) {
      this.game.lastWord = this.decodeWord(lastWord);
    }
  }

  private encodeWord(word: string) {
    return this.obfuscateWord(word);
  }

  private decodeWord(word: string) {
    return this.obfuscateWord(word);
  }

  private obfuscateWord(word: string): string {
    return word.replace(/[a-zA-Z]/gi, (text) =>
      String.fromCharCode(
        text.charCodeAt(0) + (text.toLowerCase() < "n" ? 13 : -13)
      )
    );
  }
}

export default Storage;
