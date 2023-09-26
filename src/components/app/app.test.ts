/**
 * @jest-environment jsdom
 */

import App from './app';

describe('Test class App', () => {
  test('work with App', () => {
    const app = new App();
    app.init();

    expect(app).toBeInstanceOf(App);
  });
});
