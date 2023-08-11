import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { ctpClient } from './BuildClient';
// import { anonimClient } from './with-anonimous-flow-2';

export default class ClientApi {
  // private anonimRoot = createApiBuilderFromCtpClient(anonimClient).withProjectKey({ projectKey: 'best-games' });

  private apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({ projectKey: 'best-games' });

  public checkCustomerExist(email: string) {
    return this.returnCustomerByEmail(email).then((customer) => customer);
    // .then(({ body }) => {
    //   return body.results.length;
    // })
    // .catch(console.error);
  }

  private returnCustomerByEmail(customerEmail: string) {
    return this.apiRoot
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
    return this.apiRoot
      .me()
      .login()
      .post({
        body: {
          email,
          password,
        },
      })
      .execute();
  }
}
