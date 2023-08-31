import stylePasswordChanger from './styles/password-chenger-style.module.scss';
import TagName from '../../../../../enum/tag-name';

export default class PasswordChanger {
  private passwordChangerElement: HTMLDivElement;

  constructor() {
    this.passwordChangerElement = this.createPasswordChangerElement();
  }

  getPasswordChanger(): HTMLDivElement {
    return this.passwordChangerElement;
  }

  private createPasswordChangerElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.append(...Object.values(stylePasswordChanger));
    return element;
  }
}
