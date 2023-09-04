import stylesButtonWrap from '../styles/button-wrap-style.module.scss';
import stylesRedactionMode from '../styles/redaction-mode-style.module.scss';
import stylesDescription from '../styles/description-country-style.module.scss';
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
import { CallbackListener } from '../../../../../../utils/input/inputParams';
import ButtonCreator from '../../../../../shared/button/button-creator';
import stylesRedactionButton from '../styles/redaction-button-style.module.scss';
import StatusCodes from '../../../../../../enum/status-codes';
import EventName from '../../../../../../enum/event-name';
import Observer from '../../../../../../observer/observer';
import Address from '../../types/addresses/address';

export default class AddressFieldsGroup {
  private observer: Observer;

  private addressGroup: HTMLDivElement;

  private streetField: UserField;

  private cityField: UserField;

  private postalField: UserField;

  private countryField: UserField;

  private confirmButtons: Array<HTMLButtonElement>;

  private fields: Array<UserField>;

  private inputsParams: InputParamsCreator;

  private countryOptions: CountryOptions;

  private makeBillingDefaultButton: HTMLButtonElement;

  private makeShippingDefaultButton: HTMLButtonElement;

  private makeBillingButton: HTMLButtonElement;

  private makeShippingButton: HTMLButtonElement;

  private deleteAddressButton: HTMLButtonElement;

  private buttonWrap: HTMLDivElement;

  private values: Array<string>;

  constructor(address: Address) {
    this.deleteAddressButton = this.createDeleteButton();
    this.makeShippingDefaultButton = this.createMakeDefaultShippingButton();
    this.makeBillingDefaultButton = this.createMakeDefaultBillingButton();
    this.makeShippingButton = this.createMakeShippingButton();
    this.makeBillingButton = this.createMakeBillingButton();
    this.observer = Observer.getInstance();

    this.addressGroup = this.createAddressFieldGroupElement();
    this.countryOptions = new CountryOptions();

    this.inputsParams = new InputParamsCreator();
    this.values = this.createValues(address);
    this.streetField = this.createStreetField();
    this.cityField = this.createCityField();
    this.postalField = this.createPostalField();
    this.countryField = this.createCountryField();

    this.confirmButtons = this.createConfirmButtons();
    this.configureConfirmButtons();
    this.fields = [this.streetField, this.cityField, this.postalField, this.countryField];

    this.countryField.getElement().addEventListener(Events.CHANGE, this.validateCountryListHandler.bind(this));
    this.countryField.getElement().addEventListener('change', this.changeCountryHandler.bind(this));

    this.buttonWrap = this.configureButtons(address);

    this.configureView(address);
  }

  getElement() {
    return this.addressGroup;
  }

  private configureView(address: Address) {
    this.addressGroup.append(
      this.createDescription(address),
      this.streetField.getElement(),
      this.cityField.getElement(),
      this.postalField.getElement(),
      this.countryField.getElement(),
      this.buttonWrap,
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

  private createValues(adress: Address): Array<string> {
    return [adress.id!, adress.streetName!, adress.postalCode!, adress.city!, adress.country!];
  }

  private createAddressFieldGroupElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(styleGroupFields));
    return element;
  }

  private createStreetField(): UserField {
    const value = this.values[CountryValues.STREET];
    const userFieldProps: UserFieldProps = {
      id: this.values[CountryValues.ID],
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
      id: this.values[CountryValues.ID],
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
      id: this.values[CountryValues.ID],
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
      id: this.values[CountryValues.ID],
      action: '',
      actionName: '',
      value,
      inputParams: this.inputsParams.getCountryParams(),
    };
    const fieldCreator = new UserField(userFieldProps);
    return fieldCreator;
  }

  private createDescription(address: Address): HTMLDivElement {
    const description = document.createElement(TagName.DIV);
    description.classList.add(...Object.values(stylesDescription));

    if (address.isShining) {
      description.append(this.createTitle(TextContent.TITLE_ADDRESS_SHIPPING));
    }
    if (address.isBilling) {
      description.append(this.createTitle(TextContent.TITLE_ADDRESS_BILLING));
    }
    if (address.isDefaultShipping) {
      description.append(this.createTitle(TextContent.DEFAULT_ADDRESS_SHIIPPING));
    }
    if (address.isDefaultBilling) {
      description.append(this.createTitle(TextContent.DEFAULT_ADDRESS_BILLING));
    }
    return description;
  }

