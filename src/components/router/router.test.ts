/**
 * @jest-environment jsdom
 */

import Router, { Route } from './router';

describe('Test class Router', () => {
  test('work with Router', () => {
    const routes: Array<Route> = [
      {
        path: `index`,
        callback: () => 'test',
      },
    ];
    const router = new Router(routes);

    expect(() => router.navigate(router.getRoutes()[0].path)).not.toThrow();
  });
});
