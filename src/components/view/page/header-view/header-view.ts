import TagName from '../../../../enum/tag-name';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router, { Route } from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './header-view.module.scss';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';
import ImageButton from '../../../shared/image-button/image-button';

export default class HeaderView extends DefaultView {
  private router: Router;

  private observer: Observer;

  private headerLinks: Map<string, LinkButton | ImageButton>;

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

    this.observer.subscribe(EventName.UPDATE_CART, this.updateCartCounter.bind(this));

    this.configView();
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private configView() {
    const buttons: DefaultView[] = [];
    buttons.push(this.createMainButton());
    buttons.push(this.createCatalogButton());
    buttons.push(this.createLogInButton());
    buttons.push(this.createSignInButton());
    buttons.push(this.createLogoutButton());
    buttons.push(this.createProfileButton());
    buttons.push(this.createCartButton());
    buttons.push(this.createAbouUsButton());

    this.buttonsWrapper.getElement().append(...buttons.map((button) => button.getElement()));
    this.getCreator().addInnerElement(this.buttonsWrapper);
  }

  private updateCartCounter() {
    const aboutUsButton = this.headerLinks.get(PagePath.ABOUT_US);
    if (aboutUsButton && aboutUsButton instanceof ImageButton) {
      aboutUsButton.setCounterValue(10);
    }
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

  private createAbouUsButton() {
    const path = PagePath.ABOUT_US;

    const link = new ImageButton(() => {
      this.router.setHref(path);
    });
    link.setImage(styleCss['button-about-us']);
    this.headerLinks.set(path, link);

    return link;
  }

  private createCartButton() {
    const path = PagePath.CART;

    const link = new ImageButton(() => {
      this.router.setHref(PagePath.CART);
    });
    link.setImage(styleCss['button-cart']);

    this.headerLinks.set(path, link);

    return link;
  }

  private createMainButton() {
    const path = PagePath.INDEX;

    const link = new LinkButton(LinkName.INDEX, () => {
      this.router.setHref(path);
    });
    this.headerLinks.set(path, link);
    return link;
  }

  private createCatalogButton() {
    const path = PagePath.CATALOG;

    const link = new LinkButton(LinkName.CATALOG, () => {
      this.router.setHref(path);
    });
    this.headerLinks.set(path, link);

    return link;
  }

  private createLogInButton() {
    const path = PagePath.LOGIN;

    const link = new LinkButton(LinkName.LOGIN, () => {
      this.router.setHref(path);
    });
    this.headerLinks.set(path, link);

    this.observer.subscribe(EventName.LOGIN, () => link.hideButton());
    this.observer.subscribe(EventName.LOGOUT, () => link.showButton());

    return link;
  }

  private createSignInButton() {
    const path = PagePath.REGISTRATION;

    const link = new LinkButton(LinkName.REGISTRATION, () => {
      this.router.setHref(path);
    });
    this.headerLinks.set(path, link);

    this.observer.subscribe(EventName.LOGIN, () => link.hideButton());
    this.observer.subscribe(EventName.LOGOUT, () => link.showButton());

    return link;
  }

  private createLogoutButton() {
    const link = new LinkButton(LinkName.LOGOUT, () => {
      this.observer.notify(EventName.LOGOUT);
      localStorage.setItem(`isLogin`, 'false');
      localStorage.removeItem('anonimCardID');
      this.router.setHref('');
    });

    this.observer.subscribe(EventName.LOGIN, () => link.showButton());
    this.observer.subscribe(EventName.LOGOUT, () => link.hideButton());

    return link;
  }

  private createProfileButton() {
    const link = new LinkButton(LinkName.PROFILE, () => {
      this.router.setHref(PagePath.PROFILE);
    });

    this.observer.subscribe(EventName.LOGIN, () => link.showButton());
    this.observer.subscribe(EventName.LOGOUT, () => link.hideButton());

    return link;
  }

  private getRoute(routeName: string): Route | undefined {
    const route = this.router.getRoutes().find((item) => item.path === routeName);
    return route;
  }
}
