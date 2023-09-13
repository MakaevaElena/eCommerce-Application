import ClientApi from './client-api';
import ProductApi from './products-api';
import RegApi from './reg-api';
import createAnonim from './sdk/with-anonimous-flow';

type ApiCollection = {
  clientApi: ClientApi;
  productApi: ProductApi;
  regApi: RegApi;
};

export default class CommonApi {
  static instance: CommonApi = new CommonApi();

  static anonimClient = createAnonim();

  private api: ApiCollection = {
    clientApi: new ClientApi(CommonApi.anonimClient),
    productApi: new ProductApi(),
    regApi: new RegApi(),
  };

  constructor() {
    if (!CommonApi.instance) {
      CommonApi.instance = this;
    }
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
