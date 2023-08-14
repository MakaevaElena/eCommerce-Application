import { Callback, InputAttributes, InputParams } from './inputParams';
import styles from './input-style.module.scss';
import TagName from '../../enum/tag-name';

export default class InputCreator {
  private element: HTMLDivElement;

  private inputElement: HTMLInputElement;

  constructor(params: InputParams) {
    this.inputElement = document.createElement('input');
    this.element = document.createElement(TagName.DIV);
    this.createElement(params);
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  private createElement(params: InputParams): void {
    this.element.classList.add(styles.input__container);
    this.element.classList.add(...params.classNames);
    this.createInput(params);

    if (typeof params.callback !== 'undefined' && typeof params.eventName !== 'undefined') {
      this.setCallback(params.callback, params.eventName);
    }

    const symbol: HTMLSpanElement = document.createElement(TagName.SPAN);
    symbol.classList.add(styles.input__symbol);

    this.element.append(this.inputElement, symbol);
  }

  private setCallback<K extends keyof HTMLElementTagNameMap>(callback: Callback, event: K) {
    this.inputElement.addEventListener(event, callback);
  }

  private createInput(params: InputParams) {
    this.inputElement.classList.add(styles.input);
    this.inputElement.required = true;

    this.setAttributes(params.attributes);

    if (params.attributes.type === 'password') {
      this.showPassword();
    }
  }

  private setAttributes(attributes: InputAttributes) {
    Object.entries(attributes).forEach(([attributeName, attributeValue]) => {
      this.inputElement.setAttribute(attributeName, attributeValue);
    });
  }

  private showPassword() {
    const showPasswordButton = document.createElement('input');
    showPasswordButton.type = 'checkbox';
    const label = document.createElement('label');
    label.textContent = 'show';
    label.append(showPasswordButton);
    label.classList.add(styles.inputShowPassword);
    this.element.append(label);
    this.inputElement.classList.add(styles.input_password);

    showPasswordButton.addEventListener('click', this.toggleVisibilityHandler.bind(this));
  }

  private toggleVisibilityHandler() {
    if (this.inputElement.type === 'password') {
      this.inputElement.type = 'text';
    } else {
      this.inputElement.type = 'password';
    }
  }
}
