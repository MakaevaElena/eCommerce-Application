import stylesRedactionMode from '../styles/redaction-mode-style.module.scss';
import TagName from '../../../../../../enum/tag-name';
import styleGroupFields from '../styles/field-group.module.scss';
import UserField from '../user-field';
import CountryValues from './country-values';
import InputParamsCreator from '../../../../../../utils/input/input-values/input-params-creator';
import UserFieldProps from '../user-field-props';
import CountryOptions from '../../../../../../utils/input/options/country-options';
import TextContent from '../../enum/text-content';
import InputCreator from '../../../../../../utils/input/inputCreator';
import { InputTittles } from '../../../../../../utils/input/input-values/input-values';
import PostalPatterns from '../../../registration-view/inputs-params/postal-paterns';
import PostalTitles from '../../../registration-view/inputs-params/postal-titles';
import Events from '../../../../../../enum/events';
import InfoMessage from '../../../../../message/info-message';
import RegApi from '../../../../../../api/reg-api';
import LocalStorageKeys from '../../../../../../enum/local-storage-keys';
import ErrorMessage from '../../../../../message/error-message';
import WarningMessage from '../../../../../message/warning-message';

export default class AddressFieldsGroup {
  private addressGroup: HTMLDivElement;

  private streetField: UserField;

  private cityField: UserField;

  private postalField: UserField;

  private countryField: UserField;

  private values: Array<string>;

  private title: HTMLElement;

  private confirmButtons: Array<HTMLButtonElement>;

  private fields: Array<UserField>;

  private inputsParams: InputParamsCreator;

  private countryOptions: CountryOptions;

  private addressId: string;

  constructor(values: Array<string>, title: string, isDefault: boolean | undefined) {
    this.addressGroup = this.createAddressFieldGroupElement();
    this.values = values;
    this.addressId = values[0];
    this.countryOptions = new CountryOptions();

    this.inputsParams = new InputParamsCreator();

    this.title = this.createTitle(title);
    this.streetField = this.createStreetField();
    this.cityField = this.createCityField();
    this.postalField = this.createPostalField();
    this.countryField = this.createCountryField();

    this.confirmButtons = this.createConfirmButtons();
    this.configureConfirmButtons();
    this.fields = [this.streetField, this.cityField, this.postalField, this.countryField];

    this.countryField.getElement().addEventListener(Events.CHANGE, this.validateCountryListHandler.bind(this));
    this.countryField.getElement().addEventListener('change', this.changeCountryHandler.bind(this));

    this.configureView();
    this.makeAddressDefault(isDefault);
  }

  getElement() {
    return this.addressGroup;
  }

  private configureView() {
    this.addressGroup.append(
      this.title,
      this.streetField.getElement(),
      this.cityField.getElement(),
      this.postalField.getElement(),
      this.countryField.getElement(),
      this.countryOptions.getListElement()
    );
  }

  private createConfirmButtons(): Array<HTMLButtonElement> {
    return [
      this.streetField.getConfirmButton(),
      this.cityField.getConfirmButton(),
      this.postalField.getConfirmButton(),
      this.countryField.getConfirmButton(),
    ];
  }

  private configureConfirmButtons() {
    this.confirmButtons.forEach((button) => button.addEventListener(Events.CLICK, this.confirmHandler.bind(this)));
  }

  private createAddressFieldGroupElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(styleGroupFields));
    return element;
  }

  private createStreetField(): UserField {
    const value = this.values[CountryValues.STREET];
    const userFieldProps: UserFieldProps = {
      id: 'this.userData.id',
      action: '',
      actionName: '',
      value,
      inputParams: this.inputsParams.getStreetParams(),
    };
    const fieldCreator = new UserField(userFieldProps);
    return fieldCreator;
  }

  private createCityField(): UserField {
    const value = this.values[CountryValues.CITY];
    const userFieldProps: UserFieldProps = {
      id: 'this.userData.id',
      action: '',
      actionName: '',
      value,
      inputParams: this.inputsParams.getCityParams(),
    };
    const fieldCreator = new UserField(userFieldProps);
    return fieldCreator;
  }

  private createPostalField(): UserField {
    const value = this.values[CountryValues.POSTAL];
    const userFieldProps: UserFieldProps = {
      id: 'this.userData.id',
      action: '',
      actionName: '',
      value,
      inputParams: this.inputsParams.getSPostalParams(),
    };
    const fieldCreator = new UserField(userFieldProps);
    return fieldCreator;
  }

  private createCountryField(): UserField {
    const value = this.countryOptions.getCountryByCode(this.values[CountryValues.COUNTRY]);
    const userFieldProps: UserFieldProps = {
      id: 'this.userData.id',
      action: '',
      actionName: '',
      value,
      inputParams: this.inputsParams.getCountryParams(),
    };
    const fieldCreator = new UserField(userFieldProps);
    return fieldCreator;
  }

  private createTitle(textContent: string) {
    const title = document.createElement('h3');
    title.textContent = textContent;
    return title;
  }

  private makeAddressDefault(isDefault: boolean | undefined) {
    if (isDefault) {
      const subTittle = this.createTitle(TextContent.DEFAULT_ADDRESS);
      this.addressGroup.append(subTittle);
    }
  }

  private changeCountryHandler(): void {
    this.showInfoMessage(TextContent.CHANGE_COUNTRY_INFO);
  }

  private validateCountryListHandler(): void {
    const countryList = this.countryOptions.getCountryList();
    const country = this.countryField.getInputElement();
    const postal = this.postalField.getInputElement();
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

  private showInfoMessage(textContent: string) {
    const messageShower = new InfoMessage();
    messageShower.showMessage(textContent);
  }

  private confirmHandler() {
    console.log(this.addressId);
    const api = new RegApi();
    api
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        api
          .changeAddress(
            response.body.results[0].id,
            response.body.results[0].version,
            this.addressId,
            this.streetField.getInputElement().getInputValue(),
            this.postalField.getInputElement().getInputValue(),
            this.cityField.getInputElement().getInputValue(),
            this.countryField.getInputElement().getInputValue().slice(-2)
          )
          .catch((error) => {
            this.showErrorMessage(error.message);
          });
      })
      .then(() => {
        this.fields.forEach((field) => {
          if (field.getElement().classList.contains(stylesRedactionMode.active)) {
            field.exitEditModeChangeButton();
            this.showInfoMessage(TextContent.COUNTRY_CHANGING_OK);
          }
        });
      })
      .catch((error) => {
        this.showErrorMessage(error.message);
      });
  }

  private showErrorMessage(textContent: string) {
    const messageShower = new ErrorMessage();
    messageShower.showMessage(textContent);
  }

  private showWarningMessage(textContent: string) {
    const messageShower = new WarningMessage();
    messageShower.showMessage(textContent);
  }
}
