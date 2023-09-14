import { ProductProjection } from '@commercetools/platform-sdk';
import TagName from '../../../../enum/tag-name';
import TagElement from '../../../../utils/create-tag-element';
import { ElementParams } from '../../../../utils/element-creator';
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
import WarningMessage from '../../../message/warning-message';
import { QueryParamType } from '../../../../api/sdk/type';
import Pagination, { PaginationConfig } from '../../../shared/pagination/pagination';
import PaginationPosition from './enum/pagination-position';
import Spinner from '../../../shared/spinner/spinner';
import TotalApi from '../../../../api/total-api';

export default class CatalogView extends DefaultView {
  private readonly LANG = 'en-US';

  private readonly COUNTRY = 'US';

  private readonly CARDS_COUNT = 6;

  private readonly NOT_FOUND = 'Products not found';

  private readonly MESSAGE_CUSTOMER_ID_NOT_FOUND = 'Customer ID not found';

  private api: TotalApi;

  private router: Router;

  private pagination: Pagination[] = [];

  private paginationConfig: PaginationConfig;

  private cardsWrapper: HTMLDivElement;

  private cards: ProductCard[] = [];

  private controlsWrapper: HTMLDivElement;

  private filter: Filter;

  private search: SearchInput;

  private sorting: SortView;

  private observer = Observer.getInstance();

  private spinner = new Spinner();

  constructor(router: Router, api: TotalApi) {
    const params: ElementParams = {
      tag: TagName.SECTION,
      classNames: [styleCss['catalog-view']],
      textContent: '',
    };
    super(params);

    this.api = api;

    this.filter = new Filter(this.api);

    this.search = new SearchInput(this.dispatchSearch.bind(this));

    this.sorting = new SortView();

    this.router = router;

    this.paginationConfig = {
      total: 0,
      limit: this.CARDS_COUNT,
      offset: 0,
      currentPage: 0,
    };

    this.pagination.push(new Pagination(this.paginationConfig, this.pagination, this.dispatchDataQuery.bind(this)));
    this.pagination.push(new Pagination(this.paginationConfig, this.pagination, this.dispatchDataQuery.bind(this)));
    this.initPagination();

    this.observer.subscribe(EventName.UPDATE_CATALOG_CARDS, this.recallProductCards.bind(this));
    this.observer.subscribe(EventName.UPDATE_CART, this.checkProductsInCart.bind(this));

    this.controlsWrapper = new TagElement().createTagElement('div', [styleCss['controls-wrapper']]);

    this.cardsWrapper = new TagElement().createTagElement('div', [styleCss['content-wrapper']]);

    this.getElement().append(this.spinner.getElement(), this.cardsWrapper);

    this.configView();
  }

  private dispatchDataQuery() {
    if (this.search.getSearchString()) {
      this.getSearchProducts();
    } else {
      this.getProducts();
    }
  }

  private dispatchSearch() {
    this.pagination.forEach((pagination) => pagination.initConfig(this.paginationConfig));
    this.getSearchProducts();
  }

  private initPagination() {
    this.observer.notify(EventName.SPINNER_SHOW);
    this.api
      .getProductApi()
      .getProducts({ limit: 0 })
      .then((response) => {
        this.paginationConfig.total = response.body?.total || 0;
        this.pagination.forEach((pagination) => pagination.initConfig(this.paginationConfig));
      })
      .catch((error) => new ErrorMessage().showMessage(error.message))
      .finally(() => this.observer.notify(EventName.SPINNER_HIDE));
  }

  /**
   * Set visibility cards' button Add to/Remove from cart
   */
  private checkProductsInCart() {
    this.cards.forEach((card) => {
      card.setProductInCart(Math.random() > 0.5);
    });
    // const customerId = localStorage.getItem(LocalStorageKeys.ANONYMOUS_ID);
    // if (!customerId) {
    //   new ErrorMessage().showMessage(this.MESSAGE_CUSTOMER_ID_NOT_FOUND);
    //   return;
    // }
    // this.clientApi
    //   // .getCartByCustomerId(customerId)
    //   .getCustomerByID(customerId)
    //   .then((response) => {
    //     console.log('response: ', response);
    // TODO get products in cart
    // const productsInCart: ProductProjection[] = response.body. ??;
    // this.cards.forEach((card) => {
    //   card.setProductInCart(productsInCart.includes(card.id));
    // });
    // })
    // .catch((error) => {
    //   if (error instanceof Error) {
    //     new ErrorMessage().showMessage(error.message);
    //   }
    // });
  }

