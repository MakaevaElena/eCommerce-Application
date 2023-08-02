import styleScss from './style-scss.module.scss';
import styleCss from './style-css.module.css';
import html from './sample-styles.html';

export default class SampleStiles {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add(styleCss.border_ok);

    const title: HTMLElement = document.createElement('h1');
    title.textContent = 'Hello world!';
    title.classList.add(styleScss.border_alert);

    this.element.append(title, html);
  }

  public getElement(): HTMLElement {
    return this.element;
  }
}
