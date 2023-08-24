import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import { LinkName, PagePath } from '../../../router/pages';
import Router from '../../../router/router';
import LinkButton from '../../../shared/link-button/link-button';
import DefaultView from '../../default-view';
import styleCss from './product-view.module.scss';

export default class ProductView extends DefaultView {
  private router: Router;

  private productId: string = '';

  private wrapper: HTMLDivElement;

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['product-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.wrapper);

    this.configView();
  }

  public initContent(productId?: string) {
    console.log('productId: ', productId);
    if (productId) {
      this.productId = productId;
    }
  }

  public setContent(element: InsertableElement) {
    this.wrapper.replaceChildren('');
    if (element instanceof ElementCreator) {
      this.wrapper.append(element.getElement());
    } else {
      this.wrapper.append(element);
    }
  }

  private configView() {
    this.createContent();
  }

  private createContent() {
    const button = this.createMainButton();

    this.wrapper.append(button.getElement());
  }

  private createMainButton() {
    const button = new LinkButton(LinkName.INDEX, () => {
      this.router.navigate(PagePath.INDEX);
    });
    return button;
  }
}
