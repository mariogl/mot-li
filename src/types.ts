export type KeyType = "letter" | "action";

export interface UserInterfaceStructure {
  guessToHtml(guessLetters: GuessLetterStructure[]): void;
  setCurrentLetterElement(): void;
  cancelEvents(): void;
  setKeysStatus(letters: GuessLetterStructure[]): void;
  onLetterPressed(letter: string): void;
  onActionPressed(): void;
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
}

export interface StorageStructure {
  game: StoredGameStructure;
  saveCurrentGuessNumber: (currentGuessNumber: number) => void;
  saveIsComplete: () => void;
  saveUsedKeys: (keys: GuessLetterStructure[]) => void;
  addGuess: (guess: GuessLetterStructure[]) => void;
}

export enum SuperModalType {
  won,
  lost,
}
