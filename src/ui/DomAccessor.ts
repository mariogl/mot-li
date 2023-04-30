import {
  SuperModalType,
  type DomAccessorStructure,
  type GuessLetterStructure,
} from "../types";

class DomAccessor implements DomAccessorStructure {
  private readonly guessesContainer: HTMLElement;
  private readonly keyboard: HTMLElement;
  private readonly keyboardKeys: NodeListOf<HTMLElement>;
  private readonly menu: HTMLElement;
  private readonly menuToggler: HTMLElement;
  private readonly modal: HTMLElement;
  private readonly superModals: Record<SuperModalType, HTMLElement>;

  constructor() {
    this.guessesContainer = document.querySelector(".guesses")!;
    this.keyboard = document.querySelector(".keyboard")!;
    this.keyboardKeys = this.keyboard.querySelectorAll(".key");
    this.menu = document.querySelector(".menu__navigation")!;
    this.menuToggler = document.querySelector(".menu__toggle")!;
    this.modal = document.querySelector(".modal")!;
    this.superModals = {
      [SuperModalType.won]: document.querySelector(".supermodal--won")!,
      [SuperModalType.lost]: document.querySelector(".supermodal--lost")!,
    };
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

  public openModal(text: string) {
    this.modal.textContent = text;
    this.modal.classList.add("modal--open");
  }

  public closeModal() {
    this.modal.textContent = "";
    this.modal.classList.remove("modal--open");
  }

  public openSuperModal(type: SuperModalType): void {
    this.superModals[type].classList.add("supermodal--open");
  }

  public closeSuperModal(type: SuperModalType): void {
    this.superModals[type].classList.remove("supermodal--open");
  }
}

export default DomAccessor;
