import Favicon from '../favicon/favicon';
import Router, { Route } from '../router/router';
import LoginView from '../view/page/login-view/login-view';
import MainView from '../view/page/main-view/main-view';
import RegistrationView from '../view/page/registration-view/registration-view';

export default class App {
  private favicon: Favicon;

  private mainView: MainView;

  private loginView: LoginView;

  private registrationView: RegistrationView;

  private router: Router;

  constructor() {
    this.favicon = new Favicon();

    // const routes: Route[] = this.getRoutes();

    this.router = new Router(routes);

    this.mainView = new MainView();
    this.loginView = new LoginView();
    this.registrationView = new RegistrationView();
  }

  init() {
    document.head.append(this.favicon.getElement());

    document.body.append(this.mainView.getElement());
    document.body.append(this.loginView.getElement());
    document.body.append(this.registrationView.getElement());
  }

  // private createRoutes(state) {
  //   return [
  //     {
  //       path: ``,
  //       callback: async () => {
  //         const { default: IndexView } = await import('../view/page/index-view/index-view');
  //         this.setContent(Pages.INDEX, new IndexView(state));
  //       },
  //     },
  //     {
  //       path: `${Pages.INDEX}`,
  //       callback: async () => {
  //         const { default: IndexView } = await import('../view/page/index-view/index-view');
  //         this.setContent(Pages.INDEX, new IndexView(state));
  //       },
  //     },
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
  //     {
  //       path: `${Pages.NOT_FOUND}`,
  //       callback: async () => {
  //         const { default: NotFoundView } = await import('./view/main/not-found/not-found-view');
  //         this.setContent(Pages.NOT_FOUND, new NotFoundView());
  //       },
  //     },
  //   ];
  // }
}
