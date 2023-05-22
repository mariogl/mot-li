class BigModal {
  modal: HTMLElement;
  closeButton: HTMLElement;

  constructor(type: string) {
    this.modal = document.querySelector(`.bigmodal--${type}`)!;
    this.closeButton = this.modal.querySelector(".button--close")!;
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
