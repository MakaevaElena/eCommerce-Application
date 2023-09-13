import styleTitle from './title-style.module.scss';
import TagName from '../../../../../enum/tag-name';

export default class Title {
  private element: HTMLDivElement;

  constructor() {
    this.element = this.createElement();
    this.configure();
  }

  getElement() {
    return this.element;
  }

  private createElement() {
    const element = document.createElement(TagName.DIV);
    element.classList.add(styleTitle.titleContainer);
    return element;
  }

  private configure() {
    const teamNameTitle = 'UP&GO';
    const teamNameSubtitle = 'team';
    this.element.append(
      this.createFunnyString(teamNameTitle, styleTitle.title),
      this.createFunnyString(teamNameSubtitle, styleTitle.subtitle)
    );
  }

  private createFunnyString(string: string, className?: string) {
    const stringElement = document.createElement(TagName.DIV);
    stringElement.classList.add(styleTitle.waving);
    if (className) {
      stringElement.classList.add(className);
    }

    stringElement.append(...string.split('').map((letter) => this.addLetter(letter)));

    return stringElement;
  }

  private addLetter(letter: string) {
    const letterElement = document.createElement(TagName.SPAN);
    letterElement.innerText = letter;
    return letterElement;
  }
}
