import styles from './registration-view.module.scss';
import linStyle from './link.module.scss';
import TagName from '../../../../enum/tag-name';
import { ElementParams } from '../../../../utils/element-creator';
import { InputParams } from '../../../../utils/input/inputParams';
import {
  InputLabels,
  InputNames,
  InputPatterns,
  InputPlaceholders,
  InputTittles,
  InputTypes,
} from '../../../../utils/input/input-values/input-values';
import InputCreator from '../../../../utils/input/inputCreator';
import DefaultView from '../../default-view';
import InputsGroups from '../../../../utils/input/input-values/inputs-groups';
import InputsList from './inputs-params/inputs-list';
import Events from '../../../../enum/events';
import ButtonTypes from '../../../../enum/button-types';
import Inputs from './inputs-params/inputs';
import PostalPatterns from './inputs-params/postal-paterns';
import PostalTitles from './inputs-params/postal-titles';
import TextContents from './enum/text-contents';
import RegApi from '../../../../api/reg-api';
import Router from '../../../router/router';
import { PagePath } from '../../../router/pages';
import ClientApi from '../../../../api/client-api';
import EventName from '../../../../enum/event-name';
import Observer from '../../../../observer/observer';

export default class RegistrationView extends DefaultView {
  private inputsParams: Array<InputParams>;

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

  private observer: Observer;

