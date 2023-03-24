/* eslint-disable @typescript-eslint/no-empty-function */
import {
  type DomAccessorStructure,
  type GameState,
  type GuessLetterStructure,
  type UserInterfaceStructure,
} from "../types";
import type DomAccessor from "./DomAccessor";

class UserInterface implements UserInterfaceStructure {
  private readonly keyboard: HTMLElement;

  constructor(
    readonly domAccessor: DomAccessorStructure,
    private readonly gameState: GameState
  ) {
    this.keyboard = domAccessor.getKeyboardElement();

    this.keyboardAddEventListeners();
  }

  public onLetterPressed(letter: string) {}

  public onActionPressed() {}

  public guessToHtml = (guessLetters: GuessLetterStructure[]) => {
    guessLetters.forEach((letter, position) => {
      this.domAccessor.setLetterStatus(
        this.gameState.currentGuessNumber,
        letter,
        position
      );
    });
  };

  private keyboardAddEventListeners() {
    document.addEventListener("keyup", (event) => {
      const pressedKey = event.key;

      this.onLetterPressed(pressedKey);
    });

    this.keyboard.addEventListener("click", (event) => {
      const pressedKey = event.target as HTMLButtonElement;

      if (pressedKey.dataset.type === "letter") {
        this.onLetterPressed(pressedKey.textContent!);
      }
    });
  }
}

export default UserInterface;
