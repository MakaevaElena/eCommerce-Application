import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ctpClient } from './BuildClient';
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
      const email = (this.loginEmail.getElement() as HTMLInputElement).value;
      const password = (this.loginPassword.getElement() as HTMLInputElement).value;

      if (!email) {
        (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity(`Please fill the field email.`);
        (this.loginEmail.getElement() as HTMLInputElement).reportValidity();
      }
      if (!password) {
        (this.loginPassword.getElement() as HTMLInputElement).setCustomValidity(`Please fill the field password.`);
        (this.loginPassword.getElement() as HTMLInputElement).reportValidity();
      }

      if (email.length !== 0 && password.length !== 0 && this.validatePassword() && this.validateEmail()) {
        console.log(this.validateEmail());
        this.getCustomer({ email, password });
        this.checkCustomerExist(email);
      }
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
    const regExp = /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}/;
    const checkWightSpace = /(^\S*$)/;
    // TODO
    // const emailElement = this.loginEmail.getElement() as HTMLInputElement;
    const { value } = this.loginEmail.getElement() as HTMLInputElement;
    (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity('');

    switch (true) {
      case !checkWightSpace.test(value):
        (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity(
          `Email address must not contain leading or trailing whitespace.`
        );
        break;

      case !regExp.test(value):
        (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity(
          `Email address must be properly formatted (e.g., user@example.com).`
        );
        break;

      default:
        (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity('');
        return true;
    }

    (this.loginEmail.getElement() as HTMLInputElement).reportValidity();
    return false;
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
        return true;
    }

    passwordElement.reportValidity();
    return false;
  }

  // TODO вынести в client-api
  private apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: 'best-games' });

  private checkCustomerExist(email: string) {
    if (email !== undefined)
      this.returnCustomerByEmail(email)
        .then(({ body }) => {
          if (body.results.length === 0) {
            // this.createMessagePopup('This email address has not been registered.');
            (this.loginEmail.getElement() as HTMLInputElement).setCustomValidity(
              `This email address has not been registered.`
            );
            (this.loginEmail.getElement() as HTMLInputElement).reportValidity();
          } else {
            // console.log(body.results[0].id);
            // this.createMessagePopup(`Email ${body.results[0].email} exist`);
          }
        })
        .catch(console.error);
  }

  private returnCustomerByEmail(customerEmail: string) {
    return this.apiRoot
      .customers()
      .get({
        queryArgs: {
          where: `email="${customerEmail}"`,
        },
      })
      .execute();
  }

  // 'johndoe@example.com'
  // '123!@#qweQWE'
  private getCustomer({ email, password }: { email: string; password: string }) {
    return this.apiRoot
      .me()
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute()
      .then(({ body }) => {
        if (body.customer) {
          this.createMessagePopup('Welcome! You are logged!.');
          window.sessionStorage.setItem(`${email}_isLogin`, 'true');
        }
      })
      .catch(() => this.createMessagePopup(`This password wrong!.`));
  }

  private createMessagePopup(message: string) {
    const messagePopup = new ElementCreator({
      tag: TagName.DIV,
      classNames: [styleCss['login-form__popup']],
      textContent: message,
    });

    this.getCreator().addInnerElement(messagePopup);

    messagePopup.getElement().addEventListener('click', () => {
      messagePopup.getElement().remove();
    });
  }
}

// function createApiBuilderFromCtpClient(ctpClient: any) {
//   throw new Error('Function not implemented.');
// }
