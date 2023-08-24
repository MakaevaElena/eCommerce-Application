/**
 * @jest-environment jsdom
 */

import Favicon from './favicon';

describe('Test class Favicon', () => {
  test('work with Favicon', () => {
    const favicon = new Favicon();

    expect(favicon.getElement()).toBeInstanceOf(DocumentFragment);
  });
});
