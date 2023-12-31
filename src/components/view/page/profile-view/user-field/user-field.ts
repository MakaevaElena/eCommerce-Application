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
import ButtonCreator from '../../../../shared/button/button-creator';
import InputCreator from '../../../../../utils/input/inputCreator';
import LocalStorageKeys from '../../../../../enum/local-storage-keys';
import ActionNames from './enum/action-names';
import StatusCodes from '../../../../../enum/status-codes';
import { InputPlaceholders, InputTittles } from '../../../../../utils/input/input-values/input-values';
import TotalApi from '../../../../../api/total-api';

export default class UserField {
  private elementField: HTMLDivElement;

  private value: string;

  private labelValue: string;

  private inputElement: InputCreator;

  private action: string;

  private actionName: string;

  private id: string;

  private confirmButton: HTMLButtonElement;

  private cancelButton: HTMLButtonElement;

  private redactionModeButton: HTMLButtonElement;

  private api: TotalApi;

  constructor(userFieldsProps: UserFieldProps, api: TotalApi) {
    this.api = api;
    this.elementField = this.createElementField();
    this.inputElement = new InputCreator(userFieldsProps.inputParams);
    this.value = userFieldsProps.value;
    this.labelValue = userFieldsProps.inputParams.attributes.placeholder;

    this.action = userFieldsProps.action;
    this.actionName = userFieldsProps.actionName;
    this.id = userFieldsProps.id;

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

  getConfirmButton() {
    return this.confirmButton;
  }

  // eslint-disable-next-line class-methods-use-this
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

  // eslint-disable-next-line class-methods-use-this
  private createButton(
    textContent: string,
    classList?: Array<string>,
    eventListener?: CallbackListener,
    event?: string
  ): HTMLButtonElement {
    const button = new ButtonCreator(textContent, classList, eventListener, event);
    return button.getButton();
  }

  // eslint-disable-next-line class-methods-use-this
  private showInfoMessage(textContent: string) {
    const messageShower = new InfoMessage();
    messageShower.showMessage(textContent);
  }

  // eslint-disable-next-line class-methods-use-this
  private showErrorMessage(textContent: string) {
    const messageShower = new ErrorMessage();
    messageShower.showMessage(textContent);
  }

  // eslint-disable-next-line class-methods-use-this
  private showWarningMessage(textContent: string) {
    const messageShower = new WarningMessage();
    messageShower.showMessage(textContent);
  }

  private redactionModeHandler() {
    this.value = this.inputElement.getInputValue();
    this.inputElement.appendMessage();
    this.elementField.removeChild(this.redactionModeButton);
    this.inputElement.removeDisabled();
    this.elementField.append(this.confirmButton, this.cancelButton);
    this.elementField.classList.add(...Object.values(stylesRedactionMode));
  }

  private saveValueHandler() {
    const savingInuptsLabels: Array<string> = [
      InputPlaceholders.EMAIL,
      InputPlaceholders.FIRST_NAME,
      InputPlaceholders.LAST_NAME,
      `${InputPlaceholders.DATE_OF_BIRTH}. ${InputTittles.DATE_OF_BIRTH_HINT}`,
    ];
    if (savingInuptsLabels.includes(this.labelValue)) {
      this.value = this.inputElement.getInputValue();
      if (this.inputElement.getInput().checkValidity()) {
        this.exitEditModeChangeButton();
        this.saveValue();
      } else {
        this.showWarningMessage(TextContent.VALIDATE_INPUT_BEFORE_SUBMIT);
      }
    }
  }

  private cancelValueHandler() {
    this.exitEditModeChangeButton();
    this.inputElement.setInputValue(this.value);
    this.showInfoMessage(TextContent.CANCEL_MESSAGE_INFO);
  }

  public exitEditModeChangeButton() {
    this.inputElement.setDisabled();
    this.elementField.removeChild(this.confirmButton);
    this.elementField.removeChild(this.cancelButton);
    this.inputElement.removeMessageElementFromLabel();
    this.elementField.append(this.redactionModeButton);
    this.elementField.classList.remove(...Object.values(stylesRedactionMode));
  }

  private saveValue() {
    this.api
      .getRegApi()
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        this.api
          .getRegApi()
          .changeData(this.id, response.body.results[0].version, this.action, this.actionName, this.value)
          .then((respone) => {
            if (this.actionName === ActionNames.EMAIL_ADDRESS) {
              window.localStorage.setItem(LocalStorageKeys.MAIL_ADDRESS, this.value);
            }
            if (respone.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              this.showInfoMessage(TextContent.CONFIRM_MESSAGE_INFO);
            }
          })
          .catch((error) => {
            this.showErrorMessage(error.message);
          });
      })
      .catch((error) => {
        this.showErrorMessage(error.message);
      });
  }
}
