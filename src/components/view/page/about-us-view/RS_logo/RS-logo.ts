import stylelogo from './rs-logo-style.module.scss';
import tagName from '../../../../../enum/tag-name';
import TagName from '../../../../../enum/tag-name';

export default class RSLogo {
  private element: HTMLDivElement;

  constructor() {
    this.element = this.createLogo();
  }

  getElement() {
    return this.element;
  }

  private createLogo(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(stylelogo.RSLogo);
    return element;
  }

  private createLink() {
    const link = document.createElement(tagName.A);
    const svg = document.createElement('svg');

    return link;
  }
}
