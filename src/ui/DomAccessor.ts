import {
  type DomAccessorStructure,
  type GuessLetterStructure,
  type GuessLetterAnimationsStructure,
} from "../types";

class DomAccessor implements DomAccessorStructure {
  private readonly guessesContainer: HTMLElement;
  private readonly keyboard: HTMLElement;
  private readonly keyboardKeys: NodeListOf<HTMLElement>;
  private readonly menu: HTMLElement;
  private readonly menuToggler: HTMLElement;
  private readonly statisticsOpener: HTMLElement;
  private readonly optionsOpener: HTMLElement;
  private readonly infoOpener: HTMLElement;
  private readonly themeSwitcher: HTMLElement;
  private readonly modal: HTMLElement;
  private readonly countdown: HTMLElement;

  constructor() {
    this.guessesContainer = document.querySelector(".guesses")!;
    this.keyboard = document.querySelector(".keyboard")!;
    this.keyboardKeys = this.keyboard.querySelectorAll(".key");
    this.menu = document.querySelector(".menu__navigation")!;
    this.menuToggler = document.querySelector(".menu__toggle")!;
    this.modal = document.querySelector(".modal")!;
    this.countdown = document.querySelector(".countdown__timer")!;
    this.statisticsOpener = document.querySelector(
      ".menu__navigation .button--stats"
    )!;
    this.optionsOpener = document.querySelector(
      ".menu__navigation .button--options"
    )!;
    this.infoOpener = document.querySelector(
      ".menu__navigation .button--info"
    )!;
    this.themeSwitcher = document.querySelector("#darkMode")!;
  }

  public getCountdown(): HTMLElement {
    return this.countdown;
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

  /*   Public setGuessRowAnimation(currentGuessNumber: number) {
    this.getCurrentGuessElement(currentGuessNumber);
  } */

  public setLetterStatus(
    currentGuessNumber: number,
    letter: GuessLetterStructure,
    position: number,
    animation: GuessLetterAnimationsStructure
  ) {
    const currentGuessLetterElement =
      this.getCurrentGuessLettersElements(currentGuessNumber)[position];

    currentGuessLetterElement.textContent = letter.symbol;
    currentGuessLetterElement.classList.remove("letter--unchecked");
    currentGuessLetterElement.classList.add(`letter--${letter.status}`);
    currentGuessLetterElement.classList.remove("letter--none");
    currentGuessLetterElement.classList.add(`letter--${animation}`);
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

  public getStatisticsOpener() {
    return this.statisticsOpener;
  }

  public getOptionsOpener() {
    return this.optionsOpener;
  }

  public getInfoOpener() {
    return this.infoOpener;
  }

  public getThemeSwitcher() {
    return this.themeSwitcher;
  }
}

export default DomAccessor;
