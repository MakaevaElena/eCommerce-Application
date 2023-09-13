import styleWrap from './user-field/styles/wrap-style.module.scss';
import styleCss from './profile-view.module.scss';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import Address from './types/addresses/address';
import UserData from './types/user-data';
import userFieldProps from './user-field/user-field-props';
import TextContent from './enum/text-content';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import CountryOptions from '../../../../utils/input/options/country-options';
import InputParamsCreator from '../../../../utils/input/input-values/input-params-creator';
import MainFieldGroup from './user-field/user-field-group/main-field-group';
import AddressFieldsGroup from './user-field/user-field-group/address-fields-group';
import Actions from './user-field/enum/actions';
import ActionNames from './user-field/enum/action-names';
import PasswordChanger from './user-field/password-changer';
import { CallbackListener } from '../../../../utils/input/inputParams';
import ButtonCreator from '../../../shared/button/button-creator';
import Events from '../../../../enum/events';
import stylesRedactionButton from './user-field/styles/redaction-button-style.module.scss';
import AddressCreator from './address-creator/address-creator';
import InfoMessage from '../../../message/info-message';
import ErrorMessage from '../../../message/error-message';
import CommonApi from '../../../../api/common-api';

export default class ProfileView extends DefaultView {
  private router: Router;

  private wrapper: HTMLDivElement;

  private userData: UserData;

  private emailAddress: string | null;

  private observer = Observer.getInstance();

  private countryOptions: CountryOptions;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['profile-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.emailAddress = window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS);

    this.countryOptions = new CountryOptions();

    this.wrapper = new TagElement().createTagElement('div', Object.values(styleWrap));

    this.getCreator().addInnerElement(this.wrapper);

    this.userData = this.request();

    this.configView();

    this.observer.subscribe(EventName.LOGIN, this.login.bind(this));
    this.observer.subscribe(EventName.LOGOUT, this.logoutListener.bind(this));
    this.observer.subscribe(EventName.ADDRESS_CHANGED, this.addressChangedHandler.bind(this));
    this.observer.subscribe(EventName.ADDRESS_ADDED, this.addressAddHandler.bind(this));
  }

  public setContent(element: InsertableElement) {
    this.wrapper.replaceChildren('');
    if (element instanceof ElementCreator) {
      this.wrapper.append(element.getElement());
    } else {
      this.wrapper.append(element);
    }
  }

  private configView() {
    this.createContent();
  }

  private addressChangedHandler() {
    this.userData = this.request();
    this.showInfoMessage(TextContent.CHANGE_ADRESS_OK);
  }

  private addressAddHandler() {
    this.userData = this.request();
    this.showInfoMessage(TextContent.ADD_ADRESS_OK);
  }

  private login() {
    this.emailAddress = window.localStorage.getItem(LocalStorageKeys.MAIL_ADDRESS);
    this.userData = this.request();
  }

  private logoutListener() {
    this.wrapper.textContent = '';
    const button = this.createMainButton();
    this.wrapper.append(button.getElement());
  }

  private createContent() {
    this.wrapper.textContent = '';

    const button = this.createMainButton();
    button.getElement().classList.add(...Object.values(stylesRedactionButton));
    const changePasswordButton = this.createButton(
      TextContent.CHANGE_PASSWORD,
      this.goToPasswordChangerHandler.bind(this),
      Events.CLICK
    );

    const addShippingAddressButton = new ButtonCreator(
      TextContent.ADD_SHIPPING_ADDRESS_BUTTON,
      Object.values(stylesRedactionButton),
      this.addShippingAddressHandler.bind(this),
      Events.CLICK
    );
    const addBillingAddressButton = new ButtonCreator(
      TextContent.ADD_BILLING_ADDRESS_BUTTON,
      Object.values(stylesRedactionButton),
      this.addBillingAddressHandler.bind(this),
      Events.CLICK
    );

    this.wrapper.append(
      button.getElement(),
      changePasswordButton,
      addShippingAddressButton.getButton(),
      addBillingAddressButton.getButton()
    );
    const fields = this.createUserField();
    const wrap = new TagElement().createTagElement('div', Object.values(styleWrap));
    const addressGroups = this.createAddressGroup(this.userData.addresses);
    wrap.append(fields, ...addressGroups);

    this.wrapper.append(wrap);
  }

  private createMainButton() {
    const button = new LinkButton(LinkName.INDEX, () => {
      this.router.setHref(PagePath.INDEX);
    });
    return button;
  }

  private request() {
    const api = CommonApi.getInstance().getRegApi();
    const userData: UserData = this.createUserData();
    const localStorageEmail = this.emailAddress;
    if (localStorageEmail) {
      api
        .getCustomer(localStorageEmail)
        .then((result) => {
          const results = result.body.results[0];

          if (results.id != null) {
            userData.id = results.id;
          }

          if (results.version != null) {
            userData.version = results.version;
          }

          if (results.firstName != null) {
            userData.firstName = results.firstName;
          }

          if (results.lastName != null) {
            userData.lastName = results.lastName;
          }

          if (results.dateOfBirth != null) {
            userData.dateOfBirth = results.dateOfBirth;
          }

          userData.addresses = this.createAddresses(
            results.addresses,
            results.shippingAddressIds,
            results.billingAddressIds,
            results.defaultShippingAddressId,
            results.defaultBillingAddressId
          );

          return userData;
        })
        .then(() => this.configView())
        .catch((error) => {
          if (error.message === 'The anonymousId is already in use.') {
            this.userData = this.request();
          } else {
            this.showErrorMessage(error.message);
          }
        });
    }

    return userData;
  }

