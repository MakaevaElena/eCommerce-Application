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

    this.router = router;
    this.configView();
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private configView() {
    this.createLinkButtons();
    this.createLogoutButton();
  }

  private createLinkButtons() {
    Object.keys(LinkName).forEach((key) => {
      const path = PagePath[key as keyof typeof PagePath];
      const title = LinkName[key as keyof typeof LinkName];
      const route = this.getRoute(path);
      if (route) {
        const link = new LinkButton(title, () => this.router.navigate(path), this.headerLinks);

        this.headerLinks.set(LinkName[key as keyof typeof LinkName], link);

        this.getCreator().addInnerElement(link.getElement());
      }
    });
  }

  private createLogoutButton() {
    const logoutButton = new ElementCreator({
      tag: TagName.BUTTON,
      classNames: [styleCss['header__logout-button'], styleCss['link-button']],
      textContent: 'Logout',
    });

    logoutButton.getElement().addEventListener('click', () => {
      localStorage.setItem(`isLogin`, 'false');
      this.observer.notify(EventName.LOGOUT);
      this.updateHeader();
      this.router.navigate(PagePath.LOGIN);
    });

    if (localStorage.getItem(`isLogin`) === null || localStorage.getItem(`isLogin`) === 'false') {
      logoutButton.getElement().classList.add(styleCss.hide);
    }
    this.getCreator().addInnerElement(logoutButton);
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
