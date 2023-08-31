import styleWrap from './user-field/styles/wrap-style.module.scss';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './profile-view.module.scss';
import RegApi from '../../../../api/reg-api';
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

export default class ProfileView extends DefaultView {
  private router: Router;

  private wrapper: HTMLDivElement;

  private userData: UserData;

  private emailAddress: string | null;

  private observer: Observer;

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

    this.observer = Observer.getInstance();

    this.countryOptions = new CountryOptions();

    this.wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.wrapper);

    this.userData = this.request();

    this.configView();

    this.observer.subscribe(EventName.LOGIN, this.login.bind(this));
    this.observer.subscribe(EventName.LOGOUT, this.logoutListener.bind(this));
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

    this.wrapper.append(button.getElement());
    const fields = this.createUserField();
    const wrap = new TagElement().createTagElement('div', Object.values(styleWrap));
    const addressShippingGroup = this.createAddressGroup(this.userData.shippingAddresses);
    const addressBillingGroup = this.createAddressGroup(this.userData.billingAddresses);
    wrap.append(fields, ...addressShippingGroup, ...addressBillingGroup);
    wrap.append(new PasswordChanger().getPasswordChanger());
    this.wrapper.append(wrap);
  }

  private createMainButton() {
    const button = new LinkButton(LinkName.INDEX, () => {
      this.router.navigate(PagePath.INDEX);
    });
    return button;
  }

  private request() {
    const api = new RegApi();
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

          userData.shippingAddresses = this.getShippingBillingAddresses(
            results.addresses,
            results.shippingAddressIds,
            results.defaultShippingAddressId
          );
          userData.billingAddresses = this.getShippingBillingAddresses(
            results.addresses,
            results.billingAddressIds,
            results.defaultBillingAddressId
          );

          this.configView();
          return userData;
        })
        .catch((error) => {
          console.log(error.message);
        });
    }

    return userData;
  }

  private getShippingBillingAddresses(
    allAddresses: Array<Address>,
    addressesGroup: string[] | undefined,
    defaultId: string | undefined
  ) {
    const addresses: Array<Address> = [];
    if (addressesGroup !== undefined) {
      allAddresses.forEach((address) => {
        if (addressesGroup.includes(address.id!)) {
          if (address.id === defaultId) {
            address.isDefault = true;
          }
          addresses.push(address);
        }
      });
    }
    return addresses;
  }

  private createAddressGroup(addressArray: Array<Address>): Array<HTMLDivElement> {
    const addresses: Array<HTMLDivElement> = [];
    let title = '';
    title =
      addressArray === this.userData.shippingAddresses
        ? TextContent.TITLE_ADDRESS_SHIPPING
        : TextContent.TITLE_ADDRESS_BILLING;
    addressArray.forEach((address) => {
      const values: Array<string> = [];
      Object.values(address).forEach((value) => {
        if (typeof value !== 'boolean') {
          values.push(value);
        }
      });
      const addressGroup = new AddressFieldsGroup(values, title, address.isDefault);
      addresses.push(addressGroup.getElement());
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

  // private createButtonsAddressesAdd() {
  //   const buttonAddShippingAddress = this.createButton(TextContent.ADD_SHIPPING_ADDRESS_BUTTON);
  //   const buttonAddBillingAddress = this.createButton(TextContent.ADD_BILLING_ADDRESS_BUTTON);
  // }

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
          isDefault: false,
        },
      ],
      billingAddresses: [
        {
          city: message,
          country: message,
          id: message,
          postalCode: message,
          streetName: message,
          isDefault: false,
        },
      ],
    };
  }

  private createUserField(): HTMLDivElement {
    const mainGroupProps = this.createMainProps();

    const userFieldElement = new MainFieldGroup(mainGroupProps);
    return userFieldElement.getElement();
  }
}
