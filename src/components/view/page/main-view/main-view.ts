import TagName from '../../../../enum/tag-name';
import { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import DefaultView from '../../default-view';
import styleCss from './main-view.module.scss';

export default class MainView extends DefaultView {
  constructor() {
    const params: ElementParams = {
      tag: TagName.MAIN,
      classNames: Object.values(styleCss),
      textContent: 'MainView',
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
