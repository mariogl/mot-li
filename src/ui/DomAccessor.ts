import { type DomAccessorStructure, type GuessLetterStructure } from "../types";

class DomAccessor implements DomAccessorStructure {
  private readonly guessesContainer: HTMLElement;
  private readonly keyboard: HTMLElement;
  private readonly keyboardKeys: NodeListOf<HTMLElement>;

  constructor() {
    this.guessesContainer = document.querySelector(".guesses")!;
    this.keyboard = document.querySelector(".keyboard")!;
    this.keyboardKeys = this.keyboard.querySelectorAll(".key");
  }

  public getCurrentGuessElement(currentGuessNumber: number): HTMLElement {
    return this.guessesContainer.querySelectorAll(".guess")[
      currentGuessNumber
    ] as HTMLElement;
  }

  public getCurrentGuessLettersElements(
    currentGuessNumber: number
  ): NodeListOf<HTMLElement> {
    return this.getCurrentGuessElement(currentGuessNumber).querySelectorAll(
      ".letter"
    );
  }

  public getKeyboardElement(): HTMLElement {
    return this.keyboard;
  }

  public getKeyboardKeyElements(): NodeListOf<HTMLElement> {
    return this.keyboardKeys;
  }

  public getGuessesContainer(): HTMLElement {
    return this.guessesContainer;
  }

  public setLetterStatus(
    currentGuessNumber: number,
    letter: GuessLetterStructure,
    position: number
  ) {
    const currentGuessLetterElement =
      this.getCurrentGuessLettersElements(currentGuessNumber)[position];

    currentGuessLetterElement.textContent = letter.symbol;
    currentGuessLetterElement.classList.remove("letter--unchecked");
    currentGuessLetterElement.classList.add(`letter--${letter.status}`);
  }
}

export default DomAccessor;
