import TagName from '../../../../enum/tag-name';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, Pages } from '../../../router/pages';
import Router, { Route } from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './header-view.module.scss';

export default class HeaderView extends DefaultView {
  private router: Router;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['header-view']],
      textContent: 'HeaderView',
    };
    super(params);

    this.router = router;
    this.configView();
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private configView() {
    this.createLinkButtons();
  }

  private createLinkButtons() {
    this.createIndexButton();
    this.createLoginButton();
    this.createRegistrationButton();
  }

  private createIndexButton() {
    const link = this.createButton(Pages.INDEX, LinkName.INDEX);
    if (link instanceof LinkButton) {
      this.getCreator().addInnerElement(link.getElement());
    }
  }

  private createLoginButton() {
    const link = this.createButton(Pages.LOGIN, LinkName.LOGIN);
    if (link instanceof LinkButton) {
      this.getCreator().addInnerElement(link.getElement());
    }
  }

  private createRegistrationButton() {
    const link = this.createButton(Pages.REGISTRATION, LinkName.REGISTRATION);
    if (link instanceof LinkButton) {
      this.getCreator().addInnerElement(link.getElement());
    }
  }

  private createButton(page: Pages, title: LinkName): LinkButton | undefined {
    const route = this.getRoute(page);
    if (route) {
      const link = new LinkButton(title, route.callback);
      return link;
    }
    return undefined;
  }

  private getRoute(routeName: Pages): Route | undefined {
    const route = this.router.getRoutes().find((item) => item.name === routeName);
    return route;
  }
}
