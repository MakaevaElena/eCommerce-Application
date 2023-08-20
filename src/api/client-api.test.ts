import ClientApi from './client-api';
import ApiMock from '../../__mocks__/api-mock';

describe('Test Client API', () => {
  test('work with ClientApi', async () => {
    const api = new ClientApi();

    expect(api).toHaveProperty('createCustomer');

    const responseByEmail = await api.checkCustomerExist(ApiMock.email);
    expect(responseByEmail).toHaveProperty('statusCode');

    const responseById = await api.returnCustomerById(ApiMock.customerId);
    expect(responseById).toHaveProperty('statusCode');

    const signInResult = await api.getCustomer({ email: ApiMock.email, password: ApiMock.pass });
    expect(signInResult).toHaveProperty('body');
    expect(signInResult.body).toHaveProperty('customer');
    expect(signInResult.body).toHaveProperty('cart');

    const customerBuilder = api.createUserRoot(ApiMock.email, ApiMock.pass);
    expect(customerBuilder).toHaveProperty('args');
    expect(customerBuilder.args).toHaveProperty('pathArgs');

    const responseCartById = await api.getCartByCustomerId(ApiMock.customerId);
    expect(responseCartById.statusCode).toBe(ApiMock.httpCodeOK);

    const newCustomerData = {
      email: ApiMock.email,
      password: ApiMock.pass,
      firstName: '',
      lastName: '',
      countryCode: ApiMock.countryCode,
      key: ApiMock.customerId,
    };
    await expect(api.createCustomer(newCustomerData)).rejects.toThrow(ApiMock.messageUserExists);

    // const cartResponse = await api.createCart(ApiMock.customerId);
    // expect(cartResponse.statusCode).toBe(ApiMock.httpCodeResourceCreated);
  });
});
