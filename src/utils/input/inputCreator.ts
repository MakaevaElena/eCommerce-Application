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

    Object.entries(params.attributes).forEach(([attributeName, attribute]) => {
      this.inputElement.setAttribute(attributeName, attribute);
    });
    this.setCallback(params.callback);
    this.labelElement.textContent = params.textContent;

    const symbol: HTMLSpanElement = document.createElement(TagName.SPAN);
    symbol.classList.add(styles.input__symbol);

    this.labelElement.append(this.inputElement, symbol);
    this.element.append(this.labelElement);
    return this.element;
  }

  private setCallback(callback: CallbackClick) {
    this.inputElement.addEventListener('click', callback);
  }

  private createInput(params: InputParams) {
    this.inputElement.classList.add(styles.input);

    const defaultAttributes = {
      placeholder: 'mandatory field',
      required: 'true',
    };

    Object.entries(defaultAttributes).forEach(([attributeName, attribute]) => {
      this.inputElement.setAttribute(attributeName, attribute);
    });
  }

  private setAttributes(attributes) {}
}
