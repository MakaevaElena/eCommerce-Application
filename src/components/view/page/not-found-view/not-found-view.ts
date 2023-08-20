import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './not-found-view.module.scss';

export default class NotFoundView extends DefaultView {
  constructor() {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: Object.values(styleCss),
      textContent: '',
    };
    super(params);

    this.configView();
  }

  private configView() {
    const creator = new TagElement();
    const link = creator.createTagElement('a', [styleCss.link]);
    link.setAttribute('href', '#');
    const title = new TagElement().createTagElement('h1', [styleCss.title], 'Page Not Found');
    link.append(title);
    this.getCreator().addInnerElement(link);
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }
}

export function getView(): NotFoundView {
  return new NotFoundView();
}
