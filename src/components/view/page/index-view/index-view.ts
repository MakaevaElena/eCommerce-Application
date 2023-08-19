import TagName from '../../../../enum/tag-name';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './index-view.module.scss';

export default class IndexView extends DefaultView {
  constructor() {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: Object.values(styleCss),
      textContent: '',
    };
    super(params);

    // this.configView();
  }

  private configView() {
    throw new Error(`configView() for ${this.getElement()} not implemented`);
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }
}

export function getView(): IndexView {
  return new IndexView();
}
