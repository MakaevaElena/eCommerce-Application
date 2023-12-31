import styles from './registration-view.module.scss';
import linStyle from './link.module.scss';
import TagName from '../../../../enum/tag-name';
import { ElementParams } from '../../../../utils/element-creator';
import { InputParams } from '../../../../utils/input/inputParams';
import { InputLabels, InputTittles } from '../../../../utils/input/input-values/input-values';
import InputCreator from '../../../../utils/input/inputCreator';
import DefaultView from '../../default-view';
import Events from '../../../../enum/events';
import ButtonTypes from '../../../../enum/button-types';
import Inputs from './inputs-params/inputs';
import PostalPatterns from './inputs-params/postal-paterns';
import PostalTitles from './inputs-params/postal-titles';
import TextContents from './enum/text-contents';
import Router from '../../../router/router';
import { PagePath } from '../../../router/pages';
import EventName from '../../../../enum/event-name';
import Observer from '../../../../observer/observer';
import Delays from '../../../../enum/delays';
import StatusCodes from '../../../../enum/status-codes';
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import CountryOptions from '../../../../utils/input/options/country-options';
import InputParamsCreator from '../../../../utils/input/input-values/input-params-creator';
import Guid from '../../../../utils/guid';
import TotalApi from '../../../../api/total-api';
import createUser from '../../../../api/sdk/with-password-flow';
import ApiType from '../../../app/type';

export default class RegistrationView extends DefaultView {
  private api: TotalApi;

  private inputs: Array<InputCreator>;

  private mainInputsGroup: Array<InputCreator>;

  private shippingInputsGroup: Array<InputCreator>;

  private billingInputsGroup: Array<InputCreator>;

  private countryList: HTMLDataListElement;

  private checkValidityElement: HTMLDivElement;

  private buttonDefaultShippingAddress: HTMLButtonElement;

  private buttonDefaultBillingAddress: HTMLButtonElement;

  private buttonAddAddress: HTMLButtonElement;

  private billingLabel: HTMLLabelElement;

  private shippingLabel: HTMLLabelElement;

  private isDefaultShippingAddress: boolean;

  private isDefaultBillingAddress: boolean;

  private isBillingAddress: boolean;

  private observer = Observer.getInstance();

  private router: Router;

  private countryOption: CountryOptions;

