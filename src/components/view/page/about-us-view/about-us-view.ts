import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import DefaultView from '../../default-view';
import styleCss from './styles/about-us-view.module.scss';
import Title from './title/title';

export default class AboutUsView extends DefaultView {
  private router: Router;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['about-us-view']],
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

    const title = new Title();

    wrapper.append(title.getElement());
    this.getCreator().addInnerElement(wrapper);
  }

  // private createSignInButton() {
  //   const linkButton = new LinkButton(LinkName.REGISTRATION, () => {
  //     if (localStorage.getItem('isLogin') === 'true') {
  //       this.router.navigate(PagePath.INDEX);
  //     } else {
  //       this.router.navigate(PagePath.REGISTRATION);
  //     }
  //   });
  //   return linkButton;
  // }
}
