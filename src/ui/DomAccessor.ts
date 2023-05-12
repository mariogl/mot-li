import {
  SuperModalType,
  type DomAccessorStructure,
  type GuessLetterStructure,
  BigModalType,
} from "../types";

class DomAccessor implements DomAccessorStructure {
  private readonly guessesContainer: HTMLElement;
  private readonly keyboard: HTMLElement;
  private readonly keyboardKeys: NodeListOf<HTMLElement>;
  private readonly menu: HTMLElement;
  private readonly menuToggler: HTMLElement;
  private readonly modal: HTMLElement;
  private readonly superModals: Record<SuperModalType, HTMLElement>;
  private readonly bigModals: Record<BigModalType, HTMLElement>;
  private readonly bigModalStatistics: HTMLElement;
  private readonly bigModalSolution: HTMLElement;
  private readonly body: HTMLElement;
  private readonly buttonClose: HTMLElement;
  private readonly buttonStatistics: HTMLElement;

  constructor() {
    this.guessesContainer = document.querySelector(".guesses")!;
    this.keyboard = document.querySelector(".keyboard")!;
    this.keyboardKeys = this.keyboard.querySelectorAll(".key");
    this.menu = document.querySelector(".menu__navigation")!;
    this.menuToggler = document.querySelector(".menu__toggle")!;
    this.body = document.body;
    this.modal = document.querySelector(".modal")!;
    this.superModals = {
      [SuperModalType.won]: document.querySelector(".supermodal--won")!,
      [SuperModalType.lost]: document.querySelector(".supermodal--lost")!,
    };
    this.bigModals = {
      [BigModalType.solution]: document.querySelector(".bigmodal--solution")!,
      [BigModalType.statistics]: document.querySelector(
        ".bigmodal--statistics"
      )!,
    };
    this.buttonClose = document.querySelector(".button--close")!;
    this.buttonStatistics = this.bigModals[BigModalType.solution].querySelector(
      ".button--statistics"
    )!;
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

  public getButtonCloseElement() {
    return this.buttonClose;
  }

  public getButtonOpenStatistics() {
    return this.buttonStatistics;
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
    this.openBigModal(BigModalType.solution);
  }

  public closeSuperModal(type: SuperModalType): void {
    this.superModals[type].classList.remove("supermodal--open");
  }

  public openBigModal(type: BigModalType): void {
    this.bigModals[type].classList.add("bigmodal--open");
    this.body.classList.add("modal--open");
  }

  public closeBigModal(type: BigModalType): void {
    this.bigModals[type].classList.remove("bigmodal--open");
    this.body.classList.remove("modal--open");
  }
}

export default DomAccessor;
