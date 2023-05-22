import { type Stats } from "../types";

export interface BigModalOptions {
  solution?: {
    word: string;
    definition: string;
    link: string;
    linkText: string;
  };
  statistics?: Stats;
}
class BigModal {
  modal: HTMLElement;
  closeButton: HTMLElement;

  constructor(type: string, options?: BigModalOptions) {
    this.modal = document.querySelector(`.bigmodal--${type}`)!;
    this.closeButton = this.modal.querySelector(".button--close")!;

    if (options?.solution) {
      const word = document.querySelector(".bigmodal__solution")!;
      const definition = document.querySelector(".bigmodal__definition")!;
      const link: HTMLAnchorElement = document.querySelector(
        ".bigmodal__external-link"
      )!;

      word.textContent = options.solution.word;
      definition.innerHTML = options.solution.definition;
      link.textContent = options.solution.linkText;
      link.href = options.solution.link;
    }

    if (options?.statistics) {
      const games = document.querySelector(".stats__games")!;
      const wins = document.querySelector(".stats__wins")!;

      const winsPercentage =
        (options.statistics.wins / options.statistics.games) * 100;

      games.textContent = `${options.statistics.games}`;
      wins.textContent = `${winsPercentage}`;
    }
  }

  open(actions?: Array<() => void>) {
    this.modal.classList.add("bigmodal--open");

    document.body.classList.add("modal--open");

    this.closeButton.focus();

    this.addEventsListeners(actions);
  }

  close() {
    this.modal.classList.remove("bigmodal--open");

    document.body.classList.remove("modal--open");

    this.removeEventsListeners();
  }

  private readonly handleClose = (event: MouseEvent) => {
    const clickedElement = event.target! as HTMLElement;

    if (!this.modal.contains(clickedElement)) {
      this.close();
    }
  };

  private addEventsListeners(actions?: Array<() => void>) {
    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    setTimeout(() => {
      document.addEventListener("click", this.handleClose);
    });

    actions?.forEach((action, position) => {
      this.modal
        .querySelectorAll(".bigmodal__action")
        [position].addEventListener("click", action);
    });
  }

  private removeEventsListeners() {
    const clonedCloseButton = this.closeButton.cloneNode(true);
    this.closeButton.parentNode?.replaceChild(
      clonedCloseButton,
      this.closeButton
    );

    document.removeEventListener("click", this.handleClose);
  }
}

export default BigModal;
