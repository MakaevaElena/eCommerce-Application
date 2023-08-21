import TagName from '../../../../enum/tag-name';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './index-view.module.scss';

export default class IndexView extends DefaultView {
  private router: Router;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: Object.values(styleCss),
      textContent: '',
    };
    super(params);

    this.router = router;

    this.configView();
  }

  private configView() {
    this.createLinks();
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }

  private createLinks() {
    const logInButton = this.createLogInButton();
    const signInButton = this.createSignInButton();

    this.getCreator().addInnerElement(logInButton.getElement());
    this.getCreator().addInnerElement(signInButton.getElement());
  }

  private createLogInButton() {
    const linkButton = new LinkButton(LinkName.LOGIN, () => {
      if (localStorage.getItem('isLogin') === 'true') {
        this.router.navigate(PagePath.INDEX);
      } else {
        this.router.navigate(PagePath.LOGIN);
      }
    });
    return linkButton;
  }

  private createSignInButton() {
    const linkButton = new LinkButton(LinkName.REGISTRATION, () => {
      if (localStorage.getItem('isLogin') === 'true') {
        this.router.navigate(PagePath.INDEX);
      } else {
        this.router.navigate(PagePath.REGISTRATION);
      }
    });
    return linkButton;
  }
}

export function getView(router: Router): IndexView {
  return new IndexView(router);
}