  private createTitle(textContent: string) {
    const title = document.createElement('h3');
    title.textContent = textContent;
    return title;
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
    if (this.isCheckValidityForm()) {
      this.showWarningMessage(TextContent.VALIDATE_FORM_BEFORE_SUBMIT);
    } else {
      const api = new RegApi();
      api
        .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
        .then((response) => {
          api
            .changeAddress(
              response.body.results[0].id,
              response.body.results[0].version,
              this.values[CountryValues.ID],
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
          if (error.message === 'The anonymousId is already in use.') {
            this.confirmHandler();
          } else {
            this.showErrorMessage(error.message);
          }
        });
    }
  }

  private showErrorMessage(textContent: string) {
    const messageShower = new ErrorMessage();
    messageShower.showMessage(textContent);
  }

  private showWarningMessage(textContent: string) {
    const messageShower = new WarningMessage();
    messageShower.showMessage(textContent);
  }

  private isCheckValidityForm(): boolean {
    let result = true;

    if (
      this.streetField.getInputElement().getInput().checkValidity() &&
      this.postalField.getInputElement().getInput().checkValidity() &&
      this.cityField.getInputElement().getInput().checkValidity() &&
      this.countryField.getInputElement().getInput().checkValidity()
    ) {
      result = false;
    }

    return result;
  }

  private createMakeDefaultShippingButton() {
    return this.createButtons(
      TextContent.MAKE_ADDRESS_SHIPPING_DEFAULT_BUTTON,
      this.makeDefaulShippingtHandler.bind(this),
      Events.CLICK
    );
  }

  private makeDefaulShippingtHandler() {
    const api = new RegApi();
    api
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        api
          .makeAddressShippingDefault(
            response.body.results[0].id,
            response.body.results[0].version,
            this.values[CountryValues.ID]
          )
          .then((responseRes) => {
            if (responseRes.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              this.observer.notify(EventName.ADDRESS_CHANGED);
            }
          })
          .catch((error) => {
            this.showErrorMessage(error);
          });
      })
      .catch((error) => {
        if (error.message === 'The anonymousId is already in use.') {
          this.makeDefaulShippingtHandler();
        } else {
          this.showErrorMessage(error.message);
        }
      });
  }

  private createMakeDefaultBillingButton() {
    return this.createButtons(
      TextContent.MAKE_ADDRESS_BILLING_DEFAULT_BUTTON,
      this.makeDefaultBillingHandler.bind(this),
      Events.CLICK
    );
  }

  private makeDefaultBillingHandler() {
    const api = new RegApi();
    api
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        api
          .makeAddressBillingDefault(
            response.body.results[0].id,
            response.body.results[0].version,
            this.values[CountryValues.ID]
          )
          .then((responseRes) => {
            if (responseRes.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              this.observer.notify(EventName.ADDRESS_CHANGED);
            }
          })
          .catch((error) => {
            this.showErrorMessage(error);
          });
      })
      .catch((error) => {
        this.showErrorMessage(error);
      });
  }

  private createDeleteButton() {
    return this.createButtons(
      TextContent.DELETE_ADDRESS_BUTTON,
      this.deleteAdressButtonHAndler.bind(this),
      Events.CLICK
    );
  }

  private deleteAdressButtonHAndler() {
    const api = new RegApi();
    api
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        api
          .deleteAdress(response.body.results[0].id, response.body.results[0].version, this.values[CountryValues.ID])
          .then((responseRes) => {
            if (responseRes.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              this.observer.notify(EventName.ADDRESS_CHANGED);
            }
          })
          .catch((error) => {
            this.showErrorMessage(error);
          });
      })
      .catch((error) => {
        if (error.message === 'The anonymousId is already in use.') {
          this.deleteAdressButtonHAndler();
        } else {
          this.showErrorMessage(error.message);
        }
      });
  }

  private createMakeShippingButton() {
    return this.createButtons(
      TextContent.MAKE_ADDRESS_SHIPPING_BUTTON,
      this.makeShippingtHandler.bind(this),
      Events.CLICK
    );
  }

  private makeShippingtHandler() {
    const api = new RegApi();
    api
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        api
          .makeAddressShipping(
            response.body.results[0].id,
            response.body.results[0].version,
            this.values[CountryValues.ID]
          )
          .then((responseRes) => {
            if (responseRes.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              this.observer.notify(EventName.ADDRESS_CHANGED);
            }
          })
          .catch((error) => {
            this.showErrorMessage(error);
          });
      })
      .catch((error) => {
        this.showErrorMessage(error);
      });
  }

  private createMakeBillingButton() {
    return this.createButtons(
      TextContent.MAKE_ADDRESS_BILLING_BUTTON,
      this.makeBillingHandler.bind(this),
      Events.CLICK
    );
  }

  private makeBillingHandler() {
    const api = new RegApi();
    api
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        api
          .makeAddressBilling(
            response.body.results[0].id,
            response.body.results[0].version,
            this.values[CountryValues.ID]
          )
          .then((responseRes) => {
            if (responseRes.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              this.observer.notify(EventName.ADDRESS_CHANGED);
            }
          })
          .catch((error) => {
            this.showErrorMessage(error);
          });
      })
      .catch((error) => {
        if (error.message === 'The anonymousId is already in use.') {
          this.makeBillingHandler();
        } else {
          this.showErrorMessage(error.message);
        }
      });
  }

  private createButtons(textContent: string, eventListener?: CallbackListener, event?: string): HTMLButtonElement {
    const button = new ButtonCreator(textContent, Object.values(stylesRedactionButton), eventListener, event);
    return button.getButton();
  }

  private configureButtons(address: Address): HTMLDivElement {
    const buttonWrap = document.createElement(TagName.DIV);
    buttonWrap.classList.add(...Object.values(stylesButtonWrap));
    buttonWrap.append(
      this.deleteAddressButton,
      this.makeShippingButton,
      this.makeBillingButton,
      this.makeShippingDefaultButton,
      this.makeBillingDefaultButton
    );

    if (address.isShining) {
      buttonWrap.removeChild(this.makeShippingButton);
    }

    if (address.isBilling) {
      buttonWrap.removeChild(this.makeBillingButton);
    }

    if (address.isDefaultShipping) {
      buttonWrap.removeChild(this.makeShippingDefaultButton);
    }

    if (address.isDefaultBilling) {
      buttonWrap.removeChild(this.makeBillingDefaultButton);
    }

    return buttonWrap;
  }
}
