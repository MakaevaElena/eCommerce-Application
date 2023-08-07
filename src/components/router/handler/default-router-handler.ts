export type RequestParams = {
  path: string;
  resource: string;
};

export type RouterHandlerParam = {
  nameEvent: string;
  locationField: string;
  callback: (requestParams: RequestParams) => void;
};

export default class DefaultRouterHandler {
  constructor(params: RouterHandlerParam) {
    this.params = params;
  }

  public disable() {
    window.removeEventListener(this.params.nameEvent, this.params.callback.bind(this));
  }

  public navigate(url: string) {
    const urlString = url || window.location[this.params.locationField].slice(1);

    const result = {};
    const path = urlString.split('/');
    [result.path = '', result.resource = ''] = path;

    this.params.callback(result);
  }
}
