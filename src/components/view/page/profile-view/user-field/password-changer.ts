import stylePasswordChanger from './styles/password-chenger-style.module.scss';
import stylePasswordField from './styles/password-fields-style.module.scss';
import stylePasswordWrap from './styles/password-wrap-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import TextContent from '../enum/text-content';
import { CallbackListener, InputParams } from '../../../../../utils/input/inputParams';
import { InputTittles } from '../../../../../utils/input/input-values/input-values';
import InputParamsCreator from '../../../../../utils/input/input-values/input-params-creator';
import Events from '../../../../../enum/events';
import InputCreator from '../../../../../utils/input/inputCreator';
import ButtonCreator from '../../../../shared/button/button-creator';
import WarningMessage from '../../../../message/warning-message';
import LocalStorageKeys from '../../../../../enum/local-storage-keys';
import StatusCodes from '../../../../../enum/status-codes';
import InfoMessage from '../../../../message/info-message';
import ErrorMessage from '../../../../message/error-message';
import TotalApi from '../../../../../api/total-api';

export default class PasswordChanger {
  private api: TotalApi;

  private passwordChangerElement: HTMLDivElement;

  private parentElement: HTMLDivElement;

  private newPasswordField: InputCreator;

  private repeatPasswordField: InputCreator;

  private confirmOldPasswordField: InputCreator;

  private inputParamsCreator: InputParamsCreator;

  private buttonConfirm: HTMLButtonElement;

  private buttonCancel: HTMLButtonElement;

  constructor(parentElement: HTMLDivElement, api: TotalApi) {
    this.api = api;

    this.parentElement = parentElement;
    this.passwordChangerElement = this.createPasswordChangerElement();
    this.inputParamsCreator = new InputParamsCreator();

    this.newPasswordField = this.createPasswordField(
      this.inputParamsCreator.getPasswordParams(),
      TextContent.NEW_PASSWORD_FIELD_LABEL
    );

    this.repeatPasswordField = this.createPasswordField(
      this.inputParamsCreator.getPasswordRepeatParams(),
      TextContent.REPEAT_NEW_PASSWORD_FIELD_LABEL
    );

    this.confirmOldPasswordField = this.createPasswordField(
      this.inputParamsCreator.getPasswordParams(),
      TextContent.OLD_PASSWORD_FIELD_LABEL
    );

    this.buttonCancel = this.createButtonCancel();
    this.buttonConfirm = this.createButtonConfirm();

    this.configureView();
  }

  private configureView() {
    this.repeatPasswordField.getInput().addEventListener(Events.CHANGE, this.passwordCheckHandler.bind(this));
    this.newPasswordField.getInput().addEventListener(Events.CHANGE, this.passwordCheckHandler.bind(this));
    this.passwordChangerElement.addEventListener(Events.CLICK, this.goOutFromRedactionHandler.bind(this));

    const wrap = this.createWrap();
    wrap.append(
      this.newPasswordField.getElement(),
      this.repeatPasswordField.getElement(),
      this.confirmOldPasswordField.getElement(),
      this.buttonConfirm,
      this.buttonCancel
    );
    this.passwordChangerElement.append(wrap);
  }

  // eslint-disable-next-line class-methods-use-this
  private createWrap(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(stylePasswordWrap));
    return element;
  }

  getPasswordChanger(): HTMLDivElement {
    return this.passwordChangerElement;
  }

  // eslint-disable-next-line class-methods-use-this
  private createPasswordChangerElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(stylePasswordChanger));
    return element;
  }

  private createPasswordField(inputParams: InputParams, textContent: string): InputCreator {
    const fieldProps: InputParams = inputParams;
    const newPasswordField = new InputCreator(fieldProps);
    newPasswordField.getElement().classList.add(...Object.values(stylePasswordField));

    const subTitle = this.createSubTitle(textContent);
    newPasswordField.getElement().prepend(subTitle);

    return newPasswordField;
  }

  // eslint-disable-next-line class-methods-use-this
  private createSubTitle(textContent: string): HTMLElement {
    const subTitle = document.createElement('h3');
    subTitle.classList.add(...Object.values(stylePasswordField));
    subTitle.textContent = textContent;
    return subTitle;
  }

  private passwordCheckHandler() {
    const checkingInput = this.repeatPasswordField;
    const mainPassword = this.newPasswordField.getInputValue();
    const checkPassword = checkingInput.getInputValue();

    if (mainPassword === checkPassword) {
      checkingInput.setCustomValidity('');
      checkingInput.removeMessage();
    } else {
      checkingInput.setMessageError(InputTittles.PASSWORD_REPEAT);
      checkingInput.setCustomValidity(InputTittles.PASSWORD_REPEAT);
    }
  }

  private createButtonConfirm() {
    return this.createButtons(TextContent.CONFIRM_BUTTON, this.confirmHandler.bind(this), Events.CLICK);
  }

  private createButtonCancel() {
    return this.createButtons(TextContent.CANCEL_BUTTON, this.cancelHandler.bind(this), Events.CLICK);
  }

  // eslint-disable-next-line class-methods-use-this
  private createButtons(textContent: string, eventListener?: CallbackListener, event?: string): HTMLButtonElement {
    const button = new ButtonCreator(textContent, undefined, eventListener, event);
    return button.getButton();
  }

  private cancelHandler() {
    this.parentElement.removeChild(this.passwordChangerElement);
  }

  private confirmHandler() {
    if (this.isCheckValidityForm()) {
      this.showWarningMessage(TextContent.VALIDATE_FORM_BEFORE_SUBMIT);
    } else {
      this.changePassword();
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private showWarningMessage(textContent: string) {
    const messageShower = new WarningMessage();
    messageShower.showMessage(textContent);
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

  private goOutFromRedactionHandler(event: Event) {
    if (event.target === this.passwordChangerElement) {
      this.cancelHandler();
    }
  }

  private changePassword() {
    this.api
      .getRegApi()
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        this.api
          .getRegApi()
          .changePassword(
            response.body.results[0].id,
            this.newPasswordField.getInputValue(),
            this.confirmOldPasswordField.getInputValue(),
            response.body.results[0].version
          )
          .then((responseAnswer) => {
            if (responseAnswer.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              this.showInfoMessage(TextContent.CHANGE_PASSWORD_INFO_IS_OK);
              this.cancelHandler();
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

  private isCheckValidityForm(): boolean {
    let result = true;

    if (
      this.newPasswordField.getInput().checkValidity() &&
      this.confirmOldPasswordField.getInput().checkValidity() &&
      this.repeatPasswordField.getInput().checkValidity()
    ) {
      result = false;
    }

    return result;
  }
}
