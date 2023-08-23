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
    this.observer?.subscribe(EventName.LOGIN, this.updateHeader.bind(this));

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
    this.createLinkButtons(this.buttonsWrapper.getElement());
    this.createLogoutButton(this.buttonsWrapper.getElement());
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

  private createLinkButtons(parentElement: HTMLElement) {
    Object.keys(LinkName).forEach((key) => {
      const path = PagePath[key as keyof typeof PagePath];
      const title = LinkName[key as keyof typeof LinkName];
      const route = this.getRoute(path);
      if (route) {
        const link = new LinkButton(title, () => this.router.navigate(path), this.headerLinks);

        this.headerLinks.set(LinkName[key as keyof typeof LinkName], link);

        parentElement.append(link.getElement());
      }
    });
  }

  private createLogoutButton(parentElement: HTMLElement) {
    const logoutButton = new LinkButton('Logout', () => this.router.navigate(''), this.headerLinks);

    logoutButton.getElement().addEventListener('click', () => {
      localStorage.setItem(`isLogin`, 'false');
      this.observer.notify(EventName.LOGOUT);
      this.updateHeader();
      this.router.navigate(PagePath.INDEX);
    });

    if (localStorage.getItem(`isLogin`) === null || localStorage.getItem(`isLogin`) === 'false') {
      logoutButton.getElement().classList.add(styleCss.hide);
    }
    parentElement.append(logoutButton.getElement());
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
