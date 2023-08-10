import RouterHandler, { RequestParams } from './router-handler';
import { Pages, ID_SELECTOR } from './pages';

export type Route = {
  path: string;
  name: Pages;
  callback: () => void;
};

export default class Router {
  private routes: Route[];

  private handler: RouterHandler;

  constructor(routes: Route[]) {
    this.routes = routes;

    this.handler = new RouterHandler(this.urlChangedHandler.bind(this));

    document.addEventListener('DOMContentLoaded', () => {
      this.handler.navigate('');
    });
  }

  public getRoutes(): Array<Route> {
    return this.routes;
  }

  public navigate(url: string) {
    window.history.pushState(null, '', `${url}`);
    this.handler.navigate(url);
  }

  private urlChangedHandler(requestParams: RequestParams) {
    const newPath = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/${ID_SELECTOR}`;
    const route = this.routes.find((item) => item.path === newPath);

    if (!route) {
      this.redirectToNotFoundPage();
      return;
    }

    route.callback();
  }

  private redirectToNotFoundPage() {
    const notFoundPage = this.routes.find((item) => item.path === Pages.NOT_FOUND);
    if (notFoundPage) {
      this.navigate(notFoundPage.path);
    }
  }
}
