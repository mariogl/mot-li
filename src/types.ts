export type KeyType = "letter" | "action";

export interface UserInterfaceStructure {
  guessToHtml(guessLetters: GuessLetterStructure[]): void;
  setCurrentLetterElement(): void;
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
  keyLetters: string[];
}

export interface GameState {
  currentGuessNumber: number;
  currentGuessLetterPosition: number;
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
  checkGuessAgainstWord(): void;
  isComplete(): boolean;
}
