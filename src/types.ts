export type KeyType = "letter" | "action";

export interface UserInterfaceStructure {
  onLetterPressed(letter: string): void;
  onActionPressed(): void;
}

export interface KeyStructure {
  symbol: string;
  type: KeyType;
  status: "unused" | "correct" | "absent";
}

export interface GuessLetterStructure {
  symbol: string;
  status: "unchecked" | "correct" | "present" | "absent";
}