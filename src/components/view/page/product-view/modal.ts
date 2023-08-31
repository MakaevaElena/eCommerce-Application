export default class Modal {
  modal: HTMLElement;

  modalCloseBtn: HTMLElement;

  modalContent: HTMLElement;

  overlay: HTMLElement;

  classes: string;

  constructor(classes: string) {
    this.classes = classes;
    this.modal = document.createElement('div');
    this.modalContent = document.createElement('div');
    this.modalCloseBtn = document.createElement('div');
    this.overlay = document.createElement('div');
  }

  public buildModal(content: string | HTMLElement) {
    this.overlay.classList.add('overlay', 'overlay_product-modal');
    // this.modal = this.createDomeNode(this.modal, 'modal', this.classes);
    this.modal.classList.add('product-modal');
    this.modalContent.classList.add('product-modal__content');
    this.modalCloseBtn.classList.add('product-modal__close-icon');

    // this.modalCloseBtn.innerHTML = '';
    this.setContent(content);
    this.appendModalElements();
    this.bindEvents();
    this.openModal();
  }

  private setContent(content: string | HTMLElement) {
    if (typeof content === 'string') {
      this.modalContent.innerHTML = content;
    } else {
      this.modalContent.innerHTML = '';
      this.modalContent.appendChild(content);
    }
  }

  private appendModalElements() {
    this.modal.append(this.modalCloseBtn);
    this.modal.append(this.modalContent);
    this.overlay.append(this.modal);
  }

  private bindEvents() {
    this.modalCloseBtn.addEventListener('click', this.closeModal);
    this.overlay.addEventListener('click', this.closeModal);
  }

  private openModal() {
    document.body.append(this.overlay);
    document.body.style.overflow = 'hidden';
  }

  private closeModal(evt: Event) {
    if (evt.target instanceof HTMLElement) {
      const classes = evt.target?.classList;
      if (classes.contains('overlay') || classes.contains('product-modal__close-icon')) {
        document.querySelector('.overlay')?.remove();
        document.body.style.overflow = '';
      }
    }
  }
}
