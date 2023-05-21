class Modal {
  modal: HTMLElement;
  modalText: HTMLElement;

  constructor() {
    this.modal = document.querySelector(".modal")!;
    this.modalText = this.modal.querySelector(".modal__text")!;
  }

  setMessage(message: string) {
    this.modalText.textContent = message;
  }

  open() {
    setTimeout(() => {
      this.modal.classList.add("modal--open");
    }, 0);

    setTimeout(() => {
      this.modal.classList.remove("modal--open");
    }, 1000);
  }
}

export default Modal;
