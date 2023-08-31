import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { createAnonim } from './sdk/with-anonimous-flow';
import { createUser } from './sdk/with-password-flow';

type LoginData = {
  email: string;
  password: string;
};

type CustomerData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  countryShippingCode: string;
  countryStreetShipping: string;
  countryCityShipping: string;
  countryPostalShipping: string;
  countryStreetBilling: string;
  countryCityBilling: string;
  countryPostalBilling: string;
  countryBillingCode: string;

  key: string;
  defaultShippingAddressNum: number | undefined;
  defaultBillingAddressNum: number | undefined;
};

export default class RegApi {
  private clientRoot = createApiBuilderFromCtpClient(createAnonim()).withProjectKey({ projectKey: 'best-games' });

  constructor(loginData?: LoginData) {
    if (loginData) {
      const userClient = createUser(loginData.email, loginData.password);
      this.clientRoot = createApiBuilderFromCtpClient(userClient).withProjectKey({ projectKey: 'best-games' });
    }
  }

  // REGISTRATION

  private createCustomerDraft(customerData: CustomerData) {
    const {
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      countryShippingCode,
      countryStreetShipping,
      countryBillingCode,
      countryStreetBilling,
      countryCityShipping,
      countryPostalShipping,
      countryCityBilling,
      countryPostalBilling,
      defaultBillingAddressNum,
      defaultShippingAddressNum,
      key,
    } = customerData;

    return {
      email,
      password,
      key,
      dateOfBirth,
      firstName,
      lastName,
      addresses: [
        {
          country: countryShippingCode,
          streetName: countryStreetShipping,
          city: countryCityShipping,
          postalCode: countryPostalShipping,
        },
        {
          country: countryBillingCode,
          streetName: countryStreetBilling,
          city: countryCityBilling,
          postalCode: countryPostalBilling,
        },
      ],
      defaultShippingAddress: defaultShippingAddressNum,
      defaultBillingAddress: defaultBillingAddressNum,
      shippingAddresses: [0],
      billingAddresses: [1],
    };
  }

  public createCustomer(customerData: CustomerData) {
    const customer = this.clientRoot
      .customers()
      .post({
        body: this.createCustomerDraft(customerData),
      })
      .execute();
    return customer;
  }

  public getCustomer(customerEmail: string) {
    return this.clientRoot
      .customers()
      .get({
        queryArgs: {
          where: `email="${customerEmail}"`,
        },
      })
      .execute();
  }

  public changeData(customerID: string, version: number, action: any, actionName: string, value: string) {
    return this.clientRoot
      .customers()
      .withId({ ID: customerID })
      .post({
        // The CustomerUpdate is the object within the body
        body: {
          // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
          version: version,
          actions: [
            {
              action,
              [actionName]: value,
            },
          ],
        },
      })
      .execute();
  }
}
