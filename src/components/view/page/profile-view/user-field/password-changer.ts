import stylePasswordChanger from './styles/password-chenger-style.module.scss';
import stylePasswordField from './styles/password-fields-style.module.scss';
import stylePasswordWrap from './styles/password-wrap-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import TextContent from '../enum/text-content';
import { InputParams } from '../../../../../utils/input/inputParams';
import { InputTittles } from '../../../../../utils/input/input-values/input-values';
import InputParamsCreator from '../../../../../utils/input/input-values/input-params-creator';
import Events from '../../../../../enum/events';
import InputCreator from '../../../../../utils/input/inputCreator';

export default class PasswordChanger {
  private passwordChangerElement: HTMLDivElement;

  private newPasswordField: InputCreator;
  //
  private repeatPasswordField: InputCreator;
  //
  private confirmOldPasswordField: InputCreator;

  private inputParamsCreator: InputParamsCreator;

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

    this.configureView();
  }

  private configureView() {
    this.repeatPasswordField.getInput().addEventListener(Events.CHANGE, this.passwordCheckHandler.bind(this));
    this.newPasswordField.getInput().addEventListener(Events.CHANGE, this.passwordCheckHandler.bind(this));

    const wrap = this.createWrap();
    wrap.append(
      this.newPasswordField.getElement(),
      this.repeatPasswordField.getElement(),
      this.confirmOldPasswordField.getElement()
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
}
