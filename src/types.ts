export type KeyType = "letter" | "action";

export interface UserInterfaceStructure {
  guessToHtml(guessLetters: GuessLetterStructure[]): void;
  setCurrentLetterElement(): void;
  cancelEvents(): void;
  onLetterPressed(letter: string): void;
  onActionPressed(): void;
}

export interface KeyStructure {
  symbol: string;
  type: KeyType;
  status: "unused" | "valid" | "invalid" | "positioned";
}

export interface GuessLetterStructure {
  symbol: string;
  status: "unchecked" | "correct" | "present" | "absent";
}

export interface Config {
  maxGuesses: number;
  wordToGuess: string;
  allowedWords: Record<string, string[]>;
  keyLetters: string[];
  storageCurrentGuessNumberName: string;
  storagePreviousGuessesName: string;
  isCompleteName: string;
}

export interface GameState {
  currentGuessNumber: number;
  currentGuessLetterPosition: number;
  hasFinished: boolean;
}

export interface DomAccessorStructure {
  getCurrentGuessElement(currentGuessNumber: number): HTMLElement;
  getCurrentGuessLettersElements(
    currentGuessNumber: number
  ): NodeListOf<HTMLElement>;
  getKeyboardElement(): HTMLElement;
  getKeyboardKeyElements(): NodeListOf<HTMLElement>;
  getGuessesContainer(): HTMLElement;
  setLetterStatus(
    currentGuessNumber: number,
    letter: GuessLetterStructure,
    position: number
  ): void;
}

export interface GuessStructure {
  setLetterSymbol(position: number, symbol: string): void;
  getLetterSymbol(position: number): string;
  getCurrentGuess(): GuessLetterStructure[];
  getCurrentGuessWord(): string;
  getNewBlankGuess(): void;
  checkGuessAgainstWord(): void;
  isComplete(): boolean;
  isCurrentGuessCorrect(): boolean;
}

export interface StoredGameStructure {
  currentGuessNumber: number;
  previousGuesses: GuessLetterStructure[][];
  isComplete: boolean;
}

export interface StorageStructure {
  game: StoredGameStructure;
  saveCurrentGuessNumber: (currentGuessNumber: number) => void;
  saveIsComplete: () => void;
  addGuess: (guess: GuessLetterStructure[]) => void;
}
