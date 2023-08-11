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
    Object.keys(LinkName).forEach((key) => {
      const path = Pages[key as keyof typeof Pages];
      const title = LinkName[key as keyof typeof LinkName];
      const route = this.getRoute(path);
      if (route) {
        const link = new LinkButton(title, () => this.router.navigate(path));
        this.getCreator().addInnerElement(link.getElement());
      }
    });
  }

  private getRoute(routeName: string): Route | undefined {
    const route = this.router.getRoutes().find((item) => item.path === routeName);
    return route;
  }
}