  private createAddressGroup(addressArray: Array<Address>): Array<HTMLDivElement> {
    const addresses: Array<HTMLDivElement> = [];
    addressArray.forEach((address) => {
      const addressGroup = new AddressFieldsGroup(address);
      addresses.push(addressGroup.getElement());
    });

    return addresses;
  }

  private createAddresses(
    allAddresses: Array<Address>,
    shippingID: Array<string> | undefined,
    billingId: Array<string> | undefined,
    defaultShippingId: string | undefined,
    defaultBillingId: string | undefined
  ): Array<Address> {
    const addresses: Array<Address> = [];
    allAddresses.forEach((address) => {
      if (typeof address.id !== 'undefined') {
        if (typeof shippingID !== 'undefined') {
          if (shippingID.includes(address.id)) {
            address.isShining = true;
          }
        }

        if (typeof billingId !== 'undefined') {
          if (billingId.includes(address.id!)) {
            address.isBilling = true;
          }
        }

        if (typeof defaultShippingId !== 'undefined') {
          if (defaultShippingId === address.id!) {
            address.isDefaultShipping = true;
          }
        }

        if (typeof defaultBillingId !== 'undefined') {
          if (defaultBillingId === address.id!) {
            address.isDefaultBilling = true;
          }
        }
      }

      addresses.push(address);
    });

    return addresses;
  }

  private createMainProps(): Array<userFieldProps> {
    const inputsParams = new InputParamsCreator();
    return [
      {
        id: this.userData.id,
        action: Actions.CHANGE_EMAIL_ADDRESS,
        actionName: ActionNames.EMAIL_ADDRESS,
        value: this.emailAddress!,
        inputParams: inputsParams.getMailParams(),
      },
      {
        id: this.userData.id,
        action: Actions.CHANGE_FIRST_NAME,
        actionName: ActionNames.FIRST_NAME,
        value: this.userData.firstName,
        inputParams: inputsParams.getFirstNameParams(),
      },
      {
        id: this.userData.id,
        action: Actions.CHANGE_LAST_NAME,
        value: this.userData.lastName,
        actionName: ActionNames.LAST_NAME,
        inputParams: inputsParams.getLastNameParams(),
      },
      {
        id: this.userData.id,
        action: Actions.CHANGE_DATE_OF_BIRTH,
        value: this.userData.dateOfBirth,
        actionName: ActionNames.DATE_OF_BIRTH,
        inputParams: inputsParams.getDateParams(),
      },
    ];
  }

  private createButton(textContent: string, eventListener?: CallbackListener, event?: string): HTMLButtonElement {
    const button = new ButtonCreator(textContent, Object.values(stylesRedactionButton), eventListener, event);
    return button.getButton();
  }

  private createUserData(): UserData {
    const message = 'unassigned';
    return {
      id: message,
      version: 0,
      firstName: message,
      lastName: message,
      dateOfBirth: message,
      shippingAddresses: [
        {
          city: message,
          country: message,
          id: message,
          postalCode: message,
          streetName: message,
          isDefaultShipping: false,
          isDefaultBilling: false,
          isShining: false,
          isBilling: false,
        },
      ],
      billingAddresses: [
        {
          city: message,
          country: message,
          id: message,
          postalCode: message,
          streetName: message,
          isDefaultShipping: false,
          isDefaultBilling: false,
          isShining: false,
          isBilling: false,
        },
      ],
      addresses: [
        {
          city: message,
          country: message,
          id: message,
          postalCode: message,
          streetName: message,
          isDefaultShipping: false,
          isDefaultBilling: false,
          isShining: false,
          isBilling: false,
        },
      ],
    };
  }

  private createUserField(): HTMLDivElement {
    const mainGroupProps = this.createMainProps();

    const userFieldElement = new MainFieldGroup(mainGroupProps);
    return userFieldElement.getElement();
  }

  private goToPasswordChangerHandler() {
    const passwordChanger = new PasswordChanger(this.wrapper);
    this.wrapper.append(passwordChanger.getPasswordChanger());
  }

  private addShippingAddressHandler() {
    const addressCreator = new AddressCreator(this.wrapper, true);
    this.wrapper.append(addressCreator.getElement());
  }

  private addBillingAddressHandler() {
    const addressCreator = new AddressCreator(this.wrapper, false);
    this.wrapper.append(addressCreator.getElement());
  }

  private showInfoMessage(textContent: string) {
    const messageShower = new InfoMessage();
    messageShower.showMessage(textContent);
  }

  private showErrorMessage(textContent: string) {
    const messageShower = new ErrorMessage();
    messageShower.showMessage(textContent);
  }
}
