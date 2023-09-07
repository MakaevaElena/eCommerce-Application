import styleCss from './breadcrumb.module.scss';
import { ElementParams } from '../../../../../utils/element-creator';
import DefaultView from '../../../default-view';
import TagName from '../../../../../enum/tag-name';
import CategoryType from './type';

export default class Breadcrumb extends DefaultView {
  private childNodes: Breadcrumb[] = [];

  private parentNode: Breadcrumb | null = null;

  private category: CategoryType;

  constructor(category: CategoryType) {
    const elementParams: ElementParams = {
      tag: TagName.UL,
      textContent: category.name,
      classNames: [styleCss.breadcrumb],
    };

    super(elementParams);

    this.category = category;

    this.configView();
  }

  private configView() {
    this.getElement().addEventListener('click', () => {});
  }

  public hideButton() {
    this.getElement().classList.add(styleCss.hide);
  }

  public showButton() {
    this.getElement().classList.remove(styleCss.hide);
  }
}
