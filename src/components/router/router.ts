import HistoryRouterHandler from './handler/history/history-router-handler';
import HashRouterHandler from './handler/hash/hash-router-handler';
import { Pages, ID_SELECTOR } from './pages';
import { RequestParams } from './handler/default-router-handler';

export type Route = {
  path: string;
  callback: (url: string) => void;
};

export default class Router {
  private routes: Route[];

  private handler: HistoryRouterHandler;

  constructor(routes: Route[]) {
    this.routes = routes;

    this.handler = new HistoryRouterHandler(this.urlChangedHandler.bind(this));

    document.addEventListener('DOMContentLoaded', () => {
      this.handler.navigate('');
    });
  }

  public setHistoryHandler() {
    this.handler.disable();
    this.handler = new HistoryRouterHandler(this.urlChangedHandler.bind(this));
  }

  public setHashHandler() {
    this.handler.disable();
    this.handler = new HashRouterHandler(this.urlChangedHandler.bind(this));
  }

  public navigate(url: string) {
    window.history.pushState(null, '', `/${url}`); // TODO: must depend of this.handler's instance type
    this.handler.navigate(url);
  }

  private urlChangedHandler(requestParams: RequestParams) {
    const newPath = requestParams.resource === '' ? requestParams.path : `${requestParams.path}/${ID_SELECTOR}`;
    const route = this.routes.find((item) => item.path === newPath);

    if (!route) {
      this.redirectToNotFoundPage();
      return;
    }

    route.callback(requestParams.resource);
  }

  private redirectToNotFoundPage() {
    const notFoundPage = this.routes.find((item) => item.path === Pages.NOT_FOUND);
    if (notFoundPage) {
      this.navigate(notFoundPage.path);
    }
  }
}
