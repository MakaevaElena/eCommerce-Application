import TagName from '../../../../../enum/tag-name';
import styleWave from './magic-string-style.module.scss';

export default class MagicString {
  private element: HTMLDivElement;

  constructor(string: string, className?: string) {
    this.element = this.createElement();
    this.configure(string, className);
  }

  getElement() {
    return this.element;
  }

  private createElement() {
    const element = document.createElement(TagName.DIV);
    element.classList.add();
    return element;
  }

  private configure(string: string, className?: string) {
    this.element.classList.add(styleWave.waving);
    if (className) {
      this.element.classList.add(className);
    }

    this.element.append(...string.split('').map((letter) => this.addLetter(letter)));
  }

  private addLetter(letter: string) {
    const letterElement = document.createElement(TagName.SPAN);
    letterElement.innerText = letter;
    return letterElement;
  }
}
