import stylePasswordChanger from './styles/password-chenger-style.module.scss';
import TagName from '../../../../../enum/tag-name';
import UserField from './user-field';
import userFieldProps from './user-field-props';
import InputParamsCreator from '../../../../../utils/input/input-values/input-params-creator';

export default class PasswordChanger {
  private passwordChangerElement: HTMLDivElement;

  private newPasswordField: UserField;

  private repeatPasswordField: UserField;

  private confirmOldPasswordField: UserField;

  private inputParamsCreator: InputParamsCreator;

  constructor() {
    this.passwordChangerElement = this.createPasswordChangerElement();
    this.inputParamsCreator = new InputParamsCreator();

    this.configureView();
  }

  private configureView() {}

  getPasswordChanger(): HTMLDivElement {
    return this.passwordChangerElement;
  }

  private createPasswordChangerElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(stylePasswordChanger));
    return element;
  }

  private createnewPasswordField(): UserField {
    // const fieldProps: userFieldProps = {
    //   id: '',
    //   inputParams:
    // }
  }
}
