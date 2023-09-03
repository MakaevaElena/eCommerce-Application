import InputCreator from '../../../../../utils/input/inputCreator';
import InputParamsCreator from '../../../../../utils/input/input-values/input-params-creator';
import TextContent from '../enum/text-content';
import Events from '../../../../../enum/events';
import TagName from '../../../../../enum/tag-name';
import stylePasswordWrap from '../user-field/styles/password-wrap-style.module.scss';
import stylePasswordChanger from '../user-field/styles/password-chenger-style.module.scss';
import { CallbackListener, InputParams } from '../../../../../utils/input/inputParams';
import stylePasswordField from '../user-field/styles/password-fields-style.module.scss';
import { InputLabels, InputPlaceholders, InputTittles } from '../../../../../utils/input/input-values/input-values';
import ButtonCreator from '../../../../shared/button/button-creator';
import WarningMessage from '../../../../message/warning-message';
import InfoMessage from '../../../../message/info-message';
import ErrorMessage from '../../../../message/error-message';
import RegApi from '../../../../../api/reg-api';
import LocalStorageKeys from '../../../../../enum/local-storage-keys';
import StatusCodes from '../../../../../enum/status-codes';
import PostalPatterns from '../../registration-view/inputs-params/postal-paterns';
import PostalTitles from '../../registration-view/inputs-params/postal-titles';
import CountryOptions from '../../../../../utils/input/options/country-options';
import Observer from '../../../../../observer/observer';
import EventName from '../../../../../enum/event-name';
import TextContents from '../../registration-view/enum/text-contents';

export default class AddressCreator {
  private adressChangerElement: HTMLDivElement;

  private parentElement: HTMLDivElement;

  private streetField: InputCreator;

  private cityField: InputCreator;

  private postalField: InputCreator;

  private countryField: InputCreator;

  private inputParamsCreator: InputParamsCreator;

  private buttonConfirm: HTMLButtonElement;

  private buttonCancel: HTMLButtonElement;

  private buttonDefault: HTMLButtonElement;

  private countryOptions: CountryOptions;

  private isShiping: boolean;

  private isDefault: boolean;

  private observer: Observer;

  constructor(parentElement: HTMLDivElement, isShipping: boolean) {
    this.isShiping = isShipping;
    this.isDefault = false;
    this.countryOptions = new CountryOptions();
    this.parentElement = parentElement;
    this.adressChangerElement = this.createAddressGroupElement();
    this.inputParamsCreator = new InputParamsCreator();
    this.observer = Observer.getInstance();

    this.streetField = this.createField(this.inputParamsCreator.getStreetParams(), InputPlaceholders.STREET);

    this.cityField = this.createField(this.inputParamsCreator.getCityParams(), InputPlaceholders.CITY);

    this.postalField = this.createField(this.inputParamsCreator.getSPostalParams(), InputPlaceholders.POSTAL);

    this.countryField = this.createField(this.inputParamsCreator.getCountryParams(), InputPlaceholders.COUNTRY);

    this.buttonCancel = this.createButtonCancel();
    this.buttonConfirm = this.createButtonConfirm();
    this.buttonDefault = this.createButtonDefault();

    this.configureView();
  }

  private configureView() {
    this.countryField.getInput().addEventListener(Events.CHANGE, this.validateCountryListHandler.bind(this));

    this.adressChangerElement.addEventListener(Events.CLICK, this.goOutFromRedactionHandler.bind(this));

    const wrap = this.createWrap();
    wrap.append(
      this.buttonDefault,
      this.streetField.getElement(),
      this.cityField.getElement(),
      this.postalField.getElement(),
      this.countryField.getElement(),
      this.countryOptions.getListElement(),
      this.buttonConfirm,
      this.buttonCancel
    );
    this.adressChangerElement.append(wrap);
  }

