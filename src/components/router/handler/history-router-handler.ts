export type RequestParams = {
  path: string;
  resource: string;
};

export type RouterHandlerParam = {
  nameEvent: string;
  locationField: string;
  // callback: (requestParams: RequestParams) => void;
};

export default class HistoryRouterHandler {
  private params: RouterHandlerParam;

  constructor(callback: (params: )) {
    this.params = params;
  }

  public disable() {
    window.removeEventListener(this.params.nameEvent, this.params.callback.bind(this));
  }

  public navigate(url: string) {
    const urlString = url || window.location[this.params.locationField].slice(1);

    const fullPath = urlString.split('/');
    const result: RequestParams = {
      path: '',
      resource: '',
    };

    [result.path = '', result.resource = ''] = fullPath;

    this.params.callback(result);
  }
}
