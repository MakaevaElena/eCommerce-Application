import RouterHandler, { RequestParams } from './router-handler';
import { PagePath, ITEM_ID } from './pages';

export type Route = {
  path: string;
  callback: (param?: string) => void;
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
    this.handler.navigate(url);
  }

  private urlChangedHandler(requestParams: RequestParams) {
    const newPath = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/${ITEM_ID}`;
    const route = this.routes.find((item) => item.path === newPath);

    if (!route) {
      this.redirectToNotFoundPage();
      return;
    }

    if (requestParams.resource) {
      route.callback(requestParams.resource);
    } else {
      route.callback();
    }
  }

  private redirectToNotFoundPage() {
    const notFoundPage = this.routes.find((item) => item.path === PagePath.NOT_FOUND);
    if (notFoundPage) {
      this.navigate(notFoundPage.path);
    }
  }
}