  constructor(router: Router, paramApi: ApiType) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styles.registrationView],
      textContent: '',
    };
    super(params);
    this.api = paramApi.api;
    this.router = router;
    this.mainInputsGroup = this.fillInputsGroups(this.createMainParams());
    this.shippingInputsGroup = this.fillInputsGroups(this.createShippingAddressParams());
    this.billingInputsGroup = this.fillInputsGroups(this.createBillingAddressParams());
    this.inputs = [...this.mainInputsGroup, ...this.shippingInputsGroup, ...this.billingInputsGroup];
    this.checkValidityElement = this.createValidMessageElement();
    this.buttonDefaultShippingAddress = this.createDefaultButton(TextContents.BUTTON_DEFAULT, [
      styles.registrationView__defaultSelect,
    ]);
    this.buttonDefaultBillingAddress = this.createDefaultButton(TextContents.BUTTON_DEFAULT, [
      styles.registrationView__defaultSelect,
    ]);
    this.buttonAddAddress = this.createDefaultButton(TextContents.REMOVE_BILLING_ADDRESS, [
      styles.registrationView__buttonAddAdsress,
    ]);
    this.billingLabel = this.createLabel(InputLabels.BILLING_ADDRESS);
    this.shippingLabel = this.createLabel(InputLabels.SHIPPING_ADDRESS);
    this.isDefaultShippingAddress = false;
    this.isDefaultBillingAddress = false;
    this.isBillingAddress = true;
    this.countryOption = new CountryOptions();
    this.countryList = this.countryOption.getListElement();

    this.configView();
  }

  private configView() {
    const title = this.createTitle();
    const description = this.createDescription();
    const form = this.createForm();
    const button = document.createElement(TagName.BUTTON);
    button.textContent = TextContents.TO_LOGIN;
    button.classList.add(linStyle.button);
    button.addEventListener(Events.CLICK, this.redirectLoginhandler.bind(this));
    this.buttonAddAddress.addEventListener(Events.CLICK, this.toggleBillingAddressHandler.bind(this));
    this.getElement().append(title, description, button, form, this.buttonAddAddress, this.countryList);
  }

  private redirectLoginhandler() {
    this.router.setHref(PagePath.LOGIN);
  }

  private createValidMessageElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.textContent = TextContents.CHECK_VALIDITY;
    element.classList.add(styles.registrationView__checkValidity);
    element.addEventListener(Events.CLICK, this.removeValidityMessageHandler.bind(this));
    return element;
  }

  private removeValidityMessageHandler() {
    this.checkValidityElement.textContent = TextContents.CHECK_VALIDITY;
    this.getElement().removeChild(this.checkValidityElement);
  }

  // eslint-disable-next-line class-methods-use-this
  private createLabel(name: string) {
    const label = document.createElement('label');
    label.textContent = name;
    label.classList.add(styles.registrationView__inputsGroup);
    return label;
  }

  // eslint-disable-next-line class-methods-use-this
  private createTitle(): HTMLHeadElement {
    const title = document.createElement('h1');
    title.classList.add(styles.registrationView__tittle);
    title.textContent = TextContents.TITLE;
    return title;
  }

  // eslint-disable-next-line class-methods-use-this
  private createDescription(): HTMLParagraphElement {
    const description = document.createElement('p');
    description.classList.add(styles.registrationView__description);
    description.textContent = TextContents.DESCRIPTION;
    return description;
  }

  // eslint-disable-next-line class-methods-use-this
  private fillInputsGroups(inputsParams: Array<InputParams>): Array<InputCreator> {
    const inputs: Array<InputCreator> = [];
    inputsParams.forEach((inputParams: InputParams) => {
      const input = new InputCreator(inputParams);
      inputs.push(input);
    });

    return inputs;
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add(styles.registrationView__form);
    const mainBlock = document.createElement(TagName.DIV);
    mainBlock.classList.add(styles.registrationView__inputsGroup);
    const mainElementsGroup: Array<HTMLDivElement> = this.mainInputsGroup.map((input) => input.getElement());
    mainBlock.append(...mainElementsGroup);

    const shippingLabelGroup = this.creatLabelWithGroup(InputLabels.SHIPPING_ADDRESS, this.shippingInputsGroup);
    const billingLabelGroup = this.creatLabelWithGroup(InputLabels.BILLING_ADDRESS, this.billingInputsGroup);

    const button = document.createElement(TagName.BUTTON);
    button.classList.add(styles.registrationView__button);
    button.type = ButtonTypes.BUTTON;
    button.textContent = TextContents.BUTTON_SUBMIT;
    button.addEventListener(Events.CLICK, this.formSubmitHandler.bind(this));

    const buttonWrap = document.createElement(TagName.DIV);
    buttonWrap.classList.add(styles.registrationView__buttonWrap);
    buttonWrap.append(button);

    form.append(mainBlock, shippingLabelGroup, billingLabelGroup, buttonWrap);
    return form;
  }

  private creatLabelWithGroup(name: string, group: Array<InputCreator>): HTMLLabelElement {
    const elementGroup: Array<HTMLDivElement> = group.map((input) => input.getElement());

    let result: HTMLLabelElement = document.createElement('label');

    if (name === InputLabels.SHIPPING_ADDRESS) {
      this.shippingLabel.append(...elementGroup);
      this.shippingLabel.append(this.buttonDefaultShippingAddress);
      this.buttonDefaultShippingAddress.addEventListener(Events.CLICK, this.defaultShippingToggleHandler.bind(this));
      result = this.shippingLabel;
    }

    if (name === InputLabels.BILLING_ADDRESS) {
      this.billingLabel.append(...elementGroup);
      this.billingLabel.append(this.buttonDefaultBillingAddress);
      this.buttonDefaultBillingAddress.addEventListener(Events.CLICK, this.defaultBillingToggleHandler.bind(this));
      result = this.billingLabel;
    }

    return result;
  }

  // eslint-disable-next-line class-methods-use-this
  private createDefaultButton(text: string, classList: Array<string>): HTMLButtonElement {
    const defaultButton = document.createElement(TagName.BUTTON);
    defaultButton.type = ButtonTypes.BUTTON;
    defaultButton.textContent = text;
    defaultButton.classList.add(...classList);
    return defaultButton;
  }

  private passwordCheckHandler() {
    const checkingInput = this.inputs[Inputs.REPEAT_PASSWORD];
    const mainPassword = this.inputs[Inputs.PASSWORD].getInputValue();
    const checkPassword = checkingInput.getInputValue();

    if (mainPassword === checkPassword) {
      checkingInput.setCustomValidity('');
      checkingInput.removeMessage();
    } else {
      checkingInput.setMessageError(InputTittles.PASSWORD_REPEAT);
      checkingInput.setCustomValidity(InputTittles.PASSWORD_REPEAT);
    }
  }

  private validateCountryShippingHandler() {
    this.validateCountryList(this.inputs[Inputs.SHIPPING_COUNTRY], this.inputs[Inputs.SHIPPING_POSTAL]);
  }

  private validateCountryBillingHandler() {
    this.validateCountryList(this.inputs[Inputs.BILLING_COUNTRY], this.inputs[Inputs.BILLING_POSTAL]);
  }

  private validateCountryList(inputCountry: InputCreator, inputPostal: InputCreator): void {
    const countryList = this.countryOption.getCountryList();
    const country = inputCountry;
    const postal = inputPostal;
    const selectedCountry = country.getInputValue();
    if (countryList.flat().includes(selectedCountry)) {
      this.changePostalPatternWithCountry(postal, countryList, selectedCountry);
      country.setCustomValidity('');
    } else {
      country.setCustomValidity(InputTittles.COUNTRY_HINT);
      this.changePostalPatternWithOutCountry(postal);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private changePostalPatternWithCountry(
    postal: InputCreator,
    countryList: Array<Array<string>>,
    country: string
  ): void {
    countryList.forEach((countryGroup: Array<string>, numberGroup: number) => {
      if (countryGroup.includes(country)) {
        const pattern = Array.from(Object.values(PostalPatterns))[numberGroup];
        postal.setPattern(pattern);
        const title = Array.from(Object.values(PostalTitles))[numberGroup];
        const messageError = `${country.slice(0, -3)}\`s postal ${title}`;
        postal.setTitle(messageError);
        postal.setMessageError(messageError);
        postal.setCustomValidity('');
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private changePostalPatternWithOutCountry(postal: InputCreator) {
    postal.setTitle(InputTittles.WRONG_COUNTRY);
    postal.setMessageError(InputTittles.WRONG_COUNTRY);
    postal.setCustomValidity(InputTittles.WRONG_COUNTRY);
  }

  private defaultBillingToggleHandler() {
    if (this.isDefaultBillingAddress) {
      this.isDefaultBillingAddress = false;
      this.buttonDefaultBillingAddress.textContent = TextContents.BUTTON_DEFAULT;
      this.billingLabel.firstChild!.textContent = InputLabels.BILLING_ADDRESS;
    } else {
      this.isDefaultBillingAddress = true;
      this.buttonDefaultBillingAddress.textContent = TextContents.BUTTON_UN_DEFAULT;
      this.billingLabel.firstChild!.textContent = InputLabels.BILLING_ADDRESS_DEFAULT;
    }
  }

  private defaultShippingToggleHandler() {
    if (this.isDefaultShippingAddress) {
      this.isDefaultShippingAddress = false;
      this.buttonDefaultShippingAddress.textContent = TextContents.BUTTON_DEFAULT;
      this.shippingLabel.firstChild!.textContent = InputLabels.SHIPPING_ADDRESS;
    } else {
      this.isDefaultShippingAddress = true;
      this.buttonDefaultShippingAddress.textContent = TextContents.BUTTON_UN_DEFAULT;
      this.shippingLabel.firstChild!.textContent = InputLabels.SHIPPING_ADDRESS_DEFAULT;
    }
  }

  private toggleBillingAddressHandler() {
    const form = this.shippingLabel.parentNode!;

    if (this.isBillingAddress) {
      this.isBillingAddress = false;
      this.buttonAddAddress.textContent = TextContents.ADD_BILLING_ADDRESS;
      form.removeChild(this.billingLabel);
    } else {
      this.isBillingAddress = true;
      this.buttonAddAddress.textContent = TextContents.REMOVE_BILLING_ADDRESS;
      form.insertBefore(this.billingLabel, this.shippingLabel);
    }
  }

  private changeInputDateHandler() {
    if (this.inputs[Inputs.DATE_OF_BIRTH].getInput().checkValidity() === true) {
      this.inputs[Inputs.DATE_OF_BIRTH].setMessageError('');
    } else {
      this.inputs[Inputs.DATE_OF_BIRTH].setMessageError(InputTittles.DATE_OF_BIRTH_HINT);
    }
  }

  private getParams() {
    const params = {
      email: this.inputs[Inputs.EMAIL].getInputValue(),
      password: this.inputs[Inputs.PASSWORD].getInputValue(),
      firstName: this.inputs[Inputs.FIRST_NAME].getInputValue(),
      lastName: this.inputs[Inputs.LAST_NAME].getInputValue(),
      dateOfBirth: this.inputs[Inputs.DATE_OF_BIRTH].getInputValue(),
      countryStreetShipping: this.inputs[Inputs.SHIPPING_STREET].getInputValue(),
      countryCityShipping: this.inputs[Inputs.SHIPPING_CITY].getInputValue(),
      countryPostalShipping: this.inputs[Inputs.SHIPPING_POSTAL].getInputValue(),
      countryShippingCode: this.inputs[Inputs.SHIPPING_COUNTRY].getInputValue().slice(-2),
      countryStreetBilling: this.isBillingAddress
        ? this.inputs[Inputs.BILLING_STREET].getInputValue()
        : this.inputs[Inputs.SHIPPING_STREET].getInputValue(),
      countryCityBilling: this.isBillingAddress
        ? this.inputs[Inputs.BILLING_CITY].getInputValue()
        : this.inputs[Inputs.SHIPPING_CITY].getInputValue(),
      countryPostalBilling: this.isBillingAddress
        ? this.inputs[Inputs.BILLING_POSTAL].getInputValue()
        : this.inputs[Inputs.SHIPPING_POSTAL].getInputValue(),
      countryBillingCode: this.isBillingAddress
        ? this.inputs[Inputs.BILLING_COUNTRY].getInputValue().slice(-2)
        : this.inputs[Inputs.SHIPPING_COUNTRY].getInputValue().slice(-2),
      key: Guid.newGuid(),

      defaultShippingAddressNum: this.isDefaultShippingAddress ? 0 : undefined,
      defaultBillingAddressNum: this.getDefaultBillinAddressNum(),
    };
    return params;
  }

  private getDefaultBillinAddressNum(): number | undefined {
    let addressNumber: number | undefined;
    if (this.isBillingAddress) {
      addressNumber = this.isDefaultBillingAddress ? 1 : undefined;
    } else {
      addressNumber = this.isDefaultShippingAddress ? 1 : undefined;
    }

    return addressNumber;
  }

  private formSubmitHandler() {
    if (this.isCheckValidityFormHandler()) {
      const params = this.getParams();

      const loginParams = {
        email: this.inputs[Inputs.EMAIL].getInputValue(),
        password: this.inputs[Inputs.PASSWORD].getInputValue(),
      };
      this.api
        .getRegApi()
        .createCustomer(params)
        .then((response) => {
          if (response.statusCode === StatusCodes.USER_CREATED) {
            this.checkValidityElement.textContent = TextContents.REGISTRATION_OK;
            this.getElement().append(this.checkValidityElement);
            setTimeout(() => this.router.setHref(PagePath.LOGIN), Delays.SWITCH_TO_PAGE);
          }
        })
        .then(() => {
          this.makeLogin(loginParams);
        })
        .catch((error) => {
          this.checkValidityElement.textContent = error.message;
          this.getElement().append(this.checkValidityElement);
        });
    } else {
      this.getElement().append(this.checkValidityElement);
    }
  }

  private makeLogin(params: { email: string; password: string }) {
    const userID = localStorage.getItem(LocalStorageKeys.ANONIM_CART_ID);
    if (userID)
      this.api
        .getClientApi()
        .loginCustomer(params, userID)
        .then((response) => {
          if (response.body.customer) {
            window.localStorage.setItem(`isLogin`, 'true');
            window.localStorage.setItem(LocalStorageKeys.MAIL_ADDRESS, params.email);

            const client = createUser(params.email, params.password);
            this.api.recreate(client);

            const customerId = response.body.customer.id;
            localStorage.setItem(LocalStorageKeys.CUSTOMER_ID, customerId);
            localStorage.setItem(LocalStorageKeys.ANONYMOUS_ID, '');
            this.observer.notify(EventName.LOGIN);
          }
        });
  }

  private isCheckValidityFormHandler(): boolean {
    let result = true;
    this.mainInputsGroup.forEach((input) => {
      if (!input.getInput().checkValidity()) {
        result = false;
      }
    });

    this.shippingInputsGroup.forEach((input) => {
      if (!input.getInput().checkValidity()) {
        result = false;
      }
    });

    if (this.isBillingAddress) {
      this.billingInputsGroup.forEach((input) => {
        if (!input.getInput().checkValidity()) {
          result = false;
        }
      });
    }
    return result;
  }

  private createMainParams(): Array<InputParams> {
    const paramsCreator = new InputParamsCreator();
    const stylesList = [styles.registrationView__form];
    return [
      paramsCreator.getMailParams([styles.registrationView__form]),
      paramsCreator.getPasswordParams(stylesList, [[this.passwordCheckHandler.bind(this), Events.CHANGE]]),
      paramsCreator.getPasswordRepeatParams(stylesList, [[this.passwordCheckHandler.bind(this), Events.CHANGE]]),
      paramsCreator.getFirstNameParams(stylesList),
      paramsCreator.getLastNameParams(stylesList),
      paramsCreator.getDateParams(stylesList, [[this.changeInputDateHandler.bind(this), Events.CLICK]]),
    ];
  }

  private createShippingAddressParams(): Array<InputParams> {
    const paramsCreator = new InputParamsCreator();
    const stylesList = [styles.registrationView__form];
    return [
      paramsCreator.getStreetParams(stylesList),
      paramsCreator.getCityParams(stylesList),
      paramsCreator.getSPostalParams(stylesList),
      paramsCreator.getCountryParams(stylesList, [[this.validateCountryShippingHandler.bind(this), Events.CHANGE]]),
    ];
  }

  private createBillingAddressParams(): Array<InputParams> {
    const paramsCreator = new InputParamsCreator();
    const stylesList = [styles.registrationView__form];
    return [
      paramsCreator.getStreetParams(stylesList),
      paramsCreator.getCityParams(stylesList),
      paramsCreator.getSPostalParams(stylesList),
      paramsCreator.getCountryParams(stylesList, [[this.validateCountryBillingHandler.bind(this), Events.CHANGE]]),
    ];
  }
}
