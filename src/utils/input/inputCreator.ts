import { CallbackClick, InputParams } from './inputParams';
import styles from './input-style.module.scss';
import TagName from '../../enum/tag-name';

export default class InputCreator {
  private element: HTMLDivElement;

  private inputElement: HTMLInputElement;

  private labelElement: HTMLLabelElement;

  constructor(params: InputParams) {
    this.inputElement = document.createElement('input');
    this.labelElement = document.createElement('label');
    this.element = document.createElement(TagName.DIV);
    this.createElement(params);
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  private createElement(params: InputParams): HTMLElement {
    this.element.classList.add(styles.input__container);
    this.element.classList.add(...params.classNames);
    this.inputElement.classList.add(styles.input);

    Object.entries(params.attributes).forEach(([attributeName, attribute]) => {
      this.inputElement.setAttribute(attributeName, attribute.toString());
    });
    this.setCallback(params.callback);
    this.labelElement.textContent = params.textContent;
    this.element.append(this.labelElement, this.inputElement);
    return this.element;
  }

  private setCallback(callback: CallbackClick) {
    this.inputElement.addEventListener('click', callback);
  }
}
