import ClientApi from '../../../../api/client-api';
import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './login-view.module.scss';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';

import { PagePath } from '../../../router/pages';
import Router from '../../../router/router';

const checkOneNumber = /(?=.*[0-9])/g;
const checkOneLowerLatinSimbol = /(?=.*[a-z])/;
const checkOneUpperLatinSimbol = /(?=.*[A-Z])/;
const checkSpecialSimbols = /(?=.*[!@#$%^&*])/;
const checkLenght = /[0-9a-zA-Z!@#$%^&*]{8,}/;
const checkWightSpace = /(^\S*$)/;
const checkEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}/;

enum Message {
  FILL_EMAIL = `Please fill the field email.`,
  FILL_PASSWORD = `Please fill the field password.`,
  MAIL_NOT_REGISTERED = `This email address has not been registered.`,
  SUCCESS_LOGIN = 'Welcome! You are logged!.',
  PASSWORD_IS_WRONG = `Password is wrong!`,
  EMAIL_CONTAIN_WHITESPACE = `Email address must not contain leading or trailing whitespace.`,
  EMAIL_WRONG_FORMAT = `Email address must be properly formatted (e.g., user@example.com).`,
  PASSWORD_CONTAIN_WHITESPACE = `Password must not contain leading or trailing whitespace.`,
  PASSWORD_NOT_CONTAIN_DIGIT = `Password must contain at least one digit (0-9).`,
  PASSWORD_NOT_CONTAIN_LOWER_LETTER = `Password must contain at least one lowercase letter (a-z).`,
  PASSWORD_NOT_CONTAIN_UPPER_LETTER = `Password must contain at least one uppercase letter (A-Z).`,
  PASSWORD_NOT_CONTAIN_SIMBOLS = `Password must contain at least one special character (e.g., !@#$%^&*).`,
  PASSWORD_LENGTH_NOT_ENOUTH = `Password must be at least 8 characters long.`,
}

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

  private observer: Observer;

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

    this.observer = Observer.getInstance();
    this.observer?.subscribe(EventName.LOGOUT, this.updateLoginPage.bind(this));

    this.anonimApi = new ClientApi();

    if (localStorage.getItem('isLogin') === 'true') {
      console.log('localStorage', localStorage.getItem('isLogin'));
      this.router.navigate(PagePath.INDEX);
    } else {
      this.configView();
    }
  }

  private configView() {
    this.renderForm();
  }

  private updateLoginPage() {
    this.getCreator().clearInnerContent();
    this.configView();
    this.anonimApi = new ClientApi();
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
      textContent: 'Sign Into Best Games',
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

    loginSubmitButton.getElement().addEventListener('click', (event) => this.submitLogin(event));

    toRegistrationLinkButton.getElement().addEventListener('click', () => {
      this.router.navigate(PagePath.REGISTRATION);
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

  private submitLogin(event: Event) {
    event.preventDefault();
    const email = this.emailElement.value;
    const password = this.passwordElement.value;

    if (!email) {
      this.emailElement.setCustomValidity(Message.FILL_EMAIL);
      this.emailElement.reportValidity();
    }
    if (!password) {
      this.passwordElement.setCustomValidity(Message.FILL_PASSWORD);
      this.passwordElement.reportValidity();
    }

    if (email.length !== 0 && password.length !== 0 && this.validatePassword() && this.validateEmail()) {
      if (email !== undefined) {
        this.anonimApi
          .checkCustomerExist(email)
          .then((response) => {
            if (response.body.results.length === 0) {
              this.emailElement.setCustomValidity(Message.MAIL_NOT_REGISTERED);
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

            // this.createMessagePopup(Message.SUCCESS_LOGIN);
            window.localStorage.setItem(`isLogin`, 'true');
            this.observer.notify(EventName.LOGIN);

            this.router.navigate(PagePath.INDEX);

            this.userApi = new ClientApi({ email, password });
            // this.userApi.getCustomer({ email, password });
            this.userApi.returnCustomerById(response.body.customer.id);

            // this.userApi
            //   .getCartByCustomerId(response.body.customer.id)
            //   .then((CartByCustomerId) => console.log('cart exist', CartByCustomerId))
            //   .catch(() => {
            //     if (this.userApi)
            //       this.userApi
            //         .createCart(response.body.customer.id)
            //         .then((cart) => {
            //           console.log('new cart created', cart);
            //         })
            //         .catch((error) => console.log(error));
            // });
          }
        })
        .catch(() => {
          this.passwordElement.setCustomValidity(Message.PASSWORD_IS_WRONG);
          this.passwordElement.reportValidity();
        });
    }
  }

  private validateEmail() {
    const { value } = this.loginEmail.getElement() as HTMLInputElement;
    this.emailElement.setCustomValidity('');

    switch (true) {
      case !checkWightSpace.test(value):
        this.emailElement.setCustomValidity(Message.EMAIL_CONTAIN_WHITESPACE);
        break;

      case !checkEmail.test(value):
        this.emailElement.setCustomValidity(Message.EMAIL_WRONG_FORMAT);
        break;

      default:
        this.emailElement.setCustomValidity('');
        return true;
    }

    this.emailElement.reportValidity();
    return false;
  }

  private validatePassword() {
    const { value } = this.passwordElement;
    this.passwordElement.setCustomValidity('');

    switch (true) {
      case !checkWightSpace.test(value):
        this.passwordElement.setCustomValidity(Message.PASSWORD_CONTAIN_WHITESPACE);
        break;

      case !checkOneNumber.test(value):
        this.passwordElement.setCustomValidity(Message.PASSWORD_NOT_CONTAIN_DIGIT);
        break;

      case !checkOneLowerLatinSimbol.test(value):
        this.passwordElement.setCustomValidity(Message.PASSWORD_NOT_CONTAIN_LOWER_LETTER);
        break;

      case !checkOneUpperLatinSimbol.test(value):
        this.passwordElement.setCustomValidity(Message.PASSWORD_NOT_CONTAIN_UPPER_LETTER);
        break;

      case !checkSpecialSimbols.test(value):
        this.passwordElement.setCustomValidity(Message.PASSWORD_NOT_CONTAIN_SIMBOLS);
        break;

      case !checkLenght.test(value):
        this.passwordElement.setCustomValidity(Message.PASSWORD_LENGTH_NOT_ENOUTH);
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
