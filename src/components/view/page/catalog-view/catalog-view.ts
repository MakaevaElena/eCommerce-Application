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
  private readonly LANG = 'en-US';

  private readonly COUNTRY = 'US';

  private readonly WATCH_DOG_COUNTER = 2;

  private readonly ERROR_MESSAGE_ANONYM = 'The anonymousId';

  private router: Router;

  private cardsWrapper: HTMLDivElement;

  private controlsWrapper: HTMLDivElement;

  private productApi = new ProductApi();

  private filter: Filter;

  private sorting: SortView;

  private observer = Observer.getInstance();

  private sortMapping = [this.sortByNameAsc, this.sortByNameDesc, this.sortByPriceAsc, this.sortByPriceDesc];

  private retryCounter = this.WATCH_DOG_COUNTER;

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
    this.getConditionalProducts();
    this.productApi.getSearchProducts('A').then((responce) => console.log('Search responce: ', responce));
  }

  // private getProducts() {
  //   this.productApi
  //     .getProducts()
  //     .then((response) => {
  //       const products = response.body.results;
  //       this.createProductCards(products);
  //     })
  //     .catch((error) => new ErrorMessage().showMessage(error.message));
  // }

  private getConditionalProducts() {
    const where = this.filter.getWhereCondition();

    this.productApi
      .getConditionalProducts(where)
      .then((response) => {
        console.log('Retry before: ', this.retryCounter);
        const products = response.body.results;
        this.sortProducts(products);
        this.createProductCards(products);
        this.retryCounter = this.WATCH_DOG_COUNTER;
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
          this.retryCounter -= 1;
          console.log('Retry error: ', this.retryCounter);
          if (error.message.startsWith(this.ERROR_MESSAGE_ANONYM)) {
            this.productApi = new ProductApi();
            setTimeout(this.getConditionalProducts.bind(this), 1000);
          }
        }
      });
  }

  private sortProducts(products: Product[]) {
    const sortOrder = this.sorting.getSortCondition();
    products.sort(this.sortMapping[sortOrder].bind(this));
  }

  private sortByNameAsc(product1: Product, product2: Product) {
    const name1 = product1.masterData.current.name[this.LANG];
    const name2 = product2.masterData.current.name[this.LANG];
    if (name1 > name2) {
      return 1;
    }
    if (name1 < name2) {
      return -1;
    }
    return 0;
  }

  private sortByNameDesc(product1: Product, product2: Product) {
    const name1 = product1.masterData.current.name[this.LANG];
    const name2 = product2.masterData.current.name[this.LANG];
    if (name1 > name2) {
      return -1;
    }
    if (name1 < name2) {
      return 1;
    }
    return 0;
  }

  private sortByPriceDesc(product1: Product, product2: Product) {
    const price1 = this.getProductPrice(product1);

    const price2 = this.getProductPrice(product2);

    if (price1 > price2) {
      return -1;
    }
    if (price1 < price2) {
      return 1;
    }
    return 0;
  }

  private sortByPriceAsc(product1: Product, product2: Product) {
    const price1 = this.getProductPrice(product1);

    const price2 = this.getProductPrice(product2);

    if (price1 > price2) {
      return 1;
    }
    if (price1 < price2) {
      return -1;
    }
    return 0;
  }

  private getProductPrice(product: Product): number {
    const priceElement = product.masterData.current.masterVariant.prices?.find(
      (price) => price.country === this.COUNTRY
    );
    const price = priceElement ? priceElement.value.centAmount : 0;
    const discount = price ? priceElement?.discounted?.value.centAmount : 0;

    return discount || price;
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
