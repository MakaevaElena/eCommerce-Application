import { Client } from '@commercetools/sdk-client-v2';
import ClientApi from './client-api';
import ProductApi from './products-api';
import RegApi from './reg-api';
import createAnonim from './sdk/with-anonimous-flow';
import createUser from './sdk/with-password-flow';

type ApiCollection = {
  clientApi: ClientApi;
  productApi: ProductApi;
  regApi: RegApi;
};

export default class CommonApi {
  static instance: CommonApi = new CommonApi();

  private client = createAnonim();
  // private client = createUser('aa@aa.aa', '12345!qQ');

  private api: ApiCollection = {
    clientApi: new ClientApi(this.client),
    productApi: new ProductApi(this.client),
    regApi: new RegApi(this.client),
  };

  constructor() {
    if (!CommonApi.instance) {
      CommonApi.instance = this;
    }
  }

  public recreate(client: Client) {
    this.client = client;
    this.api = {
      clientApi: new ClientApi(this.client),
      productApi: new ProductApi(this.client),
      regApi: new RegApi(this.client),
    };
  }

  public static getInstance(): CommonApi {
    return CommonApi.instance;
  }

  public getClientApi() {
    return this.api.clientApi;
  }

  public getProductApi() {
    return this.api.productApi;
  }

  public getRegApi() {
    return this.api.regApi;
  }
}
