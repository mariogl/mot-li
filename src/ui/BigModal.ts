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
  closeButtons: NodeListOf<HTMLElement>;

  constructor(type: string, options?: BigModalOptions) {
    this.modal = document.querySelector(`.bigmodal--${type}`)!;
    this.closeButtons = this.modal.querySelectorAll(".button--close");

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
      const currentStreak = document.querySelector(".stats__current")!;
      const maxStreak = document.querySelector(".stats__max")!;

      const bars = {
        b1: document.querySelector(".guess-bars .bar--first"),
        b2: document.querySelector(".guess-bars .bar--second")!,
        b3: document.querySelector(".guess-bars .bar--third")!,
        b4: document.querySelector(".guess-bars .bar--fourth")!,
        b5: document.querySelector(".guess-bars .bar--fifth")!,
        b6: document.querySelector(".guess-bars .bar--sixth")!,
      };

      (bars.b1 as HTMLElement).dataset.guess = `${options.statistics.guesses1}`;
      (bars.b2 as HTMLElement).dataset.guess = `${options.statistics.guesses2}`;
      (bars.b3 as HTMLElement).dataset.guess = `${options.statistics.guesses3}`;
      (bars.b4 as HTMLElement).dataset.guess = `${options.statistics.guesses4}`;
      (bars.b5 as HTMLElement).dataset.guess = `${options.statistics.guesses5}`;
      (bars.b6 as HTMLElement).dataset.guess = `${options.statistics.guesses6}`;

      let b1Percentage =
        options.statistics.wins === 0
          ? 0
          : (options.statistics.guesses1 / options.statistics.wins) * 100;
      if (b1Percentage < 9) {
        b1Percentage = 9;
      }

      let b2Percentage =
        options.statistics.wins === 0
          ? 0
          : (options.statistics.guesses2 / options.statistics.wins) * 100;
      if (b2Percentage < 9) {
        b2Percentage = 9;
      }

      let b3Percentage =
        options.statistics.wins === 0
          ? 0
          : (options.statistics.guesses3 / options.statistics.wins) * 100;
      if (b3Percentage < 9) {
        b3Percentage = 9;
      }

      let b4Percentage =
        options.statistics.wins === 0
          ? 0
          : (options.statistics.guesses4 / options.statistics.wins) * 100;
      if (b4Percentage < 9) {
        b4Percentage = 9;
      }

      let b5Percentage =
        options.statistics.wins === 0
          ? 0
          : (options.statistics.guesses5 / options.statistics.wins) * 100;
      if (b5Percentage < 9) {
        b5Percentage = 9;
      }

      let b6Percentage =
        options.statistics.wins === 0
          ? 0
          : (options.statistics.guesses6 / options.statistics.wins) * 100;
      if (b6Percentage < 9) {
        b6Percentage = 9;
      }

      (bars.b1 as HTMLElement).style.width = `${b1Percentage}%`;
      (bars.b2 as HTMLElement).style.width = `${b2Percentage}%`;
      (bars.b3 as HTMLElement).style.width = `${b3Percentage}%`;
      (bars.b4 as HTMLElement).style.width = `${b4Percentage}%`;
      (bars.b5 as HTMLElement).style.width = `${b5Percentage}%`;
      (bars.b6 as HTMLElement).style.width = `${b6Percentage}%`;

      document.querySelectorAll(".guess-bars .bar").forEach((bar) => {
        bar.classList.remove("bar--current");
      });

      if (options.statistics.lastWinGuesses > 0) {
        document
          .querySelector(
            `.guess-bars [data-guesses="${options.statistics.lastWinGuesses}"]`
          )
          ?.classList.add("bar--current");
      }

      const winsPercentage =
        options.statistics.games === 0
          ? 0
          : (options.statistics.wins / options.statistics.games) * 100;

      games.textContent = `${options.statistics.games}`;
      wins.textContent = Number.isInteger(winsPercentage)
        ? `${winsPercentage}`
        : winsPercentage.toFixed(2);

      currentStreak.textContent = `${options.statistics.currentStreak}`;
      maxStreak.textContent = `${options.statistics.maxStreak}`;
    }
  }

  open(actions?: Array<() => void>) {
    this.modal.classList.add("bigmodal--open");

    document.body.classList.add("modal--open");

    this.closeButtons[0].focus();

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
    this.closeButtons.forEach((closeButton) => {
      closeButton.addEventListener("click", () => {
        this.close();
      });
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
    this.closeButtons.forEach((closeButton) => {
      const clonedCloseButton = closeButton.cloneNode(true);

      closeButton.parentNode?.replaceChild(clonedCloseButton, closeButton);
    });

    document.removeEventListener("click", this.handleClose);
  }
}

export default BigModal;
