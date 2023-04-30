import { type DomAccessorStructure, type GuessLetterStructure } from "../types";

class DomAccessor implements DomAccessorStructure {
  private readonly guessesContainer: HTMLElement;
  private readonly keyboard: HTMLElement;
  private readonly keyboardKeys: NodeListOf<HTMLElement>;
  private readonly menu: HTMLElement;
  private readonly menuToggler: HTMLElement;

  constructor() {
    this.guessesContainer = document.querySelector(".guesses")!;
    this.keyboard = document.querySelector(".keyboard")!;
    this.keyboardKeys = this.keyboard.querySelectorAll(".key");
    this.menu = document.querySelector(".menu__navigation")!;
    this.menuToggler = document.querySelector(".menu__toggle")!;
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

  public getMenuElement(): HTMLElement {
    return this.menu;
  }

  public getMenuTogglerElement(): HTMLElement {
    return this.menuToggler;
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

  public toggleMenu() {
    this.menu.classList.toggle("opened");
    this.menuToggler.classList.toggle("open");
  }

  public closeMenu() {
    this.menu.classList.remove("opened");
    this.menuToggler.classList.remove("open");
  }
}

export default DomAccessor;
