import Favicon from '../favicon/favicon';
import '../../style/global.scss';
import { PagePath, ITEM_ID } from '../router/pages';
import Router, { Route } from '../router/router';
import ViewStorage from '../view-storage/view-storage';
import DefaultView from '../view/default-view';
import FooterView from '../view/page/footer-view/footer-view';
import HeaderView from '../view/page/header-view/header-view';
import MainView from '../view/page/main-view/main-view';
import EventName from '../../enum/event-name';
import Observer from '../../observer/observer';
import TotalApi from '../../api/total-api';
import createAnonim from '../../api/sdk/with-anonimous-flow';
import ApiType from './type';
import LocalStorageKeys from '../../enum/local-storage-keys';

export default class App {
  private api: TotalApi;

  private observer = Observer.getInstance();

  private favicon: Favicon;

  private header: HeaderView;

  private main: MainView;

  private footer: FooterView;

  private router: Router;

  private viewStorage: ViewStorage = new ViewStorage();

  constructor() {
    this.favicon = new Favicon();

    this.api = this.createApi();

    const routes: Route[] = this.getRoutes();

    this.router = new Router(routes);

    this.main = new MainView();

    const paramApi: ApiType = { api: this.api };

    this.header = new HeaderView(this.router, paramApi);
    this.footer = new FooterView();

    this.observer.subscribe(EventName.LOGIN, this.lookForCustomerCartId.bind(this));
    this.observer.subscribe(EventName.LOGOUT, this.clearCustomerCartId.bind(this));
  }

  public init() {
    document.head.append(this.favicon.getElement());

    document.body.append(this.header.getElement());
    document.body.append(this.main.getElement());
    document.body.append(this.footer.getElement());

    localStorage.setItem(`isLogin`, 'false');

    if (this.isLogged()) {
      this.observer.notify(EventName.LOGIN);
    } else {
      this.observer.notify(EventName.LOGOUT);
    }
  }

  private lookForCustomerCartId() {
    this.api
      .getClientApi()
      .getActiveCart()
      .then((responce) => localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, responce.body.id))
      .catch(() => localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, ''));
  }

  private clearCustomerCartId() {
    localStorage.setItem(LocalStorageKeys.ANONIM_CART_ID, '');
  }

  private createApi() {
    const client = createAnonim();
    this.api = new TotalApi(client);

    return this.api;
  }

  private isLogged() {
    return !(localStorage.getItem(`isLogin`) === null || localStorage.getItem(`isLogin`) === 'false');
  }

  private setContent(pageName: string, view: DefaultView) {
    const creator = this.main.getCreator();
    creator.clearInnerContent();
    creator.addInnerElement(view.getElement());
  }

  private getRoutes(): Route[] {
    const paramApi: ApiType = {
      api: this.api,
    };

    return [
      {
        path: ``,
        callback: async () => {
          const IndexView = (await import('../view/page/index-view/index-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.INDEX)
            ? this.viewStorage.get(PagePath.INDEX)
            : new IndexView(this.router, paramApi);
          if (view) {
            this.viewStorage.set(PagePath.INDEX, view);
            this.setContent(PagePath.INDEX, view);
          }
        },
      },
      {
        path: `${PagePath.INDEX}`,
        callback: async () => {
          const IndexView = (await import('../view/page/index-view/index-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.INDEX)
            ? this.viewStorage.get(PagePath.INDEX)
            : new IndexView(this.router, paramApi);
          if (view) {
            this.viewStorage.set(PagePath.INDEX, view);
            this.setContent(PagePath.INDEX, view);
          }
        },
      },
      {
        path: `${PagePath.LOGIN}`,
        callback: async () => {
          const LoginView = (await import('../view/page/login-view/login-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.LOGIN)
            ? this.viewStorage.get(PagePath.LOGIN)
            : new LoginView(this.router, paramApi);
          if (localStorage.getItem('isLogin') === 'true') {
            this.router.setHref(PagePath.INDEX);
          }
          if (view) {
            this.viewStorage.set(PagePath.LOGIN, view);
            this.setContent(PagePath.LOGIN, view);
          }
        },
      },
      {
        path: `${PagePath.REGISTRATION}`,
        callback: async () => {
          const RegistrationView = (await import('../view/page/registration-view/registration-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.REGISTRATION)
            ? this.viewStorage.get(PagePath.REGISTRATION)
            : new RegistrationView(this.router, paramApi);
          if (view) {
            this.viewStorage.set(PagePath.REGISTRATION, view);
            this.setContent(PagePath.REGISTRATION, view);
          }
        },
      },
      {
        path: `${PagePath.NOT_FOUND}`,
        callback: async () => {
          const NotFoundView = (await import('../view/page/not-found-view/not-found-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.NOT_FOUND)
            ? this.viewStorage.get(PagePath.NOT_FOUND)
            : new NotFoundView(this.router);
          if (view) {
            this.viewStorage.set(PagePath.NOT_FOUND, view);
            this.setContent(PagePath.NOT_FOUND, view);
          }
        },
      },
      {
        path: `${PagePath.CATALOG}`,
        callback: async () => {
          const CatalogView = (await import('../view/page/catalog-view/catalog-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.CATALOG)
            ? this.viewStorage.get(PagePath.CATALOG)
            : new CatalogView(this.router, paramApi);
          if (view) {
            this.viewStorage.set(PagePath.CATALOG, view);
            this.setContent(PagePath.CATALOG, view);
          }
        },
      },
      {
        path: `${PagePath.CATALOG}/${ITEM_ID}`,
        callback: async (id: string | undefined) => {
          const ProductView = (await import('../view/page/product-view/product-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.PRODUCT)
            ? this.viewStorage.get(PagePath.PRODUCT)
            : new ProductView(this.router, paramApi);
          if (view instanceof ProductView) {
            this.viewStorage.set(PagePath.PRODUCT, view);
            view.initContent(id);
            this.setContent(PagePath.PRODUCT, view);
          }
        },
      },
      {
        path: `${PagePath.PROFILE}`,
        callback: async () => {
          if (this.isLogged()) {
            const ProfileView = (await import('../view/page/profile-view/profile-view')).default;
            const view: DefaultView | undefined = this.viewStorage.has(PagePath.PROFILE)
              ? this.viewStorage.get(PagePath.PROFILE)
              : new ProfileView(this.router, paramApi);
            if (view instanceof ProfileView) {
              this.viewStorage.set(PagePath.PROFILE, view);
              this.setContent(PagePath.PROFILE, view);
            }
          } else {
            this.router.setHref(PagePath.LOGIN);
          }
        },
      },
      {
        path: `${PagePath.CART}`,
        callback: async () => {
          const CartView = (await import('../view/page/cart-view/cart-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.PROFILE)
            ? this.viewStorage.get(PagePath.CART)
            : new CartView(this.router, paramApi);
          if (view instanceof CartView) {
            this.viewStorage.set(PagePath.CART, view);
            this.setContent(PagePath.CART, view);
          }
        },
      },
      {
        path: `${PagePath.ABOUT_US}`,
        callback: async () => {
          const AboutUsView = (await import('../view/page/about-us-view/about-us-view')).default;
          const view: DefaultView | undefined = this.viewStorage.has(PagePath.ABOUT_US)
            ? this.viewStorage.get(PagePath.ABOUT_US)
            : new AboutUsView(this.router);
          if (view instanceof AboutUsView) {
            this.viewStorage.set(PagePath.ABOUT_US, view);
            this.setContent(PagePath.ABOUT_US, view);
          }
        },
      },
    ];
  }
}