  private recallProductCards() {
    this.search.clear();
    this.pagination.forEach((pagination) => pagination.initConfig(this.paginationConfig));
    this.getProducts();
  }

  private configView() {
    const filterHeader = this.filter.getFilterHeaderElement();
    const sortingElement = this.sorting.getElement();

    this.controlsWrapper.append(filterHeader, this.search.getElement(), sortingElement);
    this.getElement().append(
      this.controlsWrapper,
      this.pagination[PaginationPosition.PAGINATION_TOP].getElement(),
      this.cardsWrapper,
      this.pagination[PaginationPosition.PAGINATION_BOTTOM].getElement()
    );
    this.getProducts();
  }

  private getSearchProducts() {
    const searchString = this.search.getSearchString();

    if (!searchString) {
      this.getProducts();
    } else {
      const params = this.getSearchQueryParams(searchString);
      params.limit = this.paginationConfig.limit;
      params.offset = this.paginationConfig.offset;

      this.observer.notify(EventName.SPINNER_SHOW);
      this.api
        .getProductApi()
        .getProducts(params)
        .then((response) => {
          if (response.body?.total || 0) {
            if (this.paginationConfig.total !== response.body?.total || 0) {
              this.paginationConfig.total = response.body?.total || 0;
              this.pagination.forEach((pagination) => pagination.setupButtons());
            }
          }
          const products = response.body.results;
          if (products.length) {
            this.filter.clearFilters();
            this.createProductCards(products);
          } else {
            new WarningMessage().showMessage(this.NOT_FOUND);
          }
        })
        .catch((error) => new ErrorMessage().showMessage(error.message))
        .finally(() => this.observer.notify(EventName.SPINNER_HIDE));
    }
  }

  private getProducts() {
    const params: QueryParamType = this.getQueryParams();
    params.limit = this.paginationConfig.limit;
    params.offset = this.paginationConfig.offset;

    this.observer.notify(EventName.SPINNER_SHOW);
    this.api
      .getProductApi()
      .getProducts(params)
      .then((response) => {
        if (this.paginationConfig.total !== response.body?.total || 0) {
          this.paginationConfig.total = response.body?.total || 0;
          this.pagination.forEach((pagination) => pagination.setupButtons());
        }
        this.paginationConfig.total = response.body?.total || 0;
        const products = response.body.results;
        this.createProductCards(products);

        if (!products.length) {
          new WarningMessage().showMessage(this.NOT_FOUND);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          new ErrorMessage().showMessage(error.message);
        }
      })
      .finally(() => this.observer.notify(EventName.SPINNER_HIDE));
  }

  private getQueryParams(): QueryParamType {
    const params: QueryParamType = {
      fuzzy: false,
      priceCountry: 'US',
      priceCurrency: 'USD',
      markMatchingVariants: true,
      sort: this.sorting.getSortCondition(),
    };

    const filter = this.filter.getFilterCondition();
    if (filter.length) {
      params.filter = filter;
    }
    const sortOrder = this.sorting.getSortCondition();
    if (sortOrder) {
      params.sort = sortOrder;
    }

    return params;
  }

  // eslint-disable-next-line class-methods-use-this
  private getSearchQueryParams(searchString: string): QueryParamType {
    const params: QueryParamType = {
      'text.en': searchString,
      fuzzy: true,
      priceCountry: 'US',
      priceCurrency: 'USD',
      markMatchingVariants: true,
    };
    return params;
  }

  private createProductCards(products: ProductProjection[]) {
    this.cardsWrapper.replaceChildren('');
    this.cards.length = 0;
    products.forEach((product) => {
      if (product.key) {
        const card = new ProductCard(product, this.router);
        this.cards.push(card);
        this.cardsWrapper.append(card.getElement());
      }
    });
    this.checkProductsInCart();
  }
}