  private router: Router;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styles.registrationView],
      textContent: '',
    };
    super(params);
    this.router = router;
    this.observer = Observer.getInstance();
    this.inputs = [];
    this.mainInputsGroup = [];
    this.billingInputsGroup = [];
    this.shippingInputsGroup = [];
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
    this.countryList = this.createCountryListElement();
    this.inputsParams = this.createParams();

    this.configView();
  }

  private configView() {
    const title = this.createTitle();
    const description = this.createDescription();
    this.fillInputsGroups();
    const form = this.createForm();
    const button = document.createElement(TagName.BUTTON);
    button.textContent = TextContents.TO_LOGIN;
    button.classList.add(linStyle.button);
    button.addEventListener(Events.CLICK, this.redirectLoginhandler.bind(this));
    this.buttonAddAddress.addEventListener(Events.CLICK, this.toggleBillingAddressHandler.bind(this));
    this.getElement().append(title, description, button, form, this.buttonAddAddress, this.countryList);
  }

  private redirectLoginhandler() {
    this.router.navigate(PagePath.LOGIN);
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

  private createLabel(name: string) {
    const label = document.createElement('label');
    label.textContent = name;
    label.classList.add(styles.registrationView__inputsGroup);
    return label;
  }

  private createTitle(): HTMLHeadElement {
    const title = document.createElement('h1');
    title.classList.add(styles.registrationView__tittle);
    title.textContent = TextContents.TITLE;
    return title;
  }

  private createDescription(): HTMLParagraphElement {
    const description = document.createElement('p');
    description.classList.add(styles.registrationView__description);
    description.textContent = TextContents.DESCRIPTION;
    return description;
  }

  private createCountryListElement(): HTMLDataListElement {
    const countryListElement = document.createElement('datalist');
    countryListElement.id = InputsList.COUNTRY;

    const optionValues = this.createCountryList().flat().sort();
    optionValues.forEach((optionValue) => {
      const optionElement = this.createOptionElement(optionValue);
      countryListElement.append(optionElement);
    });

    return countryListElement;
  }

  private createOptionElement(value: string): HTMLOptionElement {
    const optionElement = document.createElement('option');
    optionElement.value = value;
    return optionElement;
  }

  private createCountryList(): Array<Array<string>> {
    const sixDigitsPostalCodeCountries = [
      'Belarus BY',
      'China CN',
      'Colombia CO',
      'Ecuador EC',
      'Kazakhstan KZ',
      'Kyrgyzstan KG',
      'Malawi MW',
      'Nigeria NG',
      'Romania RO',
      'Russia RU',
      'Singapore SG',
      'Tajikistan TJ',
      'Trinidad and Tobago TT',
      'Turkmenistan TM',
      'Uzbekistan UZ',
      'India IN',
    ];
    const fiveDigitsPostalCodeCountries = [
      'Czech Republic CZ',
      'Greece CR',
      'Slovakia SK',
      'Sweden SE',
      'Algeria DZ',
      'Bhutan BT',
      'Bosnia and Herzegovina BA',
      'Costa Rica CR',
      'Croatia HR',
      'Cuba CU',
      'Dominican Republic DO',
      'Egypt EG',
      'Estonia EE',
      'Finland FI',
      'France FR',
      'Germany DE',
      'Guatemala GT',
      'Indonesia ID',
      'Iraq IQ',
      'Italy IT',
      'Jordan JO',
      'Kenya KE',
      'Korea, South KR',
      'Kosovo XK',
      'Kuwait KW',
      'Laos LA',
      'Malaysia MY',
      'Maldives MV',
      'Mauritius MU',
      'Mexico MX',
      'Mongolia MN',
      'Montenegro ME',
      'Morocco MA',
      'Myanmar MM',
      'Namibia NA',
      'Nepal NP',
      'Nicaragua NI',
      'Pakistan PK',
      'Puerto Rico PR',
      'Senegal SN',
      'Serbia RS',
      'Spain ES',
      'Sri Lanka LK',
      'Sudan SD',
      'Tanzania TZ',
      'Thailand TH',
      'Turkey TR',
      'Ukraine UA',
      'United States US',
      'Uruguay UY',
      'Vietnam VN',
      'Zambia ZM',
      'Saudi Arabia SA',
      'Iran IR',
      'Peru PE',
      'Åland AX',
      'Lebanon LB',
      'Brazil BR',
      'American Samoa AS',
      'Guam GU',
      'Marshall Islands MH',
      'Micronesia FM',
      'Northern Mariana Islands MP',
      'Palau PW',
      'U.S. Virgin Islands VI',
    ];
    const fourDigitsPostalCodeCountries = [
      'Guinea',
      'Iceland',
      'Lesotho',
      'Madagascar',
      'Oman',
      'Palestine',
      'Papua New Guinea',
      'Afghanistan AF',
      'Albania AL',
      'Argentina AR',
      'Armenia AM',
      'Australia AU',
      'Austria AT',
      'Bangladesh BD',
      'Belgium BE',
      'Bulgaria BG',
      'Cape Verde CV',
      'Christmas Island CX',
      'Greenland GL',
      'Hungary HU',
      'Liechtenstein LI',
      'Luxembourg LU',
      'New Zealand NZ',
      'Niger NE',
      'North Macedonia MK',
      'Norway NO',
      'Panama PA',
      'Paraguay PY',
      'Philippines PH',
      'Portugal PT',
      'Singapore SG',
      'South Africa ZA',
      'Switzerland CH',
      'Svalbard and Jan Mayen SJ',
      'Tunisia TN',
      'Portugal PT',
      'Slovenia SI',
      'Venezuela VE',
    ];
    const twoDigitsPostalCodeCountries = ['Jamaica JM', 'Singapore SG'];
    const twoLetterThreeDigitsPostalCodeCountries = ['Faroe Islands', 'Barbados', 'Andorra AD'];
    const twoLetterFourDigitsPostalCodeCountries = [
      'Azerbaijan AZ',
      'Latvia LV',
      'British Virgin Islands VG',
      'Saint Kitts and Nevis KN',
      'Saint Vincent and the Grenadines VC',
      'Samoa WS',
      'Moldova MD',
    ];
    const twoLetterFiveDigitsPostalCodeCountries = ['Lithuania LT', 'Barbados BB'];
    const allCountries = [
      sixDigitsPostalCodeCountries,
      fiveDigitsPostalCodeCountries,
      fourDigitsPostalCodeCountries,
      twoDigitsPostalCodeCountries,
      twoLetterThreeDigitsPostalCodeCountries,
      twoLetterFourDigitsPostalCodeCountries,
      twoLetterFiveDigitsPostalCodeCountries,
    ];
    return allCountries;
  }

  private fillInputsGroups(): void {
    this.inputsParams.forEach((inputParams: InputParams) => {
      const input = new InputCreator(inputParams);
      this.inputs.push(input);
      if (inputParams.group) {
        if (inputParams.group === InputsGroups.MAIN) {
          this.mainInputsGroup.push(input);
        } else if (inputParams.group === InputsGroups.SHIPPING) {
          this.shippingInputsGroup.push(input);
        } else {
          this.billingInputsGroup.push(input);
        }
      }
    });
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
    } else {
      checkingInput.setCustomValidity(InputTittles.PASSWORD_REPEAT);
      checkingInput.setTitle(InputTittles.PASSWORD_REPEAT);
    }
  }

  private validateCountryShippingHandler() {
    this.validateCountryList(this.inputs[Inputs.SHIPPING_COUNTRY], this.inputs[Inputs.SHIPPING_POSTAL]);
  }

  private validateCountryBillingHandler() {
    this.validateCountryList(this.inputs[Inputs.BILLING_COUNTRY], this.inputs[Inputs.BILLING_POSTAL]);
  }

  private validateCountryList(inputCountry: InputCreator, inputPostal: InputCreator): void {
    const countryList = this.createCountryList();
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

  private changePostalPatternWithOutCountry(postal: InputCreator) {
    postal.setTitle(InputTittles.WRONG_COUNTRY);
    postal.setMessageError(InputTittles.WRONG_COUNTRY);
    postal.setCustomValidity(InputTittles.WRONG_COUNTRY);
  }

  private maxPossibleDate(minYears: string): string {
    const numLength = 2;
    const today = new Date();
    const year = today.getFullYear() - Number(minYears);
    const month = today.getMonth().toString().padStart(numLength, '0');
    const day = today.getDate().toString().padStart(numLength, '0');
    const maxDate = `${year}-${month}-${day}`;
    return maxDate;
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

  private formSubmitHandler() {
    if (this.isCheckValidityFormHandler()) {
      const api = new RegApi();
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
        key: Math.floor(Math.random() * 200).toString(),
        defaultShippingAddressNum: this.isDefaultShippingAddress ? 0 : undefined,
        defaultBillingAddressNum: this.isBillingAddress
          ? this.isDefaultBillingAddress
            ? 1
            : undefined
          : this.isDefaultShippingAddress
          ? 1
          : undefined,
      };

      const loginParams = {
        email: this.inputs[Inputs.EMAIL].getInputValue(),
        password: this.inputs[Inputs.PASSWORD].getInputValue(),
      };
      api
        .createCustomer(params)
        .then((response) => {
          if ((response.statusCode = 201)) {
            this.checkValidityElement.textContent = TextContents.REGISTRATION_OK;
            this.getElement().append(this.checkValidityElement);
            setTimeout(() => this.router.navigate(PagePath.LOGIN), 2000);
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
    const loginApi = new ClientApi();
    loginApi.getCustomer(params).then((response) => {
      if (response.body.customer) {
        window.localStorage.setItem(`isLogin`, 'true');
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

  private createParams(): Array<InputParams> {
    return [
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.EMAIL,
          name: InputNames.EMAIL,
          placeholder: InputPlaceholders.EMAIL,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.PASSWORD,
          name: InputNames.PASSWORD,
          placeholder: InputPlaceholders.PASSWORD,
          title: InputTittles.PASSWORD,
          pattern: InputPatterns.PASSWORD,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        callback: [[this.passwordCheckHandler.bind(this), Events.CHANGE]],
        attributes: {
          type: InputTypes.PASSWORD,
          name: InputNames.REPEAT_PASSWORD,
          placeholder: InputPlaceholders.REPEAT_PASSWORD,
          title: InputTittles.PASSWORD,
          pattern: InputPatterns.PASSWORD,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.FIRST_NAME,
          placeholder: InputPlaceholders.FIRST_NAME,
          title: InputTittles.TEXT,
          pattern: InputPatterns.TEXT,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.LAST_NAME,
          placeholder: InputPlaceholders.LAST_NAME,
          title: InputTittles.TEXT,
          pattern: InputPatterns.TEXT,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: [[this.changeInputDateHandler.bind(this), Events.CLICK]],
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.DATE,
          placeholder: InputTittles.DATE_OF_BIRTH_HINT,
          name: InputNames.DATE_OF_BIRTH,
          title: InputTittles.DATE_OF_BIRTH_HINT,
          max: this.maxPossibleDate(InputPatterns.DATE_OF_BIRTH_MAX),
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_STREET,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.STREET,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_CITY,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.CITY,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_POSTAL,
          title: InputTittles.POSTAL_HINT,
          placeholder: InputPlaceholders.POSTAL,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: [[this.validateCountryShippingHandler.bind(this), Events.CHANGE]],
        group: InputsGroups.SHIPPING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.SHIPPING_COUNTRY,
          title: InputTittles.COUNTRY_HINT,
          placeholder: InputPlaceholders.COUNTRY,
          list: InputsList.COUNTRY,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.BILLING_STREET,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.STREET,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.BILLING_CITY,
          title: InputTittles.EASY_TEXT,
          placeholder: InputPlaceholders.CITY,
        },
      },
      {
        classNames: [styles.registrationView__form],
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.BILLING_POSTAL,
          title: InputTittles.POSTAL_HINT,
          placeholder: InputPlaceholders.POSTAL,
        },
      },
      {
        classNames: [styles.registrationView__form],
        callback: [[this.validateCountryBillingHandler.bind(this), Events.CHANGE]],
        group: InputsGroups.BILLING,
        attributes: {
          type: InputTypes.TEXT,
          name: InputNames.BILLING_COUNTRY,
          title: InputTittles.COUNTRY_HINT,
          placeholder: InputPlaceholders.COUNTRY,
          list: InputsList.COUNTRY,
        },
      },
    ];
  }
}

export function getView(router: Router): RegistrationView {
  return new RegistrationView(router);
}
