import { type BigModalOptions } from "./ui/BigModal";

export type KeyType = "letter" | "action";

export interface UserInterfaceStructure {
  guessToHtml(guessLetters: GuessLetterStructure[]): void;
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
  openSuperModal(type: SuperModalType): void;
  closeSuperModal(type: SuperModalType): void;
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
  getMenuTogglerElement(): HTMLElement;
  getMenuElement(): HTMLElement;
  toggleMenu(): void;
  closeMenu(): void;
  setLetterStatus(
    currentGuessNumber: number,
    letter: GuessLetterStructure,
    position: number
  ): void;
  openModal(text: string): void;
  closeModal(): void;
  openSuperModal(type: SuperModalType): void;
  closeSuperModal(type: SuperModalType): void;
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

export enum SuperModalType {
  won,
  lost,
}
