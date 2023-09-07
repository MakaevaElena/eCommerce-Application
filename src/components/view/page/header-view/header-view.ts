import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router, { Route } from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './header-view.module.scss';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';

export default class HeaderView extends DefaultView {
  private router: Router;

  private observer: Observer;

  private headerLinks: Map<string, LinkButton>;

  private buttonsWrapper: ElementCreator;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['header-view']],
      textContent: '',
    };
    super(params);

    this.observer = Observer.getInstance();

    this.headerLinks = new Map();

    this.buttonsWrapper = this.createButtonWrapper();

    this.router = router;
    this.configView();
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private configView() {
    this.buttonsWrapper.clearInnerContent();
    this.createMainButton(this.buttonsWrapper);
    this.createCatalogButton(this.buttonsWrapper);
    this.createLogInButton(this.buttonsWrapper);
    this.createSignInButton(this.buttonsWrapper);
    this.createLogoutButton(this.buttonsWrapper);
    this.createProfileButton(this.buttonsWrapper);
    this.createCartButton(this.buttonsWrapper);

    this.getCreator().addInnerElement(this.buttonsWrapper);
  }

  private createButtonWrapper(): ElementCreator {
    const params: ElementParams = {
      tag: TagName.DIV,
      classNames: [styleCss['header-view__button-wrapper']],
      textContent: '',
    };
    this.buttonsWrapper = new ElementCreator(params);

    return this.buttonsWrapper;
  }

  private createMainButton(parent: ElementCreator) {
    const parentElement = parent.getElement();
    const path = PagePath.INDEX;
    const title = LinkName.INDEX;
    const route = this.getRoute(path);
    if (route) {
      const link = new LinkButton(title, () => {
        this.router.setHref(path);
      });
      this.headerLinks.set(title, link);
      parentElement.append(link.getElement());
    }
  }

  private createCatalogButton(parent: ElementCreator) {
    const parentElement = parent.getElement();
    const path = PagePath.CATALOG;
    const title = LinkName.CATALOG;
    const route = this.getRoute(path);
    if (route) {
      const link = new LinkButton(title, () => {
        this.router.setHref(path);
      });
      this.headerLinks.set(title, link);

      parentElement.append(link.getElement());
    }
  }

  private createLogInButton(parent: ElementCreator) {
    const parentElement = parent.getElement();
    const path = PagePath.LOGIN;
    const title = LinkName.LOGIN;
    const route = this.getRoute(path);
    if (route) {
      const link = new LinkButton(title, () => {
        this.router.setHref(path);
      });
      this.headerLinks.set(title, link);

      this.observer.subscribe(EventName.LOGIN, () => link.hideButton());
      this.observer.subscribe(EventName.LOGOUT, () => link.showButton());

      parentElement.append(link.getElement());
    }
  }

  private createSignInButton(parent: ElementCreator) {
    const parentElement = parent.getElement();
    const path = PagePath.REGISTRATION;
    const title = LinkName.REGISTRATION;
    const route = this.getRoute(path);
    if (route) {
      const link = new LinkButton(title, () => {
        this.router.setHref(path);
      });
      this.headerLinks.set(title, link);

      this.observer.subscribe(EventName.LOGIN, () => link.hideButton());
      this.observer.subscribe(EventName.LOGOUT, () => link.showButton());

      parentElement.append(link.getElement());
    }
  }

  private createLogoutButton(parent: ElementCreator) {
    const parentElement = parent.getElement();
    const link = new LinkButton(LinkName.LOGOUT, () => {
      this.observer.notify(EventName.LOGOUT);
      localStorage.setItem(`isLogin`, 'false');
      this.router.setHref('');
    });

    this.observer.subscribe(EventName.LOGIN, () => link.showButton());
    this.observer.subscribe(EventName.LOGOUT, () => link.hideButton());

    parentElement.append(link.getElement());
  }

  private createProfileButton(parent: ElementCreator) {
    const parentElement = parent.getElement();
    const link = new LinkButton(LinkName.PROFILE, () => {
      this.router.setHref(PagePath.PROFILE);
    });

    this.observer.subscribe(EventName.LOGIN, () => link.showButton());
    this.observer.subscribe(EventName.LOGOUT, () => link.hideButton());

    parentElement.append(link.getElement());
  }

  private createCartButton(parent: ElementCreator) {
    const parentElement = parent.getElement();
    const link = new LinkButton(LinkName.CART, () => {
      this.router.setHref(PagePath.CART);
    });

    this.observer.subscribe(EventName.UPDATE_CART, () => {});

    parentElement.append(link.getElement());
  }

  private updateHeader() {
    this.getCreator().clearInnerContent();
    this.configView();
  }

  private getRoute(routeName: string): Route | undefined {
    const route = this.router.getRoutes().find((item) => item.path === routeName);
    return route;
  }
}
