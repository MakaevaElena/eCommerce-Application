export default class Modal {
  private modal = document.createElement('div');

  private modalCloseBtn = document.createElement('div');

  private modalContent = document.createElement('div');

  private overlay = document.createElement('div');

  private classes: string;

  constructor(classes: string) {
    this.classes = classes;
  }

  public buildModal(content: string | HTMLElement) {
    this.overlay.classList.add('overlay_product-modal');
    this.modal.classList.add('product-modal');
    this.modalContent.classList.add('product-modal__content');
    this.modalCloseBtn.classList.add('product-modal__close-icon');
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
  }

  private closeModal(evt: Event) {
    if (evt.target instanceof HTMLElement) {
      const classes = evt.target?.classList;
      if (classes.contains('overlay_product-modal') || classes.contains('product-modal__close-icon')) {
        document.querySelector('.overlay_product-modal')?.remove();
        document.body.style.overflow = '';
      }
    }
  }
}
