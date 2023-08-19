import { CallbackListener, InputAttributes, InputParams } from './inputParams';
import styles from './input-style.module.scss';
import TagName from '../../enum/tag-name';
import Events from '../../enum/events';
import { InputTypes } from './input-values/input-values';
import TextContents from '../../components/view/page/registration-view/countries/text-contents';

export default class InputCreator {
  private element: HTMLDivElement;

  private inputElement: HTMLInputElement;

  private messageElement: HTMLSpanElement;

  private messageText: string;

  private title: string;

  constructor(params: InputParams) {
    this.inputElement = document.createElement('input');
    this.messageElement = document.createElement(TagName.SPAN);
    this.element = document.createElement(TagName.DIV);
    this.createElement(params);
    this.inputElement.addEventListener(Events.CHANGE, this.showErrorhandler.bind(this));
    if (params.attributes.title) {
      this.title = params.attributes.title;
      this.messageText = this.title;
    } else {
      this.title = '';
      this.messageText = this.inputElement.validationMessage;
    }
  }

  setAttribute(name: string, value: string) {
    this.inputElement.setAttribute(name, value);
  }

  removeAttribute(name: string) {
    this.inputElement.removeAttribute(name);
  }

  removeMessage() {
    this.element.removeChild(this.messageElement);
  }

  appendMessage() {
    this.element.append(this.messageElement);
  }

  setMessageError(message: string) {
    this.messageElement.textContent = message;
  }

  setCustomValidity(message: string): void {
    this.inputElement.setCustomValidity(message);
  }

  setInputValue(value: string): void {
    this.inputElement.value = value;
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  getInputValue(): string {
    return this.inputElement.value;
  }

  getInput(): HTMLInputElement {
    return this.inputElement;
  }

  getTitle(): string {
    return this.getInput().title;
  }

  setTitle(title: string): void {
    this.inputElement.title = title;
    this.title = title;
  }

  setPattern(title: string): void {
    this.inputElement.pattern = title;
  }

  private createElement(params: InputParams): void {
    this.element.classList.add(styles.input__container);
    if (params.classNames) {
      this.element.classList.add(...params.classNames);
    }
    this.createInput(params);

    if (typeof params.callback !== 'undefined') {
      enum CallbackParms {
        HANDLER,
        EVENT,
      }

      params.callback.forEach((callbackParams) => {
        this.setCallback(callbackParams[CallbackParms.HANDLER], callbackParams[CallbackParms.EVENT]);
      });
    }

    this.messageElement = document.createElement(TagName.SPAN);
    this.showErrorhandler();
    this.messageElement.classList.add(styles.input__symbol);
    this.element.append(this.inputElement, this.messageElement);
  }

  private setCallback(callback: CallbackListener, event: string) {
    this.inputElement.addEventListener(event, callback);
  }

  private createInput(params: InputParams) {
    this.inputElement.classList.add(styles.input);
    this.inputElement.required = true;

    this.setAttributes(params.attributes);

    if (params.attributes.type === InputTypes.PASSWORD) {
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
    showPasswordButton.type = InputTypes.CHECKBOX;
    const label = document.createElement('label');
    label.textContent = TextContents.SHOW_BUTTON;
    label.append(showPasswordButton);
    label.classList.add(styles.inputShowPassword);
    this.element.append(label);
    this.inputElement.classList.add(styles.input_password);

    showPasswordButton.addEventListener(Events.CLICK, this.toggleVisibilityHandler.bind(this));
  }

  private toggleVisibilityHandler() {
    if (this.inputElement.type === InputTypes.PASSWORD) {
      this.inputElement.type = InputTypes.TEXT;
    } else {
      this.inputElement.type = InputTypes.PASSWORD;
    }
  }

  private showErrorhandler() {
    this.messageText = this.inputElement.validationMessage;

    if (this.inputElement.validity.patternMismatch) {
      this.messageText = this.title;
    }
    this.messageElement.textContent = this.messageText;
  }
}
