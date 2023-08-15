import Favicon from '../favicon/favicon';
import { PagePath } from '../router/pages';
import Router, { Route } from '../router/router';
import ViewStorage from '../view-storage/view-storage';
import DefaultView from '../view/default-view';
import FooterView from '../view/page/footer-view/footer-view';
import HeaderView from '../view/page/header-view/header-view';
import MainView from '../view/page/main-view/main-view';

export default class App {
  private favicon: Favicon;

  private header: HeaderView;

  private main: MainView;

  private footer: FooterView;

  private router: Router;

  private viewStorage: ViewStorage = new ViewStorage();

  constructor() {
    this.favicon = new Favicon();

    const routes: Route[] = this.getRoutes();

    this.router = new Router(routes);

    this.main = new MainView();
    this.header = new HeaderView(this.router);
    this.footer = new FooterView();
  }

  init() {
    document.head.append(this.favicon.getElement());

    document.body.append(this.header.getElement());
    document.body.append(this.main.getElement());
    document.body.append(this.footer.getElement());
  }

  private setContent(pageName: string, view: DefaultView) {
    const creator = this.main.getCreator();
    creator.clearInnerContent();
    creator.addInnerElement(view.getElement());
  }

  private getRoutes() {
    return [
      {
        path: ``,
        callback: async () => {
          const { getView } = await import('../view/page/index-view/index-view');
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.INDEX)
            ? this.viewStorage.get(PagePath.INDEX)
            : getView();
          if (view) {
            this.viewStorage.set(PagePath.INDEX, view);
            this.setContent(PagePath.INDEX, view);
          }
        },
      },
      {
        path: `${PagePath.INDEX}`,
        callback: async () => {
          const { getView } = await import('../view/page/index-view/index-view');
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.INDEX)
            ? this.viewStorage.get(PagePath.INDEX)
            : getView();
          if (view) {
            this.viewStorage.set(PagePath.INDEX, view);
            this.setContent(PagePath.INDEX, view);
          }
        },
      },
      {
        path: `${PagePath.LOGIN}`,
        callback: async () => {
          const { getView } = await import('../view/page/login-view/login-view');
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.LOGIN)
            ? this.viewStorage.get(PagePath.LOGIN)
            : getView(this.router);
          if (view) {
            this.viewStorage.set(PagePath.LOGIN, view);
            this.setContent(PagePath.LOGIN, view);
          }
        },
      },
      {
        path: `${PagePath.REGISTRATION}`,
        callback: async () => {
          const { getView } = await import('../view/page/registration-view/registration-view');
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.REGISTRATION)
            ? this.viewStorage.get(PagePath.REGISTRATION)
            : getView();
          if (view) {
            this.viewStorage.set(PagePath.REGISTRATION, view);
            this.setContent(PagePath.REGISTRATION, view);
          }
        },
      },
      {
        path: `${PagePath.NOT_FOUND}`,
        callback: async () => {
          const { getView } = await import('../view/page/not-found-view/not-found-view');
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.NOT_FOUND)
            ? this.viewStorage.get(PagePath.NOT_FOUND)
            : getView();
          if (view) {
            this.viewStorage.set(PagePath.NOT_FOUND, view);
            this.setContent(PagePath.NOT_FOUND, view);
          }
        },
      },
      //     {
      //       path: `${PagePath.PRODUCT}`,
      //       callback: async () => {
      //         const { default: ProductView } = await import('../view/page/login-view/login-view');
      //         this.setContent(PagePath.PRODUCT, new ProductView(this.router));
      //       },
      //     },
      //     {
      //       path: `${PagePath.PRODUCT}/${ITEM_ID}`,
      //       callback: async (id) => {
      //         const { default: ProductView } = await import('../view/page/registration-view/registration-view');
      //         this.setContent(PagePath.PRODUCT, new ProductView(this.router, id));
      //       },
      //     },
    ];
  }
}
