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

  ENUM_ATTRIBUTE_MASK = 'variants.attributes.%ATTRIBUTE%.key:%VALUE%',
  TEXT_ATTRIBUTE_MASK = 'variants.attributes.%ATTRIBUTE%:%VALUE%',
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

  public getProducts(args: QueryParamType) {
    const params = { ...args };
    // params.filter = 'variants.scopedPrice.value.centAmount:range (* to 2100)';

    return this.clientRoot
      .productProjections()
      .search()
      .get({
        queryArgs: params,
      })
      .execute();
  }

  public getProductsByCategory() {
    const args = {
      filter: [
        'variants.attributes.Platform.key:"PC"', // filter by attribute which is enum
        'variants.attributes.genre.key:"action","horror"', // filter by attribute which is enum
        // 'variants.attributes.genre.key:"horror"', // filter by attribute which is enum
        // 'variants.attributes.{name}:"{value}"', // filter by attribute which is text
        // 'categories.id: "ef9b4220-19e7-413a-8778-37e3ba0c0e4c"', // filter by category
      ],
      limit: this.MAX_PRODUCTS,
      fuzzy: false,

      markMatchingVariants: true,
      priceCountry: 'US', //  needed to include ScopePrice to resultset
      priceCurrency: 'USD', //  needed to include ScopePrice to resultset

      // sort: ['variants.scopedPrice.currentValue.centAmount asc'],
      // sort: ['variants.scopedPrice.discounted.value.centAmount asc'],
      // sort: ['variants.scopedPrice.value.centAmount asc'],

      // sort: ['name.en desc'],
      // sort: ['name.en asc'],
    };

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
