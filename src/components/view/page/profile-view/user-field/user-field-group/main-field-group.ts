import styleGroupFields from '../styles/field-group.module.scss';
import UserField from '../user-field';
import TagName from '../../../../../../enum/tag-name';
import UserFieldProps from '../user-field-props';
import userFieldProps from '../user-field-props';

export default class MainFieldGroup {
  private mainFieldGroup: HTMLDivElement;

  private userFieldsProps: Array<UserFieldProps>;

  private userFieldElements: Array<HTMLDivElement>;

  constructor(userFieldProps: Array<UserFieldProps>) {
    this.mainFieldGroup = this.createMainFieldGroupElement();
    this.userFieldsProps = userFieldProps;
    this.userFieldElements = this.createUserFieldsElements();

    this.configureView();
  }

  getElement() {
    return this.mainFieldGroup;
  }

  private configureView() {
    this.mainFieldGroup.append(...this.userFieldElements);
  }

  private createMainFieldGroupElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(styleGroupFields));
    return element;
  }

  private createUserFieldsElements(): Array<HTMLDivElement> {
    const userFieldElements: Array<HTMLDivElement> = [];
    this.userFieldsProps.forEach((userFieldProps) => {
      const userFieldElement = new UserField(userFieldProps);
      userFieldElements.push(userFieldElement.getElement());
    });
    return userFieldElements;
  }
}
