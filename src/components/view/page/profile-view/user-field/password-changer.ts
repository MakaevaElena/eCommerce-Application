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
import buttonCreator from '../../../../shared/button/button-creator';

export default class PasswordChanger {
  private passwordChangerElement: HTMLDivElement;

  private newPasswordField: InputCreator;
  //
  private repeatPasswordField: InputCreator;
  //
  private confirmOldPasswordField: InputCreator;

  private inputParamsCreator: InputParamsCreator;

  private buttonConfirm: HTMLButtonElement;

  private buttonCancel: HTMLButtonElement;

  constructor() {
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

  private createWrap(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(stylePasswordWrap));
    return element;
  }

  getPasswordChanger(): HTMLDivElement {
    return this.passwordChangerElement;
  }

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

  private createButtons(textContent: string, eventListener?: CallbackListener, event?: string): HTMLButtonElement {
    const button = new buttonCreator(textContent, undefined, eventListener, event);
    return button.getButton();
  }

  private cancelHandler() {
    console.log('cancel');
  }

  private confirmHandler() {
    console.log('confirm');
  }
}
