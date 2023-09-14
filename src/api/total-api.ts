import { Client } from '@commercetools/sdk-client-v2';
import ClientApi from './client-api';
import ProductApi from './products-api';
import RegApi from './reg-api';

export default class TotalApi {
  private clientApi: ClientApi;

  private productApi: ProductApi;

  private regApi: RegApi;

  public timestamp: string;

  constructor(client: Client) {
    this.timestamp = new Date().toLocaleTimeString();
    console.log('CREATE TotalApi: ', this.timestamp);

    this.clientApi = new ClientApi(client);
    this.productApi = new ProductApi(client);
    this.regApi = new RegApi(client);
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getClientApi() {
    return this.clientApi;
  }

  public getProductApi() {
    return this.productApi;
  }

  public getRegApi() {
    return this.regApi;
  }
}
