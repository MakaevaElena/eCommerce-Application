import stylePasswordChanger from './styles/password-chenger-style.module.scss';
import stylePasswordField from './styles/password-fields-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import UserField from './user-field';
import userFieldProps from './user-field-props';
import InputParamsCreator from '../../../../../utils/input/input-values/input-params-creator';
import TextContent from '../enum/text-content';
import { InputParams } from '../../../../../utils/input/inputParams';
import InputCreator from '../../../../../utils/input/inputCreator';

export default class PasswordChanger {
  private passwordChangerElement: HTMLDivElement;

  private newPasswordField: InputCreator;
  //
  // private repeatPasswordField: InputCreator;
  //
  // private confirmOldPasswordField: InputCreator;

  private inputParamsCreator: InputParamsCreator;

  constructor() {
    this.passwordChangerElement = this.createPasswordChangerElement();
    this.inputParamsCreator = new InputParamsCreator();

    this.newPasswordField = this.createPasswordField(
      this.inputParamsCreator.getPasswordParams(),
      TextContent.NEW_PASSWORD_FIELD_LABEL
    );

    this.configureView();
  }

  private configureView() {
    this.passwordChangerElement.append(this.newPasswordField.getElement());
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
}
