import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { createAnonim } from './sdk/with-anonimous-flow';
import { createUser } from './sdk/with-password-flow';
import QueryParamType from './sdk/type';

type LoginData = {
  email: string;
  password: string;
};

export enum Template {
  ATTRIBUTE_MASK = 'masterData(current(masterVariant(attributes(name="%ATTRIBUTE%" and value(key in (%VALUE%))))))',
  ATTRIBUTE_DEVELOPER_MASK = 'masterData(current(masterVariant(attributes(name="%ATTRIBUTE%" and value in (%VALUE%)))))',
  WHERE_PRICE_MASK = 'masterData(current(masterVariant(prices(country="%COUNTY%" and value(centAmount>=%MIN_PRICE%) and value(centAmount<=%MAX_PRICE%)))))',
}

export default class ProductApi {
  private clientRoot = createApiBuilderFromCtpClient(createAnonim()).withProjectKey({ projectKey: 'best-games' });

  private MAX_PRODUCTS = 500;

  constructor(loginData?: LoginData) {
    if (loginData) {
      const userClient = createUser(loginData.email, loginData.password);
      this.clientRoot = createApiBuilderFromCtpClient(userClient).withProjectKey({ projectKey: 'best-games' });
    }
  }

  // получить все товары - это основной метод, но ниже есть еще способы получать товары.
  // можно пробовать подставлять в методы .get({ queryArgs: -  и как то фильтровать
  public getProducts() {
    return this.clientRoot.products().get().execute();
  }

  public getAllProducts() {
    return this.clientRoot
      .products()
      .get({
        queryArgs: {
          limit: this.MAX_PRODUCTS,
        },
      })
      .execute();
  }

  public getConditionalProducts(params: QueryParamType) {
    const args = { ...params };

    if (!args?.limit) {
      args.limit = this.MAX_PRODUCTS;
    }
    console.log('args: ', args);

    return this.clientRoot
      .products()
      .get({
        queryArgs: args,
      })
      .execute();
  }

  /**
   * Return products, find out by description
   * @param toSearch string
   * @returns void
   */
  public getSearchProducts(toSearch: string) {
    return this.clientRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          'text.en': toSearch,
          fuzzy: true,
          facet: ['description.en'],
          limit: this.MAX_PRODUCTS,
        },
      })
      .execute();
  }

  public getProductsByCategory() {
    const args = {
      filter: [
        'categories.id: "ef9b4220-19e7-413a-8778-37e3ba0c0e4c"',
        // 'variants.scopedPrice.value.centAmount:range (* to 2100)', // to filter by price range
        'variants.scopedPrice.discounted.value.centAmount:range (* to 2100)', // to filter by price range
        // 'variants.price.centAmount: range(* to 10000)',
      ],
      limit: this.MAX_PRODUCTS,
      fuzzy: false,
      country: 'US', //--------------
      priceCountry: 'US', //  needed to include add ScopePrice to resultset
      priceCurrency: 'USD', //--------------
      // 'variants.scopedPriceDiscounted': true,
      sort: ['variants.scopedPrice.discounted.value.centAmount asc'],
      // sort: ['variants.scopedPrice.value.centAmount asc'],

      // sort: ['name.en desc'],
    };

    console.log('getProductsByCategory args: ', args);

    return this.clientRoot
      .productProjections()
      .search()
      .get({
        queryArgs: args,
      })
      .execute();
  }

  public getCategories() {
    // return this.clientRoot.categories().withKey({ key: 'action' }).get().execute();
    return this.clientRoot
      .categories()
      .get({
        queryArgs: {
          expand: 'ancestors.id',
        },
      })
      .execute();
  }

  // получить один товар по id
  public getProductbyID(productID: string) {
    return this.clientRoot.products().withId({ ID: productID }).get().execute();
  }

  // получить один товар по key
  public getProductbyKey(productKey: string) {
    return this.clientRoot.products().withKey({ key: productKey }).get().execute();
  }

  // получить один товар по id с аргументами
  public productProjectionResponseID(productID: string) {
    return this.clientRoot
      .productProjections()
      .withId({ ID: productID })
      .get({
        queryArgs: {
          staged: true,
        },
      })
      .execute();
  }

  // получить один товар по key с аргументами
  public productProjectionResponseKEY(productKey: string) {
    return this.clientRoot
      .productProjections()
      .withKey({ key: productKey })
      .get({
        queryArgs: {
          staged: true,
          // priceCurrency: 'priceCurrency',
        },
      })
      .execute();
  }
}
