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
import { Group } from '../../../../utils/input/inputParams';
import { InputTypes } from '../../../../utils/input/input-values/input-values';

export default class ProfileView extends DefaultView {
  private router: Router;

  private wrapper: HTMLDivElement;

  private userData: UserData;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['profile-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.wrapper);

    this.userData = this.request();
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
    console.log(this.userData);
  }

  private createContent() {
    // TODO: create content for current this.productId

    const button = this.createMainButton();

    this.wrapper.append(button.getElement());
    const props = {
      group: Groups.MAIN,
      inputType: InputTypes.TEXT,
    };
    const emailField = new UserField(props);
    this.wrapper.append(emailField.getElementField());
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
    const localStorageEmail = window.localStorage.getItem(localStorageKeys.MAIL_ADDRESS);
    if (localStorageEmail) {
      api.getCustomer(localStorageEmail).then((result) => {
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
