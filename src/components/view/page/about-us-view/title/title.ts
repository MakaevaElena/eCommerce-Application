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
    this.element.append(this.createName(), this.createSubName());
  }

  private createName() {
    const name = document.createElement(TagName.DIV);
    name.classList.add(styleTitle.waving);
    name.classList.add(styleTitle.title);
    name.append(
      this.addLetter('U'),
      this.addLetter('P'),
      this.addLetter('&'),
      this.addLetter('G'),
      this.addLetter('O')
    );
    return name;
  }

  private createSubName() {
    const subName = document.createElement(TagName.DIV);
    subName.classList.add(styleTitle.waving);
    subName.classList.add(styleTitle.subtitle);
    subName.append(this.addLetter('t'), this.addLetter('e'), this.addLetter('a'), this.addLetter('m'));
    return subName;
  }

  private addLetter(letter: string) {
    const letterElement = document.createElement(TagName.SPAN);
    letterElement.innerText = letter;
    return letterElement;
  }
}
