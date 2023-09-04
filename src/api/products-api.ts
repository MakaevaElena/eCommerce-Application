import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { createAnonim } from './sdk/with-anonimous-flow';
import { createUser } from './sdk/with-password-flow';

type LoginData = {
  email: string;
  password: string;
};

export enum Template {
  ATTRIBUTE_MASK = 'masterData(current(masterVariant(attributes(name="%ATTRIBUTE%" and value(key in (%VALUE%))))))',
  ATTRIBUTE_DEVELOPER_MASK = 'masterData(current(masterVariant(attributes(name="%ATTRIBUTE%" and value in (%VALUE%)))))',
  WHERE_PRICE_MASK = 'masterData(current(masterVariant(prices(country="%COUNTY%" and value(centAmount>=%MIN_PRICE%) and value(centAmount<=%MAX_PRICE%)))))',
  DEFAULT_WHERE = 'masterData(current(masterVariant(attributes(name>""))))',
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

  public getConditionalProducts(where?: string) {
    const whereCondition = where || Template.DEFAULT_WHERE;

    return this.clientRoot
      .products()
      .get({
        queryArgs: {
          limit: this.MAX_PRODUCTS,
          // where: 'masterData(current(masterVariant(prices(country="US" and value(centAmount=5300)))))',
          where: whereCondition,
          // sort: ''
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
