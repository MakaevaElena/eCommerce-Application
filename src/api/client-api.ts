import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import createAnonim from './sdk/with-anonimous-flow';
import createUser from './sdk/with-password-flow';
import Guid from '../utils/guid';
import { CTP_PROJECT_KEY } from './sdk/const';
import { QueryParamType } from './sdk/type';

type CustomerData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  countryCode: string;
  key: string;
};

export default class ClientApi {
  private clientRoot;

  constructor(client?: Client) {
    if (client) {
      this.clientRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: CTP_PROJECT_KEY });
    } else {
      this.clientRoot = createApiBuilderFromCtpClient(createAnonim()).withProjectKey({ projectKey: CTP_PROJECT_KEY });
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

  public loginCustomer({ email, password }: { email: string; password: string }, anonymousId: string) {
    return this.clientRoot
      .login()
      .post({
        body: {
          email,
          password,
          updateProductData: true,
          anonymousId,
          anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
        },
      })
      .execute();
  }

  public createUserRoot(email: string, password: string) {
    const userClient = createUser(email, password);
    this.clientRoot = createApiBuilderFromCtpClient(userClient).withProjectKey({ projectKey: CTP_PROJECT_KEY });
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

  // PRODUCTS

  public getProducts(args?: QueryParamType) {
    const params = args ? { ...args } : {};

    return this.clientRoot
      .productProjections()
      .search()
      .get({
        queryArgs: params,
      })
      .execute();
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
        },
      })
      .execute();
  }

  // CART

  public getCartByCustomerId(id: string) {
    return this.clientRoot.carts().withCustomerId({ customerId: id }).get().execute();
  }

  public getCartByCartID(cartId: string) {
    return this.clientRoot.carts().withId({ ID: cartId }).get().execute();
  }

  public deleteCartByCartID(cartId: string, cartVersion: number) {
    return this.clientRoot
      .carts()
      .withId({ ID: cartId })
      .delete({
        queryArgs: { version: cartVersion },
      })
      .execute();
  }

  public deleteCustomerCart(cartId: string, version: number) {
    return this.clientRoot.me().carts().withId({ ID: cartId }).delete({ queryArgs: { version } }).execute();
  }

  public createCart() {
    return this.clientRoot
      .carts()
      .post({
        body: {
          key: `cart-key-${Guid.newGuid()}`,
          currency: 'USD',
          country: 'US',
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

  public changeQuantityByLineID(cartID: string, cartVersion: number, lineItemId: string, quantity: number) {
    return this.clientRoot
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'changeLineItemQuantity',
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
            },
          ],
        },
      })
      .execute();
  }

  public updateCartWithDiscount(cartID: string, cartVersion: number, discountCode: string) {
    return this.clientRoot
      .carts()
      .withId({ ID: cartID })
      .post({
        body: {
          version: cartVersion,
          actions: [
            {
              action: 'addDiscountCode',
              code: discountCode,
            },
          ],
        },
      })
      .execute();
  }

  public getActiveCart() {
    return this.clientRoot.me().activeCart().get().execute();
  }

  public createCustomerCart() {
    return this.clientRoot
      .me()
      .carts()
      .post({ body: { currency: 'USD', country: 'US' } })
      .execute();
  }

  public getPromoCodes() {
    return this.clientRoot.discountCodes().get().execute();
  }

  public getPromoCodesPercent(promoCodeCartDiscountId: string) {
    return this.clientRoot.discountCodes().withId({ ID: promoCodeCartDiscountId }).get().execute();
  }
}
