import { Product } from '@commercetools/platform-sdk';
import ProductApi from '../../../../api/products-api';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import ElementCreator, { ElementParams, InsertableElement } from '../../../../utils/element-creator';
import Router from '../../../router/router';
import ProductCard from '../../../shared/product-card/product-card';
import DefaultView from '../../default-view';
import styleCss from './catalog-view.module.scss';
import ErrorMessage from '../../../message/error-message';
import Filter from './filter/filter';
import Observer from '../../../../observer/observer';
import EventName from '../../../../enum/event-name';
import SortView from './sort/sort';

export default class CatalogView extends DefaultView {
  private router: Router;

  private cardsWrapper: HTMLDivElement;

  private controlsWrapper: HTMLDivElement;

  private productApi = new ProductApi();

  private filter: Filter;

  private sorting: SortView;

  private observer = Observer.getInstance();

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['catalog-view']],
      textContent: '',
    };
    super(params);

    this.filter = new Filter(this.productApi);

    this.sorting = new SortView();

    this.router = router;

    this.observer.subscribe(EventName.UPDATE_CATALOG_CARDS, this.recallProductCards.bind(this));

    this.controlsWrapper = new TagElement().createTagElement('div', [styleCss['controls-wrapper']]);

    this.cardsWrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.cardsWrapper);

    this.configView();
  }

  private recallProductCards() {
    this.getConditionalProducts();
  }

  private setContent(element: InsertableElement) {
    this.cardsWrapper.replaceChildren('');
    if (element instanceof ElementCreator) {
      this.cardsWrapper.append(element.getElement());
    } else {
      this.cardsWrapper.append(element);
    }
  }

  private configView() {
    this.createContent();
  }

  private createContent() {
    const filterHeader = this.filter.getFilterHeaderElement();
    const sortingElement = this.sorting.getElement();

    this.controlsWrapper.append(filterHeader, sortingElement);
    this.getElement().append(this.controlsWrapper, this.cardsWrapper);
    // this.getElement().append(filterHeader, this.cardsWrapper);
    this.getConditionalProducts();
  }

  private getProducts() {
    this.productApi
      .getProducts()
      .then((response) => {
        const products = response.body.results;
        this.createProductCards(products);
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  private getConditionalProducts() {
    const where = this.filter.getWhereCondition();

    this.productApi
      .getConditionalProducts(where)
      .then((response) => {
        const products = response.body.results;
        this.createProductCards(products);
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  private createProductCards(products: Product[]) {
    this.cardsWrapper.replaceChildren('');
    products.forEach((product) => {
      if (product.key) {
        const card = new ProductCard(product, this.router);
        this.cardsWrapper.append(card.getElement());
      }
    });
  }
}
