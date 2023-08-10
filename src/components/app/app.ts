import Favicon from '../favicon/favicon';
import { ID_SELECTOR, Pages } from '../router/pages';
import Router, { Route } from '../router/router';
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
        name: Pages.EMPTY,
        callback: () => {
          // const { default: IndexView } = await import('../view/page/index-view/index-view');
          this.setContent(Pages.INDEX, new IndexView());
        },
      },
      {
        path: `${Pages.INDEX}`,
        name: Pages.INDEX,
        callback: () => {
          // const { default: IndexView } = await import('../view/page/index-view/index-view');
          this.setContent(Pages.INDEX, new IndexView());
        },
      },
      {
        path: `${Pages.LOGIN}`,
        name: Pages.LOGIN,
        callback: () => {
          // const { default: LoginView } = await import('../view/page/login-view/login-view');
          this.setContent(Pages.LOGIN, new LoginView());
        },
      },
      {
        path: `${Pages.REGISTRATION}`,
        name: Pages.REGISTRATION,
        callback: () => {
          // const { default: RegistrationView } = await import('../view/page/registration-view/registration-view');
          this.setContent(Pages.REGISTRATION, new RegistrationView());
        },
      },
      {
        path: `${Pages.NOT_FOUND}`,
        name: Pages.EMPTY,
        callback: () => {
          // const { default: NotFoundView } = await import('./view/main/not-found/not-found-view');
          this.setContent(Pages.NOT_FOUND, new NotFoundView());
        },
      },
      //     {
      //       path: `${Pages.PRODUCT}`,
      //       callback: async () => {
      //         const { default: ProductView } = await import('../view/page/login-view/login-view');
      //         this.setContent(Pages.PRODUCT, new ProductView(this.router));
      //       },
      //     },
      //     {
      //       path: `${Pages.PRODUCT}/${ID_SELECTOR}`,
      //       callback: async (id) => {
      //         const { default: ProductView } = await import('../view/page/registration-view/registration-view');
      //         this.setContent(Pages.PRODUCT, new ProductView(this.router, id));
      //       },
      //     },
    ];
  }
}
