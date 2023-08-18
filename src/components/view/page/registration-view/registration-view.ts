import styles from './registration-view.module.scss';
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
import PostalPaterns from './inputs-params/postal-paterns';
import PostalTitles from './inputs-params/postal-titles';

export default class RegistrationView extends DefaultView {
  private inputsParams: Array<InputParams>;

  private inputs: Array<InputCreator>;

  private mainInputsGroup: Array<HTMLDivElement>;

  private shippingInputsGroup: Array<HTMLDivElement>;

  private billingInputsGroup: Array<HTMLDivElement>;

  private countryList: HTMLDataListElement;

  constructor() {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styles.registrationView],
      textContent: '',
    };
    super(params);
    this.inputs = [];
    this.mainInputsGroup = [];
    this.billingInputsGroup = [];
    this.shippingInputsGroup = [];
    this.countryList = this.createCountryListElement();
    this.inputsParams = this.createParams();

    this.configView();
  }

  private configView() {
    this.fillInputsGroups();
    const form = this.createForm();
    this.getElement().append(form, this.countryList);
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
    const sixDigitsPostalCodeCountries = ['zzz'];
    const fiveDigitsPostalCodeCountries = ['Czech Republic', 'Greece', 'Slovakia', 'Sweden'];
    const fourDigitsPostalCodeCountries = [
      'Guinea',
      'Iceland',
      'Lesotho',
      'Madagascar',
      'Oman',
      'Palestine',
      'Papua New Guinea',
      'Afghanistan',
      'Albania',
      'Argentina',
      'Armenia',
      'Australia',
      'Austria',
      'Bangladesh',
      'Belgium',
      'Bulgaria',
      'Cape Verde',
      'Christmas Island',
      'Greenland',
      'Hungary',
      'Liechtenstein',
    ];
    const twoDigitsPostalCodeCountries = ['Jamaica', 'Singapore'];
    const twoLetterThreeDigitsPostalCodeCountries = ['Faroe Islands', 'Barbados'];
    const twoLetterFourDigitsPostalCodeCountries = [
      'Azerbaijan',
      'Latvia',
      'British Virgin Islands',
      'Saint Kitts and Nevis',
      'Saint Vincent and the Grenadines',
      'Samoa',
      'Moldova',
    ];
    const twoLetterFiveDigitsPostalCodeCountries = ['Lithuania', 'Andorra'];
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
      if (inputParams.group === InputsGroups.MAIN) {
        this.mainInputsGroup.push(input.getElement());
      } else if (inputParams.group === InputsGroups.SHIPPING) {
        this.shippingInputsGroup.push(input.getElement());
      } else {
        this.billingInputsGroup.push(input.getElement());
      }
    });
  }

  private createForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.classList.add(styles.registrationView__form);
    const mainBlock = document.createElement(TagName.DIV);
    mainBlock.classList.add(styles.registrationView__mainInputs);
    mainBlock.append(...this.mainInputsGroup);

    const shippingLabelGroup = this.creatLabelWithGroup(InputLabels.SHIPPING_ADDRESS, this.shippingInputsGroup);
    const billingLabelGroup = this.creatLabelWithGroup(InputLabels.BILLING_ADDRESS, this.billingInputsGroup);

    const button = document.createElement(TagName.BUTTON);
    button.type = ButtonTypes.SUBMIT;
    button.textContent = 'submit';

    const buttonWrap = document.createElement(TagName.DIV);
    buttonWrap.classList.add(styles.registrationView__button);
    buttonWrap.append(button);

    form.append(mainBlock, shippingLabelGroup, billingLabelGroup, buttonWrap);
    return form;
  }

  private creatLabelWithGroup(name: string, group: Array<HTMLDivElement>): HTMLLabelElement {
    const labelWithGroup = document.createElement('label');
    labelWithGroup.textContent = name;
    labelWithGroup.classList.add(styles.registrationView__label);
    labelWithGroup.append(...group);
    return labelWithGroup;
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
      // checkingInput.setMessageError(InputTittles.PASSWORD_REPEAT);
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
        const pattern = Array.from(Object.values(PostalPaterns))[numberGroup];
        postal.setPattern(pattern);
        const title = Array.from(Object.values(PostalTitles))[numberGroup];
        const messageError = `${country}\`s postal ${title}`;
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
        group: InputsGroups.MAIN,
        attributes: {
          type: InputTypes.DATE,
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

export function getView(): RegistrationView {
  return new RegistrationView();
}
