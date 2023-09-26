import TagName from '../../../../enum/tag-name';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './main-view.module.scss';

export default class MainView extends DefaultView {
  constructor() {
    const params: ElementParams = {
      tag: TagName.MAIN,
      classNames: Object.values(styleCss),
      textContent: '',
    };
    super(params);
  }

  public setContent(element: InsertableElement) {
    this.getCreator().clearInnerContent();
    this.getCreator().addInnerElement(element);
  }
}
