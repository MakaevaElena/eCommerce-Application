import { Product } from '@commercetools/platform-sdk';
import ProductApi from '../../../../api/products-api';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
// import { PagePath } from '../../../router/pages';
import Router from '../../../router/router';
// import LinkButton from '../../../shared/link-button/link-button';
import ProductCard from '../../../shared/product-card/product-card';
import DefaultView from '../../default-view';
import styleCss from './catalog-view.module.scss';
import ErrorMessage from '../../../message/error-message';

export default class CatalogView extends DefaultView {
  private router: Router;

  private wrapper: HTMLDivElement;

  private productApi = new ProductApi();

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['catalog-view']],
      textContent: '',
    };
    super(params);

    this.router = router;

    this.wrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.wrapper);

    this.configView();
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
    this.wrapper.replaceChildren('');
    this.getProducts();
  }

  private getProducts() {
    this.productApi
      .getProducts()
      .then((response) => {
        const products = response.body.results;
        this.createProductLinks(products);
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  private createProductLinks(products: Product[]) {
    products.forEach((product) => {
      if (product.key) {
        // const link = new LinkButton(product.key, () => this.router.navigate(`${PagePath.CATALOG}/${product.key}`));
        const card = new ProductCard(product.key, this.router);

        this.wrapper.append(card.getElement());
      }
    });
  }
}
