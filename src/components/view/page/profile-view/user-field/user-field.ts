import stylesField from './styles/field-view.module.scss';
import stylesRedactionMode from './styles/redaction-mode-style.module.scss';
import stylesRedactionButton from './styles/redaction-button-style.module.scss';
import UserFieldProps from './user-field-props';
import TagName from '../../../../../enum/tag-name';
import { CallbackListener } from '../../../../../utils/input/inputParams';
import TextContent from '../enum/text-content';
import Events from '../../../../../enum/events';
import WarningMessage from '../../../../message/warning-message';
import ErrorMessage from '../../../../message/error-message';
import InfoMessage from '../../../../message/info-message';
import buttonCreator from '../../../../shared/button/button-creator';
import InputCreator from '../../../../../utils/input/inputCreator';

export default class UserField {
  private elementField: HTMLDivElement;

  private value: string;

  private labelValue: string;

  private inputElement: InputCreator;

  private confirmButton: HTMLButtonElement;

  private cancelButton: HTMLButtonElement;

  private redactionModeButton: HTMLButtonElement;

  constructor(userFieldsProps: UserFieldProps) {
    this.elementField = this.createElementField();
    this.inputElement = new InputCreator(userFieldsProps.inputParams);
    this.value = userFieldsProps.value;
    this.labelValue = userFieldsProps.inputParams.attributes.placeholder;

    this.cancelButton = this.createCancelButton();
    this.confirmButton = this.createConfirmButton();
    this.redactionModeButton = this.createRedactionModeButton();

    this.configureView();
  }

  getElement() {
    return this.elementField;
  }

  getInputElement() {
    return this.inputElement;
  }

  private createElementField() {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(stylesField));
    return element;
  }

  private configureView() {
    this.configureInputElement();

    this.elementField.append(this.inputElement.getElement(), this.redactionModeButton);
  }

  private configureInputElement() {
    this.inputElement.setDisabled();
    this.inputElement.setInputValue(this.value);
    this.inputElement.setLabel(this.labelValue);
    this.inputElement.removeMessageElement();
  }

  private createRedactionModeButton() {
    return this.createButton(
      TextContent.REDACTION_MODE_BUTTON,
      Object.values(stylesRedactionButton),
      this.redactionModeHandler.bind(this),
      Events.CLICK
    );
  }

  private createConfirmButton() {
    return this.createButton(
      TextContent.CONFIRM_BUTTON,
      Object.values(stylesRedactionButton),
      this.saveValueHandler.bind(this),
      Events.CLICK
    );
  }

  private createCancelButton() {
    return this.createButton(
      TextContent.CANCEL_BUTTON,
      Object.values(stylesRedactionButton),
      this.cancelValueHandler.bind(this),
      Events.CLICK
    );
  }

  private createButton(
    textContent: string,
    classList?: Array<string>,
    eventListener?: CallbackListener,
    event?: string
  ): HTMLButtonElement {
    const button = new buttonCreator(textContent, classList, eventListener, event);
    return button.getButton();
  }

  private showInfoMessage(textContent: string) {
    const messageShower = new InfoMessage();
    messageShower.showMessage(textContent);
  }
  //
  // private showErrorMessage(textContent: string) {
  //   const messageShower = new ErrorMessage();
  //   messageShower.showMessage(textContent);
  // }
  //
  // private showWarningMessage(textContent: string) {
  //   const messageShower = new WarningMessage();
  //   messageShower.showMessage(textContent);
  // }

  private redactionModeHandler() {
    this.value = this.inputElement.getInputValue();
    this.inputElement.appendMessage();
    this.elementField.removeChild(this.redactionModeButton);
    this.inputElement.removeDisabled();
    this.elementField.append(this.confirmButton, this.cancelButton);
    this.elementField.classList.add(...Object.values(stylesRedactionMode));
  }

  private saveValueHandler() {
    this.exitEditModeChangeButton();
    this.value = this.inputElement.getInputValue();
    this.showInfoMessage(TextContent.CONFIRM_MESSAGE_INFO);
  }

  private cancelValueHandler() {
    this.exitEditModeChangeButton();
    this.inputElement.setInputValue(this.value);
    this.showInfoMessage(TextContent.CANCEL_MESSAGE_INFO);
  }

  private exitEditModeChangeButton() {
    this.inputElement.setDisabled();
    this.elementField.removeChild(this.confirmButton);
    this.elementField.removeChild(this.cancelButton);
    this.inputElement.removeMessageElementFromLabel();
    this.elementField.append(this.redactionModeButton);
    this.elementField.classList.remove(...Object.values(stylesRedactionMode));
  }
}
