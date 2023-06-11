/* eslint-disable @typescript-eslint/no-empty-function */
import CountDownTimer from "../CountDownTimer/CountDownTimer";
import {
  type StorageStructure,
  type DomAccessorStructure,
  type GameState,
  type GuessLetterStructure,
  type UserInterfaceStructure,
} from "../types";
import BigModal, { type BigModalOptions } from "./BigModal";

class UserInterface implements UserInterfaceStructure {
  public bigModalOpened: BigModal | undefined;
  private readonly keyboard: HTMLElement;
  private readonly menu: HTMLElement;
  private readonly menuToggler: HTMLElement;
  private readonly statisticsOpener: HTMLElement;
  private readonly optionsOpener: HTMLElement;
  private readonly infoOpener: HTMLElement;
  private readonly themeSwitcher: HTMLElement;

  constructor(
    readonly domAccessor: DomAccessorStructure,
    private readonly gameState: GameState,
    private readonly storage: StorageStructure
  ) {
    this.keyboard = domAccessor.getKeyboardElement();
    this.menuToggler = domAccessor.getMenuTogglerElement();
    this.menu = domAccessor.getMenuElement();
    this.statisticsOpener = domAccessor.getStatisticsOpener();
    this.optionsOpener = domAccessor.getOptionsOpener();
    this.infoOpener = domAccessor.getInfoOpener();
    this.themeSwitcher = domAccessor.getThemeSwitcher();

    this.setTheme();

    this.startCountdown();

    this.keyboardAddEventListeners();
    this.menuAddEventListeners();
  }

  public onLetterPressed(letter: string) {
    throw new Error(`Method not implemented: onLetterPressed(${letter})`);
  }

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

    /* Letters.forEach((letter) => {
      document.querySelectorAll(".keyboard__key").forEach((keyElement) => {
        if (letter.symbol === keyElement.textContent?.toLowerCase()) {
          keyElement.classList.remove(
            "keyboard__key--present",
            "keyboard__key--correct",
            "keyboard__key--absent"
          );
        }
      });
    }); */

    letters
      .filter((letter) => letter.status === "absent")
      .forEach((letter) => {
        document.querySelectorAll(".keyboard__key").forEach((keyElement) => {
          if (
            letter.symbol === keyElement.textContent?.toLowerCase() &&
            !keyElement.classList.contains("keyboard__key--present") &&
            !keyElement.classList.contains("keyboard__key--correct")
          ) {
            keyElement.classList.add(`keyboard__key--${letter.status}`);
          }
        });
      });

    letters
      .filter((letter) => letter.status === "present")
      .forEach((letter) => {
        document.querySelectorAll(".keyboard__key").forEach((keyElement) => {
          if (
            letter.symbol === keyElement.textContent?.toLowerCase() &&
            !keyElement.classList.contains("keyboard__key--correct")
          ) {
            keyElement.classList.add(`keyboard__key--${letter.status}`);
          }
        });
      });

    letters
      .filter((letter) => letter.status === "correct")
      .forEach((letter) => {
        document.querySelectorAll(".keyboard__key").forEach((keyElement) => {
          if (letter.symbol === keyElement.textContent?.toLowerCase()) {
            keyElement.classList.add(`keyboard__key--${letter.status}`);
          }
        });
      });

    letters.forEach((letter) => {
      document.querySelectorAll(".keyboard__key").forEach((keyElement) => {
        if (letter.symbol === keyElement.textContent?.toLowerCase()) {
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

  public openModal(text: string): void {
    this.domAccessor.openModal(text);

    setTimeout(() => {
      this.domAccessor.closeModal();
    }, 2000);
  }

  public closeModal(): void {
    this.domAccessor.closeModal();
  }

  public createBigModal(
    type: string,
    actions?: Array<() => void>,
    options?: BigModalOptions
  ) {
    this.bigModalOpened?.close();

    const modal = new BigModal(type, options);

    this.bigModalOpened = modal;

    modal.open(actions);
  }

  private startCountdown() {
    const countdownElement = this.domAccessor.getCountdown();

    const now = new Date();
    const tonight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      0,
      0,
      0,
      0
    );

    if (now.getHours() >= 0 && now.getHours() < 24) {
      tonight.setDate(tonight.getDate() + 1);
    }

    new CountDownTimer(tonight, (countdown) => {
      countdownElement.textContent = countdown;
    });
  }

  private setTheme() {
    if (this.storage.isDarkTheme) {
      document.body.classList.add("dark");
      (this.domAccessor.getThemeSwitcher() as HTMLInputElement).checked = true;
    } else {
      document.body.classList.remove("dark");
      (this.domAccessor.getThemeSwitcher() as HTMLInputElement).checked = false;
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

    this.statisticsOpener.addEventListener("click", () => {
      this.createBigModal("statistics", [], {
        statistics: this.storage.statistics,
      });
    });

    this.optionsOpener.addEventListener("click", () => {
      this.createBigModal("options");
    });

    this.infoOpener.addEventListener("click", () => {
      this.createBigModal("info");
    });

    this.themeSwitcher.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      this.storage.setDarkTheme(document.body.classList.contains("dark"));
    });
  }
}

export default UserInterface;
