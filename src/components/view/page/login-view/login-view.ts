import ClientApi from './client-api';
import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './login-view.module.scss';

import { PagePath } from '../../../router/pages';
import Router from '../../../router/router';

export default class LoginView extends DefaultView {
  private router: Router;

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

  private passwordElement = this.loginPassword.getElement() as HTMLInputElement;

  private emailElement = this.loginEmail.getElement() as HTMLInputElement;

  private anonimApi: ClientApi;

  private userApi?: ClientApi;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      // classNames: Object.values(styleCss),
      classNames: [styleCss['login-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.configView();

    this.anonimApi = new ClientApi();
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

    this.emailElement.setAttribute('type', 'email');
    this.emailElement.setAttribute('name', 'email');
    this.emailElement.setAttribute('placeholder', 'email');
    this.emailElement.setAttribute('Required', 'true');

    this.passwordElement.setAttribute('type', 'password');
    this.passwordElement.setAttribute('name', 'password');
    this.passwordElement.setAttribute('placeholder', 'password');
    this.passwordElement.setAttribute('Required', 'true');

    this.emailElement.addEventListener('input', () => this.validateEmail());
    this.passwordElement.addEventListener('input', () => this.validatePassword());

    showPasswordButton.getElement().addEventListener('click', (event) => this.showPassword(event));

    loginSubmitButton.getElement().addEventListener('click', (event) => {
      event.preventDefault();
      const email = this.emailElement.value;
      const password = this.passwordElement.value;

      if (!email) {
        this.emailElement.setCustomValidity(`Please fill the field email.`);
        this.emailElement.reportValidity();
      }
      if (!password) {
        this.passwordElement.setCustomValidity(`Please fill the field password.`);
        this.passwordElement.reportValidity();
      }

      if (email.length !== 0 && password.length !== 0 && this.validatePassword() && this.validateEmail()) {
        if (email !== undefined) {
          this.anonimApi
            .checkCustomerExist(email)
            .then((response) => {
              if (response.body.results.length === 0) {
                this.emailElement.setCustomValidity(`This email address has not been registered.`);
                this.emailElement.reportValidity();
              } else {
                console.log();
              }
            })
            .catch(console.error);
        }

        this.anonimApi
          .getCustomer({ email, password })
          .then((response) => {
            if (response.body.customer) {
              console.log('all response', response);

              this.createMessagePopup('Welcome! You are logged!.');
              window.localStorage.setItem(`${email}_isLogin`, 'true');

              // TODO REDIRECT TO HOME
              this.router.navigate(PagePath.INDEX);

              this.userApi = new ClientApi({ email, password });

              this.userApi
                .getCartByCustomerId(response.body.customer.id)
                .then((CartByCustomerId) => console.log('cart exist', CartByCustomerId))
                .catch(() => {
                  if (this.userApi)
                    this.userApi
                      .createCart(response.body.customer.id)
                      .then((cart) => {
                        console.log('new cart created', cart);
                      })
                      .catch((error) => console.log(error));
                });
            }
          })
          .catch(() => {
            this.passwordElement.setCustomValidity(`Password is wrong!`);
            this.passwordElement.reportValidity();
          });
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

    if (this.passwordElement.getAttribute('type') === 'password') {
      this.passwordElement.setAttribute('type', 'text');
    } else {
      this.passwordElement.setAttribute('type', 'password');
    }
  }

  private validateEmail() {
    const regExp = /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}/;
    const checkWightSpace = /(^\S*$)/;
    const { value } = this.loginEmail.getElement() as HTMLInputElement;
    this.emailElement.setCustomValidity('');

    switch (true) {
      case !checkWightSpace.test(value):
        this.emailElement.setCustomValidity(`Email address must not contain leading or trailing whitespace.`);
        break;

      case !regExp.test(value):
        this.emailElement.setCustomValidity(`Email address must be properly formatted (e.g., user@example.com).`);
        break;

      default:
        this.emailElement.setCustomValidity('');
        return true;
    }

    this.emailElement.reportValidity();
    return false;
  }

  private validatePassword() {
    const checkOneNumber = /(?=.*[0-9])/g;
    const checkOneLowerLatinSimbol = /(?=.*[a-z])/;
    const checkOneUpperLatinSimbol = /(?=.*[A-Z])/;
    const checkSpecialSimbols = /(?=.*[!@#$%^&*])/;
    const checkLenght = /[0-9a-zA-Z!@#$%^&*]{8,}/;
    const checkWightSpace = /(^\S*$)/;

    const { value } = this.passwordElement;
    this.passwordElement.setCustomValidity('');

    switch (true) {
      case !checkWightSpace.test(value):
        this.passwordElement.setCustomValidity(`Password must not contain leading or trailing whitespace.`);
        break;

      case !checkOneNumber.test(value):
        this.passwordElement.setCustomValidity(`Password must contain at least one digit (0-9).`);
        break;

      case !checkOneLowerLatinSimbol.test(value):
        this.passwordElement.setCustomValidity(`Password must contain at least one lowercase letter (a-z).`);
        break;

      case !checkOneUpperLatinSimbol.test(value):
        this.passwordElement.setCustomValidity(`Password must contain at least one uppercase letter (A-Z).`);
        break;

      case !checkSpecialSimbols.test(value):
        this.passwordElement.setCustomValidity(
          `Password must contain at least one special character (e.g., !@#$%^&*).`
        );
        break;

      case !checkLenght.test(value):
        this.passwordElement.setCustomValidity(`Password must be at least 8 characters long.`);
        break;

      default:
        this.passwordElement.setCustomValidity('');
        return true;
    }

    this.passwordElement.reportValidity();
    return false;
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

//
export function getView(router: Router): LoginView {
  return new LoginView(router);
}
