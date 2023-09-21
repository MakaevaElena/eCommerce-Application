import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { Client } from '@commercetools/sdk-client-v2';
import createAnonim from './sdk/with-anonimous-flow';
import { CTP_PROJECT_KEY } from './sdk/const';
import { QueryParamType } from './sdk/type';

export enum Template {
  ENUM_ATTRIBUTE_MASK = 'variants.attributes.%ATTRIBUTE%.key:%VALUE%',
  TEXT_ATTRIBUTE_MASK = 'variants.attributes.%ATTRIBUTE%:%VALUE%',
  PRICE_FILTER_MASK = 'variants.scopedPrice.currentValue.centAmount:range (%MIN% to %MAX%)',
}

export default class ProductApi {
  private clientRoot;

  private MAX_PRODUCTS = 500;

  constructor(client?: Client) {
    if (client) {
      this.clientRoot = createApiBuilderFromCtpClient(client).withProjectKey({ projectKey: CTP_PROJECT_KEY });
    } else {
      this.clientRoot = createApiBuilderFromCtpClient(createAnonim()).withProjectKey({ projectKey: CTP_PROJECT_KEY });
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

  public getProducts(args?: QueryParamType) {
    const params = args ? { ...args } : {};

    return this.clientRoot
      .productProjections()
      .search()
      .get({
        queryArgs: params,
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
        },
      })
      .execute();
  }
}
