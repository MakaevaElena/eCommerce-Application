import { createUser } from './with-password-flow';
import { ApiMock } from '../../utils/api-mock';

describe('Test SDK', () => {
  test('create user', () => {
    const client = createUser(ApiMock.email, ApiMock.pass);

    expect(client).toHaveProperty('process');
    expect(client).toHaveProperty('execute');
  });
});
