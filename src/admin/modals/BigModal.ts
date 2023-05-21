class BigModal {
  modal: HTMLElement;
  closeButton: HTMLElement;
  confirmButton: HTMLElement;
  id = "";

  constructor(private readonly actionOnConfirm: (id: string) => Promise<void>) {
    this.modal = document.querySelector(".bigmodal--delete")!;

    this.closeButton = this.modal.querySelector("[data-action='close']")!;
    this.confirmButton = this.modal.querySelector("[data-action='confirm']")!;

    this.addListeners();
  }

  open(id: string) {
    this.modal.classList.add("bigmodal--open");
    this.id = id;
  }

  private addListeners() {
    this.closeButton.addEventListener("click", () => {
      this.modal.classList.remove("bigmodal--open");
      this.id = "";
    });

    this.confirmButton.addEventListener("click", async () => {
      await this.actionOnConfirm(this.id);

      this.modal.classList.remove("bigmodal--open");
      this.id = "";
    });
  }
}

export default BigModal;
