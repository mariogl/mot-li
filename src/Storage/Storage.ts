import {
  type StorageStructure,
  type GuessLetterStructure,
  type StoredGameStructure,
} from "../types";

class Storage implements StorageStructure {
  public game: StoredGameStructure = {
    currentGuessNumber: 0,
    previousGuesses: [],
    isComplete: false,
  };

  constructor(
    private readonly storageCurrentGuessNumberName: string,
    private readonly storagePreviousGuessesName: string,
    private readonly storageIsCompleteName: string
  ) {
    this.getStoredGame();
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

  private emptyGameData() {
    localStorage.removeItem(this.storageCurrentGuessNumberName);
    localStorage.removeItem(this.storagePreviousGuessesName);
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
  }
}

export default Storage;
