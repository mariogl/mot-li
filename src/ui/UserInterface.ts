/* eslint-disable @typescript-eslint/no-empty-function */
import {
  type StorageStructure,
  type DomAccessorStructure,
  type GameState,
  type GuessLetterStructure,
  type UserInterfaceStructure,
} from "../types";

class UserInterface implements UserInterfaceStructure {
  private readonly keyboard: HTMLElement;
  private readonly menu: HTMLElement;
  private readonly menuToggler: HTMLElement;

  constructor(
    readonly domAccessor: DomAccessorStructure,
    private readonly gameState: GameState,
    private readonly storage: StorageStructure
  ) {
    this.keyboard = domAccessor.getKeyboardElement();
    this.menuToggler = domAccessor.getMenuTogglerElement();
    this.menu = domAccessor.getMenuElement();

    this.keyboardAddEventListeners();
    this.menuAddEventListeners();
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

    document
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

  public setKeysStatus(letters: GuessLetterStructure[]) {
    const usedKeys: GuessLetterStructure[] = [];

    letters.forEach((letter) => {
      document.querySelectorAll(".keyboard__key").forEach((keyElement) => {
        if (letter.symbol === keyElement.textContent?.toLowerCase()) {
          keyElement.classList.remove(
            "keyboard__key--unused",
            "keyboard__key--present",
            "keyboard__key--correct",
            "keyboard__key--absent"
          );
          keyElement.classList.add(`keyboard__key--${letter.status}`);

          if (letter.status !== "unchecked") {
            usedKeys.push({ symbol: letter.symbol, status: letter.status });
          }
        }
      });
    });

    if (usedKeys.length > 0) {
      this.storage.saveUsedKeys(usedKeys);
    }
  }

  private keyboardRemoveEventListeners() {
    document.removeEventListener("keyup", this.handleActualKeyboardPress);

    this.keyboard.removeEventListener("click", this.handleVirtualKeyboardPress);
  }

  private readonly handleActualKeyboardPress = (event: KeyboardEvent) => {
    if (this.gameState.hasFinished) {
      return;
    }

    const pressedKey = event.key;

    this.onLetterPressed(pressedKey);
  };

  private readonly handleVirtualKeyboardPress = (event: MouseEvent) => {
    if (this.gameState.hasFinished) {
      return;
    }

    const pressedKey = event.target as HTMLButtonElement;

    this.onLetterPressed(pressedKey.textContent!);
  };

  private keyboardAddEventListeners() {
    document.addEventListener("keyup", this.handleActualKeyboardPress);

    this.keyboard.addEventListener("click", this.handleVirtualKeyboardPress);
  }

  private menuAddEventListeners() {
    this.menuToggler.addEventListener("click", () => {
      this.domAccessor.toggleMenu();
    });

    document.addEventListener("click", (event: MouseEvent) => {
      const clickedElement = event.target as HTMLElement;

      if (
        this.menuToggler.contains(clickedElement) ||
        this.menu.contains(clickedElement)
      ) {
        return;
      }

      this.domAccessor.closeMenu();
    });
  }
}

export default UserInterface;
