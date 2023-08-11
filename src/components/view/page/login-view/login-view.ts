import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './login-view.module.scss';

export default class LoginView extends DefaultView {
  private loginEmail = new ElementCreator({
    tag: TagName.INPUT,
    classNames: [styleCss.login_form__email, styleCss.field],
    textContent: 'email',
  });

  private loginPassword = new ElementCreator({
    tag: TagName.INPUT,
    classNames: [styleCss['login-form__password'], styleCss.field],
    textContent: 'password',
  });

  constructor() {
    const params: ElementParams = {
      tag: TagName.SECTION,
      // classNames: Object.values(styleCss),
      classNames: [styleCss['login-view']],
      textContent: '',
    };
    super(params);

    this.configView();
  }

  private configView() {
    this.renderForm();
  }

  private renderForm() {
    const loginTitle = new ElementCreator({
      tag: TagName.SPAN,
      classNames: [styleCss['login-title']],
      textContent: 'EXISTING CUSTOMERS',
    });

    const loginSubTitle = new ElementCreator({
      tag: TagName.SPAN,
      classNames: [styleCss['login-subtitle']],
      textContent: 'Sign Into Next',
    });

    const loginForm = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['login-form']],
      textContent: '',
    });

    const passwordBlock = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['password-block']],
      textContent: '',
    });

    const showPasswordButton = new ElementCreator({
      tag: TagName.BUTTON,
      classNames: [styleCss['login-form__show-password'], styleCss.button],
      textContent: 'SHOW',
    });

    const loginSubmitButton = new ElementCreator({
      tag: TagName.BUTTON,
      classNames: [styleCss['login-form__submit-button'], styleCss.button],
      textContent: 'SIGN IN',
    });

    const registrationField = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['registration-field']],
      textContent: '',
    });

    const registrationTitle = new ElementCreator({
      tag: TagName.SPAN,
      classNames: [styleCss['registration-field__title']],
      textContent: 'NEW CUSTOMERS',
    });

    const toRegistrationLinkButton = new ElementCreator({
      tag: TagName.BUTTON,
      classNames: [styleCss['register-link'], styleCss.button],
      textContent: 'REGISTER NOW',
    });

    loginForm.getElement().setAttribute('action', '#');

    this.loginEmail.getElement().setAttribute('type', 'email');
    this.loginEmail.getElement().setAttribute('name', 'email');
    this.loginEmail.getElement().setAttribute('placeholder', 'email');
    this.loginEmail.getElement().setAttribute('Required', 'true');

    this.loginPassword.getElement().setAttribute('type', 'password');
    this.loginPassword.getElement().setAttribute('name', 'password');
    this.loginPassword.getElement().setAttribute('placeholder', 'password');
    this.loginPassword.getElement().setAttribute('Required', 'true');

    this.loginEmail.getElement().addEventListener('input', () => this.validateEmail());
    this.loginPassword.getElement().addEventListener('input', () => this.validatePassword());

    showPasswordButton.getElement().addEventListener('click', (event) => this.showPassword(event));

    loginSubmitButton.getElement().addEventListener('click', (event) => {
      event.preventDefault();
      console.log('submit');
    });

    loginForm.addInnerElement(loginTitle);
    loginForm.addInnerElement(loginSubTitle);
    loginForm.addInnerElement(this.loginEmail);
    passwordBlock.addInnerElement(this.loginPassword);
    passwordBlock.addInnerElement(showPasswordButton);
    loginForm.addInnerElement(passwordBlock);
    loginForm.addInnerElement(loginSubmitButton);

    registrationField.addInnerElement(registrationTitle);
    registrationField.addInnerElement(toRegistrationLinkButton);

    this.getCreator().addInnerElement(loginForm);
    this.getCreator().addInnerElement(registrationField);
  }

  private showPassword(event: Event) {
    event.preventDefault();
    if (this.loginPassword.getElement().getAttribute('type') === 'password') {
      this.loginPassword.getElement().setAttribute('type', 'text');
    } else {
      this.loginPassword.getElement().setAttribute('type', 'password');
    }
  }

  private validateEmail() {
    const checkWightSpace = /(^\S*$)/;
    const { value } = this.loginEmail.getElement() as HTMLInputElement;
    (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity('');

    switch (true) {
      case !checkWightSpace.test(value):
        (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity(
          `Email address must not contain leading or trailing whitespace.`
        );
        break;

      default:
        (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity('');
    }

    (this.loginEmail.getElement() as HTMLInputElement).reportValidity();
  }

  private validatePassword() {
    const checkOneNumber = /(?=.*[0-9])/g;
    const checkOneLowerLatinSimbol = /(?=.*[a-z])/;
    const checkOneUpperLatinSimbol = /(?=.*[A-Z])/;
    const checkSpecialSimbols = /(?=.*[!@#$%^&*])/;
    const checkLenght = /[0-9a-zA-Z!@#$%^&*]{8,}/;
    const checkWightSpace = /(^\S*$)/;
    const passwordElement = this.loginPassword.getElement() as HTMLInputElement;

    const { value } = passwordElement;
    passwordElement.setCustomValidity('');

    switch (true) {
      case !checkWightSpace.test(value):
        passwordElement.setCustomValidity(`Password must not contain leading or trailing whitespace.`);
        break;

      case !checkOneNumber.test(value):
        passwordElement.setCustomValidity(`Password must contain at least one digit (0-9).`);
        break;

      case !checkOneLowerLatinSimbol.test(value):
        passwordElement.setCustomValidity(`Password must contain at least one lowercase letter (a-z).`);
        break;

      case !checkOneUpperLatinSimbol.test(value):
        passwordElement.setCustomValidity(`Password must contain at least one uppercase letter (A-Z).`);
        break;

      case !checkSpecialSimbols.test(value):
        passwordElement.setCustomValidity(`Password must contain at least one special character (e.g., !@#$%^&*).`);
        break;

      case !checkLenght.test(value):
        passwordElement.setCustomValidity(`Password must be at least 8 characters long.`);
        break;

      default:
        passwordElement.setCustomValidity('');
    }

    passwordElement.reportValidity();
  }

  private createMessagePopup(message: string) {
    const messagePopup = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss.login_form__popup],
      textContent: message,
    });

    this.getCreator().addInnerElement(messagePopup);
  }
}
