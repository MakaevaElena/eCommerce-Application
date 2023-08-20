/**
 * @jest-environment jsdom
 */

import RouterHandler from './router-handler';

describe('Test class RouterHandler', () => {
  test('work with RouterHandler', () => {
    const handler = new RouterHandler(() => true);

    expect(() => handler.navigate()).not.toThrow();
  });
});
