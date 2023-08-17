import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { anonimClient } from './sdk/with-anonimous-flow';
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
  countryCode: string;
  key: string;
};

export default class ClientApi {
  private clientRoot = createApiBuilderFromCtpClient(anonimClient()).withProjectKey({ projectKey: 'best-games' });

  constructor(loginData?: LoginData) {
    if (loginData) {
      const userClient = createUser(loginData.email, loginData.password);
      this.clientRoot = createApiBuilderFromCtpClient(userClient).withProjectKey({ projectKey: 'best-games' });
    }
  }

  public checkCustomerExist(email: string) {
    return this.returnCustomerByEmail(email).then((customer) => customer);
  }

  private returnCustomerByEmail(customerEmail: string) {
    return this.clientRoot
      .customers()
      .get({
        queryArgs: {
          where: `email="${customerEmail}"`,
        },
      })
      .execute();
  }

  public returnCustomerById(id: string) {
    return this.clientRoot
      .customers()
      .get({
        queryArgs: {
          where: `id="${id}"`,
        },
      })
      .execute();
  }

  // helen@mail.ru
  // 'johndoe@example.com'
  // '123!@#qweQWE'
  public getCustomer({ email, password }: { email: string; password: string }) {
    return this.clientRoot
      .me()
      .login()
      .post({
        body: {
          email,
          password,
          updateProductData: true,
          // anonymousId: options?.anonymousId,
          // anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
        },
        // headers: {
        //   Authorization: 'Bearer xxx',
        // },
      })

      .execute();
  }

  public createUserRoot(email: string, password: string) {
    const userClient = createUser(email, password);
    this.clientRoot = createApiBuilderFromCtpClient(userClient).withProjectKey({ projectKey: 'best-games' });
    return this.clientRoot;
  }

  public createCart = (customerId: string) => {
    return this.clientRoot
      .carts()
      .post({
        body: {
          key: `test-cart-key-${Math.random()}`,
          currency: 'RUB',
          country: 'RU',
          customerId,
        },
      })
      .execute();
  };

  public getCartByCustomerId(id: string) {
    console.log(this.clientRoot);
    return this.clientRoot.carts().withCustomerId({ customerId: id }).get().execute();
  }

  // REGISTRATION

  private createCustomerDraft(customerData: CustomerData) {
    const { email, password, firstName, lastName, countryCode, key } = customerData;

    return {
      email,
      password,
      key,
      firstName,
      lastName,
      addresses: [
        {
          country: countryCode,
        },
      ],
      defaultShippingAddress: 0,
    };
  }

  public createCustomer(customerData: CustomerData) {
    try {
      const customer = this.clientRoot
        // .withProjectKey({ projectKey: this.projectKey })
        .customers()
        .post({
          body: this.createCustomerDraft(customerData),
        })
        .execute();

      // check to make sure status is 201
      return customer;
    } catch (error) {
      return error;
    }
  }
}
