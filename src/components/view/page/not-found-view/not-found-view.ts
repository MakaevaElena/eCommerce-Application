import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './not-found-view.module.scss';

export default class NotFoundView extends DefaultView {
  private readonly BUTTON_TITLE = 'Back to main page';

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
    const creator = new TagElement();
    const link = creator.createTagElement('a', [styleCss.link]);
    link.setAttribute('href', '#');
    const title = new TagElement().createTagElement('h1', [styleCss.title], 'Page Not Found');
    link.append(title);

    const button = new LinkButton(this.BUTTON_TITLE, () => this.router.setHref(PagePath.INDEX));
    this.getCreator().addInnerElement(link);
    this.getCreator().addInnerElement(button.getElement());
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }
}
