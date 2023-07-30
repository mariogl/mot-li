import type BigModal from "./ui/BigModal";
import { type BigModalOptions } from "./ui/BigModal";

export type KeyType = "letter" | "action";

export interface UserInterfaceStructure {
  bigModalOpened: BigModal | undefined;
  guessToHtml(guessLetters: GuessLetterStructure[]): void;
  setCurrentDate(): void;
  setCurrentLetterElement(): void;
  cancelEvents(): void;
  setKeysStatus(letters: GuessLetterStructure[]): void;
  onLetterPressed(letter: string): void;
  onActionPressed(): void;
  createBigModal(
    type: string,
    actions?: Array<() => void>,
    options?: BigModalOptions
  ): void;
  openModal(text: string): void;
  closeModal(): void;
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
  originalWordToGuess: string;
  wordToGuess: string;
  allowedWords: string[];
  keyLetters: string[];
  storageCurrentGuessNumberName: string;
  storagePreviousGuessesName: string;
  storageUsedKeysName: string;
  isCompleteName: string;
  wordLink: string;
  wordLinkText: string;
  wordDefinition: string;
}

export interface GameState {
  currentGuessNumber: number;
  currentGuessLetterPosition: number;
  hasFinished: boolean;
  hasWon: boolean;
}

export interface DomAccessorStructure {
  getCurrentGuessElement(currentGuessNumber: number): HTMLElement;
  getCurrentGuessLettersElements(
    currentGuessNumber: number
  ): NodeListOf<HTMLElement>;
  getKeyboardElement(): HTMLElement;
  getKeyboardKeyElements(): NodeListOf<HTMLElement>;
  getCountdown(): HTMLElement;
  getGuessesContainer(): HTMLElement;
  setLetterStatus(
    currentGuessNumber: number,
    letter: GuessLetterStructure,
    position: number
  ): void;
  openModal(text: string): void;
  closeModal(): void;
  getStatisticsOpener(): HTMLElement;
  getOptionsOpener(): HTMLElement;
  getInfoOpener(): HTMLElement;
  getThemeSwitcher(): HTMLElement;
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
  usedKeys: GuessLetterStructure[];
  lastWord: string;
}

export interface Stats {
  games: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guesses1: number;
  guesses2: number;
  guesses3: number;
  guesses4: number;
  guesses5: number;
  guesses6: number;
  lastWinGuesses: number;
}

export interface StorageStructure {
  game: StoredGameStructure;
  isDarkTheme: boolean;
  statistics: Stats;
  resetGame: () => void;
  setLastWord: (word: string) => void;
  saveCurrentGuessNumber: (currentGuessNumber: number) => void;
  saveIsComplete: () => void;
  saveUsedKeys: (keys: GuessLetterStructure[]) => void;
  addGuess: (guess: GuessLetterStructure[]) => void;
  setDarkTheme: (isDark: boolean) => void;
}
