import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { createAnonim } from './sdk/with-anonimous-flow';
import { createUser } from './sdk/with-password-flow';
import Guid from '../utils/guid';

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
  private clientRoot = createApiBuilderFromCtpClient(createAnonim()).withProjectKey({ projectKey: 'best-games' });

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

  public getCustomerByID(customerID: string) {
    return this.clientRoot
      .customers()
      .get({
        queryArgs: {
          where: `id="${customerID}"`,
        },
      })
      .execute();
  }

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

  public getCategory(id: string) {
    return this.clientRoot.categories().withId({ ID: id }).get().execute();
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

  // PRODUCTS

  public getProducts() {
    return this.clientRoot.products().get().execute();
  }

  public getProductbyID(productID: string) {
    return this.clientRoot.products().withId({ ID: productID }).get().execute();
  }

  public getProductbyKey(productKey: string) {
    return this.clientRoot.products().withKey({ key: productKey }).get().execute();
  }

  public productProjectionResponseID(productID: string) {
    return this.clientRoot
      .productProjections()
      .withId({ ID: productID })
      .get({
        queryArgs: {
          staged: true,
        },
      })
      .execute();
  }

  public productProjectionResponseKEY(productKey: string) {
    return this.clientRoot
      .productProjections()
      .withKey({ key: productKey })
      .get({
        queryArgs: {
          staged: true,
          // priceCurrency: 'priceCurrency',
        },
      })
      .execute();
  }

  // CART

  // /{projectKey}/carts/customer-id={customerId}
  public getCartByCustomerId(id: string) {
    return this.clientRoot.carts().withCustomerId({ customerId: id }).get().execute();
  }

  public getCartByCartID(cartId: string) {
    return this.clientRoot.carts().withId({ ID: cartId }).get().execute();
  }

  public createCart() {
    return this.clientRoot
      .carts()
      .post({
        body: {
          key: `cart-key-${Guid.newGuid()}`,
          currency: 'USD',
          country: 'US',
          // customerId,
        },
      })
      .execute();
  }

  public addItemToCartByID = (cartID: string, cartVersion: number, productSku: string) => {
    return this.clientRoot
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'addLineItem',
              sku: productSku,
            },
          ],
        },
      })
      .execute();
  };

  public changeQuantityByKey(cartID: string, cartVersion: number, lineItemId: string, quantity: number) {
    return this.clientRoot
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'changeLineItemQuantity',
              // lineItemId: id,
              lineItemId,
              quantity,
            },
          ],
        },
      })
      .execute();
  }

  public removeLineItem(cartID: string, cartVersion: number, lineItemId: string) {
    return this.clientRoot
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'removeLineItem',
              lineItemId,
              // lineItemKey: key,
              // quantity,
            },
          ],
        },
      })
      .execute();
  }
}
