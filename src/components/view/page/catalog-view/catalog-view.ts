import { Product, ProductProjection } from '@commercetools/platform-sdk';
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
import SearchInput from '../../../shared/search-input/search-input';
import SearchProductCard from '../../../shared/product-card/search-product-card';
import WarningMessage from '../../../message/warning-message';
import QueryParamType from '../../../../api/sdk/type';

export default class CatalogView extends DefaultView {
  private readonly LANG = 'en-US';

  private readonly COUNTRY = 'US';

  private readonly NOT_FOUND = 'Products not found';

  private readonly MAX_PRODUCTS = 500;

  private router: Router;

  private cardsWrapper: HTMLDivElement;

  private controlsWrapper: HTMLDivElement;

  private productApi = new ProductApi();

  private filter: Filter;

  private search: SearchInput;

  private sorting: SortView;

  private observer = Observer.getInstance();

  private sortMapping = [this.sortByNameAsc, this.sortByNameDesc, this.sortByPriceAsc, this.sortByPriceDesc];

  constructor(router: Router) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['catalog-view']],
      textContent: '',
    };
    super(params);

    this.filter = new Filter(this.productApi);

    this.search = new SearchInput(this.getSearchProducts.bind(this));

    this.sorting = new SortView();

    this.router = router;

    this.observer.subscribe(EventName.UPDATE_CATALOG_CARDS, this.recallProductCards.bind(this));

    this.controlsWrapper = new TagElement().createTagElement('div', [styleCss['controls-wrapper']]);

    this.cardsWrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getCreator().addInnerElement(this.cardsWrapper);

    this.configView();

    this.getCategories();
  }

  private recallProductCards() {
    this.search.clear();
    this.getConditionalProducts();
  }

  private getCategories() {
    this.productApi.getCategories().then((response) => console.log(response));
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

    this.controlsWrapper.append(filterHeader, this.search.getElement(), sortingElement);
    this.getElement().append(this.controlsWrapper, this.cardsWrapper);
    this.getConditionalProducts();
  }

  private getSearchProducts() {
    const searchString = this.search.getElement().value.trim();

    if (!searchString) {
      this.getConditionalProducts();
    } else {
      this.productApi
        .getSearchProducts(searchString)
        .then((response) => {
          const productProjections = response.body.results;
          if (productProjections.length) {
            this.filter.clearFilters();
            this.createSearchProductCards(productProjections);
          } else {
            new WarningMessage().showMessage(this.NOT_FOUND);
          }
        })
        .catch((error) => new ErrorMessage().showMessage(error.message));
    }
  }

  private getConditionalProducts() {
    const params: QueryParamType = {};
    const filters: string[] = [];

    const where = this.filter.getWhereCondition();
    if (where) {
      params.where = where;
    }

    if (filters.length) {
      params.filter = filters.join(' and ');
    }

    this.productApi
      .getConditionalProducts(params)
      .then((response) => {
        const products = response.body.results;

        this.sortProducts(products);
        this.createProductCards(products);
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      });
  }

  private getProducts() {
    const params: QueryParamType = this.getQueryParams();

    console.log('params: ', params);

    this.productApi
      .getProducts(params)
      .then((response) => {
        const products = response.body.results;

        console.log('getProducts products: ', products);

        if (products.length) {
          this.createSearchProductCards(products);
        } else {
          new WarningMessage().showMessage(this.NOT_FOUND);
        }
      })
      .catch((error) => new ErrorMessage().showMessage(error.message));
  }

  private sortProducts(products: Product[]) {
    const sortOrder = this.sorting.getSortCondition();
    products.sort(this.sortMapping[sortOrder].bind(this));
  }

  private getQueryParams(): QueryParamType {
    const sortMapping = [
      'name.en asc',
      'name.en desc',
      'variants.scopedPrice.discounted.value.centAmount asc',
      'variants.scopedPrice.discounted.value.centAmount desc',
    ];

    const params: QueryParamType = {
      limit: this.MAX_PRODUCTS,
      fuzzy: false,
      priceCountry: 'US',
      priceCurrency: 'USD',
      sort: sortMapping[this.sorting.getSortCondition()],
    };

    const filter = this.filter.getFilterCondition();
    if (filter.length) {
      params.filter = filter;
    }
    params.sort = sortMapping[this.sorting.getSortCondition()];

    return params;
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

  private createSearchProductCards(products: ProductProjection[]) {
    this.cardsWrapper.replaceChildren('');
    products.forEach((product) => {
      if (product.key) {
        const card = new SearchProductCard(product, this.router);
        this.cardsWrapper.append(card.getElement());
      }
    });
  }
}
