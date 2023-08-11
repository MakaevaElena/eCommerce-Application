import Favicon from '../favicon/favicon';
import { ITEM_ID, PagePath } from '../router/pages';
import Router, { Route } from '../router/router';
import ViewStorage from '../view-storage/view-storage';
import DefaultView from '../view/default-view';
import FooterView from '../view/page/footer-view/footer-view';
import HeaderView from '../view/page/header-view/header-view';
import IndexView from '../view/page/index-view/index-view';
import LoginView from '../view/page/login-view/login-view';
import MainView from '../view/page/main-view/main-view';
import NotFoundView from '../view/page/not-found-view/not-found-view';
import RegistrationView from '../view/page/registration-view/registration-view';

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
          const { default: IndexViewDinamic } = await import('../view/page/index-view/index-view');
          console.log('IndexViewDinamic: ', IndexViewDinamic);
          // this.setContent(PagePath.INDEX, new IndexViewDinamic());
        },
      },
      {
        path: `${PagePath.INDEX}`,
        callback: async () => {
          // const { default: IndexView } = await import('../view/page/index-view/index-view');
          const view = this.viewStorage.has(PagePath.INDEX) ? this.viewStorage.get(PagePath.INDEX) : new IndexView();
          if (view) {
            this.viewStorage.set(PagePath.INDEX, view);
            this.setContent(PagePath.INDEX, view);
          }
        },
      },
      {
        path: `${PagePath.LOGIN}`,
        callback: () => {
          // const { default: LoginView } = await import('../view/page/login-view/login-view');
          this.setContent(PagePath.LOGIN, new LoginView());
        },
      },
      {
        path: `${PagePath.REGISTRATION}`,
        callback: () => {
          // const { default: RegistrationView } = await import('../view/page/registration-view/registration-view');
          this.setContent(PagePath.REGISTRATION, new RegistrationView());
        },
      },
      {
        path: `${PagePath.NOT_FOUND}`,
        callback: () => {
          // const { default: NotFoundView } = await import('./view/main/not-found/not-found-view');
          this.setContent(PagePath.NOT_FOUND, new NotFoundView());
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
