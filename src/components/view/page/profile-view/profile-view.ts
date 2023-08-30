import styleGroupFields from './user-field/styles/field-group.module.scss';
import styleAddress from './user-field/styles/adress-style.module.scss';
import styleButton from './user-field/styles/button-style.module.scss';
import styleFieldContainer from './user-field/styles/field-container-style.module.scss';
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
import localStorageKeys from '../../../../enum/local-storage-keys';
import UserField from './user-field/user-field';
import Groups from './user-field/enum/groups';
import { InputPlaceholders, InputTypes } from '../../../../utils/input/input-values/input-values';
import userFieldProps from './user-field/user-field-props';
import TextContent from './enum/text-content';
import UserFieldProps from './user-field/user-field-props';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';
import LocalStorageKeys from '../../../../enum/local-storage-keys';
import CountryOptions from '../../../../utils/input/options/country-options';

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
    // TODO: create content for current this.productId

    this.wrapper.textContent = '';

    const button = this.createMainButton();

    this.wrapper.append(button.getElement());
    const fields = this.createFields();
    const wrap = new TagElement().createTagElement('div', Object.values(styleWrap));
    wrap.append(...fields);
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

  private createMainProps(): Array<userFieldProps> {
    return [
      {
        group: Groups.MAIN,
        inputType: InputTypes.TEXT,
        labelValue: InputPlaceholders.FIRST_NAME,
        inputValue: this.userData.firstName,
      },
      {
        group: Groups.MAIN,
        inputType: InputTypes.TEXT,
        labelValue: InputPlaceholders.LAST_NAME,
        inputValue: this.userData.lastName,
      },
      {
        group: Groups.MAIN,
        inputType: InputTypes.DATE,
        labelValue: InputPlaceholders.DATE_OF_BIRTH,
        inputValue: this.userData.dateOfBirth,
      },
    ];
  }

  private createAdressesProps(adressGroup: Array<Address>, group: Groups): Array<Array<userFieldProps>> {
    const addressesProps: Array<Array<userFieldProps>> = [];
    adressGroup.forEach((addressProps) => {
      let countryName = this.countryOptions.getCountryByCode(addressProps.country!);
      let isAddressDefault = false;
      if (addressProps.isDefault) {
        isAddressDefault = true;
      }
      const props = [
        {
          group: group,
          inputType: InputTypes.TEXT,
          labelValue: InputPlaceholders.CITY,
          inputValue: addressProps.city,
          isDefaultAddress: isAddressDefault,
        },
        {
          group: group,
          inputType: InputTypes.TEXT,
          labelValue: InputPlaceholders.STREET,
          inputValue: addressProps.streetName,
        },
        {
          group: group,
          inputType: InputTypes.TEXT,
          labelValue: InputPlaceholders.POSTAL,
          inputValue: addressProps.postalCode,
        },
        {
          group: group,
          inputType: InputTypes.TEXT,
          labelValue: InputPlaceholders.COUNTRY,
          inputValue: countryName,
        },
      ];
      addressesProps.push(props);
    });
    return addressesProps;
  }

  private createContainer() {
    const container = document.createElement(TagName.DIV);
    container.classList.add(...Object.values(styleFieldContainer));
    return container;
  }

  private createFieldGroup(textContent?: string): HTMLDivElement {
    const fieldGroup = document.createElement(TagName.DIV);
    fieldGroup.classList.add(...Object.values(styleGroupFields));
    if (textContent) {
      const title = this.сreateTitleAddress(textContent);
      fieldGroup.append(title);
    }

    return fieldGroup;
  }

  private createFields() {
    const mainProps = this.createMainProps();
    const mainFields: HTMLDivElement = this.createFieldGroup();
    const shippingProps = this.createAdressesProps(this.userData.shippingAddresses, Groups.SHIPPING);
    const billingProps = this.createAdressesProps(this.userData.billingAddresses, Groups.SHIPPING);
    const shippingFields: HTMLDivElement = this.createFieldGroup(TextContent.TITLE_ADDRESS_SHIPPING);
    const billingFields: HTMLDivElement = this.createFieldGroup(TextContent.TITLE_ADDRESS_BILLING);
    const fields: Array<HTMLElement> = [mainFields];

    mainProps.forEach((fieldProps) => {
      this.fillMainFieldGroups(fieldProps, mainFields);
    });

    shippingProps.forEach((fieldProps) => {
      this.fillAddressGroup(fieldProps, shippingFields);
    });

    billingProps.forEach((fieldProps) => {
      this.fillAddressGroup(fieldProps, billingFields);
    });

    const minChildrenLength = 1;

    if (shippingFields.children.length > minChildrenLength) {
      fields.push(shippingFields);
    }

    if (shippingFields.children.length > minChildrenLength) {
      fields.push(billingFields);
    }

    return fields;
  }

  private fillMainFieldGroups(fieldProps: UserFieldProps, group: HTMLDivElement) {
    const fieldElement = new UserField(fieldProps);
    group.append(fieldElement.getElementField());
  }

  private fillAddressGroup(fieldsProps: Array<UserFieldProps>, group: HTMLDivElement) {
    const address = this.createFieldGroup();
    address.classList.add(...Object.values(styleAddress));
    fieldsProps.forEach((fieldProps) => {
      if (fieldProps.isDefaultAddress) {
        const title = this.сreateTitleAddress(TextContent.DEFAULT_ADDRESS);
        address.append(title);
      }
      this.fillMainFieldGroups(fieldProps, address);
    });

    group.append(address);
  }

  private createButtonsAddressesAdd() {
    const buttonAddShippingAddress = this.createButton(TextContent.ADD_SHIPPING_ADDRESS_BUTTON);
    const buttonAddBillingAddress = this.createButton(TextContent.ADD_BILLING_ADDRESS_BUTTON);
  }

  private сreateTitleAddress(textContent: string): HTMLElement {
    const title = document.createElement('h3');
    title.textContent = textContent;
    return title;
  }

  private createButton(textContent: string) {
    const button = document.createElement(TagName.BUTTON);
    button.classList.add(...Object.values(styleButton));
    button.textContent = textContent;
    return button;
  }

  private createUserData(): UserData {
    const message = 'unassigned';
    return {
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
}
