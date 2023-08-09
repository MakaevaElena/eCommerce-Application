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
  private params: RouterHandlerParam;

  constructor(params: RouterHandlerParam) {
    this.params = params;
  }

  public disable() {
    window.removeEventListener(this.params.nameEvent, this.params.callback.bind(this));
  }

  public navigate(url: string) {
    // const location: string = window.location[this.params.locationField].slice(1);
    // const urlString: string = url || location;
    // const fullPath = urlString.split('/');
    const fullPath = url.split('/');
    const result: RequestParams = {
      path: '',
      resource: '',
    };

    [result.path = '', result.resource = ''] = fullPath;

    this.params.callback(result);
  }
}
