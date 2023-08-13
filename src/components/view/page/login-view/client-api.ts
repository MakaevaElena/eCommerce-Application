import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { anonimClient } from './sdk/with-anonimous-flow';
import { createUser } from './sdk/with-password-flow';

export default class ClientApi {
  private clientRoot = createApiBuilderFromCtpClient(anonimClient).withProjectKey({ projectKey: 'best-games' });

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
          key: `test-cart-key-${12345}`,
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
}
