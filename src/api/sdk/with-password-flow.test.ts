import { createUser } from './with-password-flow';

describe('Test SDK', () => {
  test('create user', () => {
    const client = createUser();

    expect(client).toHaveProperty('process');
    expect(client).toHaveProperty('execute');
  });
});
