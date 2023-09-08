import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
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
    const wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);
    // const messageButton = this.createMessageButton();
    // wrapper.append(messageButton.getElement());
    this.getCreator().addInnerElement(wrapper);
  }

  // private createMessageButton() {
  //   const linkButton = new LinkButton('Messages', () => {
  //     this.showMessage();
  //   });

  //   return linkButton;
  // }

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
