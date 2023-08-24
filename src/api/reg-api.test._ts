import RegApi from './reg-api';
import { ApiMock, MockCustomerData } from '../utils/api-mock';

describe('Test Registration API', () => {
  test('work with RegApi', async () => {
    const api = new RegApi();

    const newCustomerData = { ...MockCustomerData };

    await expect(api.createCustomer(newCustomerData)).rejects.toThrow(ApiMock.messageUserExists);
  });
});
