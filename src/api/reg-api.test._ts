import RegApi from './reg-api';
import ApiMock from '../utils/api-mock';

describe('Test Registration API', () => {
  test('work with RegApi', async () => {
    const api = new RegApi();

    const newCustomerData = {
      email: ApiMock.email,
      password: ApiMock.pass,
      firstName: '',
      lastName: '',
      countryCode: ApiMock.countryCode,
      key: ApiMock.customerId,
    };
    await expect(api.createCustomer(newCustomerData)).rejects.toThrow(ApiMock.messageUserExists);
  });
});