  private createWrap(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(stylePasswordWrap));
    return element;
  }

  getElement(): HTMLDivElement {
    return this.adressChangerElement;
  }

  private createAddressGroupElement(): HTMLDivElement {
    const element = document.createElement(TagName.DIV);
    element.classList.add(...Object.values(stylePasswordChanger));
    return element;
  }

  private createField(inputParams: InputParams, textContent: string): InputCreator {
    const fieldProps: InputParams = inputParams;
    const newField = new InputCreator(fieldProps);
    newField.getElement().classList.add(...Object.values(stylePasswordField));
    const subTitle = this.createSubTitle(textContent);
    newField.getElement().prepend(subTitle);

    return newField;
  }

  private createSubTitle(textContent: string): HTMLElement {
    const subTitle = document.createElement('h3');
    subTitle.classList.add(...Object.values(stylePasswordField));
    subTitle.textContent = textContent;
    return subTitle;
  }

  private validateCountryListHandler(): void {
    const countryList = this.countryOptions.getCountryList();
    const country = this.countryField;
    const postal = this.postalField;
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

  private createButtonConfirm() {
    return this.createButtons(TextContent.CONFIRM_BUTTON, this.confirmHandler.bind(this), Events.CLICK);
  }

  private createButtonCancel() {
    return this.createButtons(TextContent.CANCEL_BUTTON, this.cancelHandler.bind(this), Events.CLICK);
  }

  private createButtonDefault() {
    return this.createButtons(TextContents.BUTTON_DEFAULT, this.defaultHandler.bind(this), Events.CLICK);
  }

  private createButtons(textContent: string, eventListener?: CallbackListener, event?: string): HTMLButtonElement {
    const button = new ButtonCreator(textContent, undefined, eventListener, event);
    return button.getButton();
  }

  private cancelHandler() {
    this.parentElement.removeChild(this.adressChangerElement);
  }

  private confirmHandler() {
    if (this.isCheckValidityForm()) {
      this.showWarningMessage(TextContent.VALIDATE_FORM_BEFORE_SUBMIT);
    } else {
      this.changeAdress();
    }
  }

  private defaultHandler() {
    if (this.isDefault) {
      this.isDefault = false;
      this.buttonDefault.textContent = TextContents.BUTTON_DEFAULT;
    } else {
      this.isDefault = true;
      this.buttonDefault.textContent = TextContents.BUTTON_UN_DEFAULT;
    }
  }

  private showWarningMessage(textContent: string) {
    const messageShower = new WarningMessage();
    messageShower.showMessage(textContent);
  }

  private showInfoMessage(textContent: string) {
    const messageShower = new InfoMessage();
    messageShower.showMessage(textContent);
  }

  private showErrorMessage(textContent: string) {
    const messageShower = new ErrorMessage();
    messageShower.showMessage(textContent);
  }

  private goOutFromRedactionHandler(event: Event) {
    if (event.target === this.adressChangerElement) {
      this.cancelHandler();
    }
  }

  private changeAdress() {
    const api = new RegApi();
    api
      .getCustomer(window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS)!)
      .then((response) => {
        api
          .addAddress(
            response.body.results[0].id,
            response.body.results[0].version,
            this.streetField.getInputValue(),
            this.postalField.getInputValue(),
            this.cityField.getInputValue(),
            this.countryField.getInputValue().slice(-2)
          )
          .then((responseAnswer) => {
            if (responseAnswer.statusCode === StatusCodes.USER_VALUE_CHANGED) {
              const result = {
                id: responseAnswer.body.addresses[responseAnswer.body.addresses.length - 1].id,
                version: responseAnswer.body.version,
                statusCode: responseAnswer.statusCode,
              };
              return result;
            }
          })
          .then((result) => {
            if (this.isShiping) {
              if (result !== undefined) {
                api
                  .makeAddressShipping(response.body.results[0].id, result.version, result.id!)
                  .then((response) => {
                    if (this.isDefault) {
                      api
                        .makeAddressShippingDefault(
                          response.body.id,
                          response.body.version,
                          response.body.addresses[response.body.addresses.length - 1].id!
                        )
                        .catch((error) => {
                          this.showErrorMessage(error);
                        });
                    }
                  })
                  .catch((error) => {
                    this.showErrorMessage(error);
                  });
              }
            } else {
              if (result !== undefined) {
                api
                  .makeAddressBilling(response.body.results[0].id, result.version, result.id!)
                  .then((response) => {
                    if (this.isDefault) {
                      api
                        .makeAddressBillingDefault(
                          response.body.id,
                          response.body.version,
                          response.body.addresses[response.body.addresses.length - 1].id!
                        )
                        .catch((error) => {
                          this.showErrorMessage(error);
                        });
                    }
                  })
                  .catch((error) => {
                    this.showErrorMessage(error);
                  });
              }
            }
            return result;
          })
          .then((result) => {
            if (result!.statusCode! === StatusCodes.USER_VALUE_CHANGED) {
              this.observer.notify(EventName.ADDRESS_CHANGED);
            }
          })
          .catch((error) => {
            this.showErrorMessage(error.message);
          });
      })
      .catch((error) => {
        this.showErrorMessage(error.message);
      });
  }

  private isCheckValidityForm(): boolean {
    let result = true;

    if (
      this.streetField.getInput().checkValidity() &&
      this.postalField.getInput().checkValidity() &&
      this.cityField.getInput().checkValidity() &&
      this.countryField.getInput().checkValidity()
    ) {
      result = false;
    }

    return result;
  }
}
