/* eslint-disable @typescript-eslint/no-empty-function */
import {
  type DomAccessorStructure,
  type GameState,
  type GuessLetterStructure,
  type UserInterfaceStructure,
} from "../types";

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

  public guessToHtml(guessLetters: GuessLetterStructure[]) {
    guessLetters.forEach((letter, position) => {
      this.domAccessor.setLetterStatus(
        this.gameState.currentGuessNumber,
        letter,
        position
      );
    });
  }

  public setCurrentLetterElement() {
    const currentGuess = this.domAccessor.getCurrentGuessElement(
      this.gameState.currentGuessNumber
    );
    currentGuess
      .querySelector(".letter--current")
      ?.classList.remove("letter--current");

    currentGuess
      .querySelector(
        `.letter:nth-child(${this.gameState.currentGuessLetterPosition + 1})`
      )
      ?.classList.add("letter--current");
  }

  public cancelEvents() {
    this.keyboardRemoveEventListeners();
  }

  private keyboardRemoveEventListeners() {
    document.removeEventListener("keyup", this.handleActualKeyboardPress);

    this.keyboard.removeEventListener("click", this.handleVirtualKeyboardPress);
  }

  private readonly handleActualKeyboardPress = (event: KeyboardEvent) => {
    const pressedKey = event.key;

    this.onLetterPressed(pressedKey);
  };

  private readonly handleVirtualKeyboardPress = (event: MouseEvent) => {
    const pressedKey = event.target as HTMLButtonElement;

    this.onLetterPressed(pressedKey.textContent!);
  };

  private keyboardAddEventListeners() {
    document.addEventListener("keyup", this.handleActualKeyboardPress);

    this.keyboard.addEventListener("click", this.handleVirtualKeyboardPress);
  }
}

export default UserInterface;
